import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';

import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import ffmpegPath from 'ffmpeg-static';
import sharp from 'sharp';

const expected = [
  ['public/media/hero/ulixes-signal-desktop-1440.webm', 2560, 1440, 8_000_000],
  ['public/media/hero/ulixes-signal-desktop-1080.mp4', 1920, 1080, 7_000_000],
  ['public/media/hero/ulixes-signal-mobile-1080.webm', 1080, 1920, 4_500_000],
  ['public/media/hero/ulixes-signal-mobile-1080.mp4', 1080, 1920, 4_500_000],
];

const posters = [
  ['public/media/hero/ulixes-signal-desktop-poster.avif', 2560, 1440, 350_000],
  ['public/media/hero/ulixes-signal-mobile-poster.avif', 1080, 1920, 220_000],
];

function fail(message) {
  throw new Error(message);
}

function requireFile(file, maxBytes) {
  if (!existsSync(file)) {
    fail(`Missing required media: ${file}`);
  }

  const size = statSync(file).size;
  if (size === 0) {
    fail(`${file} is empty`);
  }
  if (size > maxBytes) {
    fail(`${file} is ${size} bytes; budget is ${maxBytes} bytes`);
  }
}

async function verifyPoster(file, width, height, maxBytes) {
  requireFile(file, maxBytes);

  let metadata;
  try {
    metadata = await sharp(file, { failOn: 'error' }).metadata();
  } catch (error) {
    fail(`${file} is not decodable: ${error.message}`);
  }

  if (metadata.mediaType !== 'image/avif') {
    fail(`${file} media type is ${metadata.mediaType}; expected image/avif`);
  }
  if (metadata.width !== width || metadata.height !== height) {
    fail(`${file} is ${metadata.width}x${metadata.height}; expected ${width}x${height}`);
  }
}

function probe(file) {
  return JSON.parse(
    execFileSync(
      ffprobeInstaller.path,
      ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file],
      { encoding: 'utf8' },
    ),
  );
}

function measureLoopSsim(file) {
  const output = execFileSync(
    ffmpegPath,
    [
      '-v',
      'error',
      '-i',
      file,
      '-sseof',
      '-0.05',
      '-i',
      file,
      '-filter_complex',
      '[0:v]select=eq(n\\,0),setpts=PTS-STARTPTS[first];[1:v]select=eq(n\\,0),setpts=PTS-STARTPTS[last];[first][last]ssim=stats_file=-',
      '-frames:v',
      '1',
      '-f',
      'null',
      '-',
    ],
    { encoding: 'utf8', maxBuffer: 1_000_000 },
  );
  const match = output.match(/\bAll:([0-9.]+)/);
  if (!match) {
    fail(`Could not read loop SSIM for ${file}`);
  }
  return Number(match[1]);
}

for (const [file, width, height, maxBytes] of expected) {
  requireFile(file, maxBytes);

  const metadata = probe(file);
  const videoStreams = metadata.streams.filter((stream) => stream.codec_type === 'video');
  const audioStreams = metadata.streams.filter((stream) => stream.codec_type === 'audio');
  if (videoStreams.length !== 1) {
    fail(`${file} must contain exactly one video stream`);
  }
  if (audioStreams.length > 0) {
    fail(`${file} must not contain audio`);
  }

  const [video] = videoStreams;
  if (video.width !== width || video.height !== height) {
    fail(`${file} is ${video.width}x${video.height}; expected ${width}x${height}`);
  }

  const duration = Number(metadata.format.duration ?? video.duration);
  if (!Number.isFinite(duration) || duration < 5.9 || duration > 6.1) {
    fail(`${file} duration is ${duration}; expected 5.9–6.1 seconds`);
  }

  const ssim = measureLoopSsim(file);
  if (ssim < 0.98) {
    fail(`${file} loop SSIM is ${ssim}; minimum is 0.98`);
  }
}

for (const [file, width, height, maxBytes] of posters) {
  await verifyPoster(file, width, height, maxBytes);
}

console.log('Hero media verification passed.');
