import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, unlinkSync } from 'node:fs';
import path from 'node:path';

import ffmpegPath from 'ffmpeg-static';
import sharp from 'sharp';

const outputDirectory = 'public/media/hero';
const masters = {
  desktop: 'design-assets/hero/ulixes-signal-desktop-master-4k.mp4',
  mobile: 'design-assets/hero/ulixes-signal-mobile-master-4k.mp4',
};

for (const master of Object.values(masters)) {
  if (!existsSync(master)) {
    throw new Error(`Missing required master: ${master}`);
  }
}

mkdirSync(outputDirectory, { recursive: true });

function encodeVideo(input, output, args) {
  const isWebm = output.endsWith('.webm');
  execFileSync(
    ffmpegPath,
    [
      '-v',
      'error',
      '-y',
      ...(isWebm ? ['-bitexact'] : []),
      '-i',
      input,
      '-map_metadata',
      '-1',
      ...(isWebm
        ? [
            '-fflags',
            '+bitexact',
            '-flags',
            '+bitexact',
            '-metadata',
            'creation_time=1970-01-01T00:00:00Z',
          ]
        : []),
      ...args,
      '-an',
      path.join(outputDirectory, output),
    ],
    { stdio: 'inherit' },
  );
}

encodeVideo(masters.desktop, 'ulixes-signal-desktop-1440.webm', [
  '-vf',
  'scale=2560:1440',
  '-c:v',
  'libvpx-vp9',
  '-crf',
  '24',
  '-b:v',
  '0',
  '-row-mt',
  '1',
]);

encodeVideo(masters.desktop, 'ulixes-signal-desktop-1080.mp4', [
  '-vf',
  'scale=1920:1080',
  '-c:v',
  'libx264',
  '-crf',
  '19',
  '-preset',
  'slow',
  '-pix_fmt',
  'yuv420p',
  '-movflags',
  '+faststart',
]);

encodeVideo(masters.mobile, 'ulixes-signal-mobile-1080.webm', [
  '-vf',
  'scale=1080:1920',
  '-c:v',
  'libvpx-vp9',
  '-crf',
  '25',
  '-b:v',
  '0',
  '-row-mt',
  '1',
]);

encodeVideo(masters.mobile, 'ulixes-signal-mobile-1080.mp4', [
  '-vf',
  'scale=1080:1920',
  '-c:v',
  'libx264',
  '-crf',
  '20',
  '-preset',
  'slow',
  '-pix_fmt',
  'yuv420p',
  '-movflags',
  '+faststart',
]);

async function encodePoster(input, basename, filter) {
  const temporaryFrame = path.join(
    'design-assets/hero',
    `${basename}-poster-frame.tmp.png`,
  );
  const output = path.join(outputDirectory, `${basename}-poster.avif`);

  execFileSync(
    ffmpegPath,
    [
      '-v',
      'error',
      '-y',
      '-i',
      input,
      '-vf',
      `select=eq(n\\,0),${filter}`,
      '-frames:v',
      '1',
      temporaryFrame,
    ],
    { stdio: 'inherit' },
  );

  await sharp(temporaryFrame).avif({ quality: 56, effort: 8 }).toFile(output);
  unlinkSync(temporaryFrame);
}

await encodePoster(masters.desktop, 'ulixes-signal-desktop', 'scale=2560:1440');
await encodePoster(
  masters.mobile,
  'ulixes-signal-mobile',
  'scale=1080:1920',
);

console.log('Hero media preparation completed.');
