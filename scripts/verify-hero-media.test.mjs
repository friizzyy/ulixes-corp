import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

import ffmpegPath from 'ffmpeg-static';
import sharp from 'sharp';
import { afterEach, describe, expect, it } from 'vitest';

const desktopPoster = 'public/media/hero/ulixes-signal-desktop-poster.avif';
const originalDesktopPoster = readFileSync(desktopPoster);
const desktopMp4 = 'public/media/hero/ulixes-signal-desktop-1080.mp4';
const originalDesktopMp4 = readFileSync(desktopMp4);

afterEach(() => {
  writeFileSync(desktopPoster, originalDesktopPoster);
  writeFileSync(desktopMp4, originalDesktopMp4);
});

function verify() {
  return () => execFileSync(process.execPath, ['scripts/verify-hero-media.mjs'], { stdio: 'pipe' });
}

describe('hero poster verification', () => {
  it('rejects a zero-byte poster', () => {
    writeFileSync(desktopPoster, '');
    expect(verify()).toThrow();
  });

  it('rejects a corrupt non-image poster payload', () => {
    writeFileSync(desktopPoster, 'this is not an image');
    expect(verify()).toThrow();
  });

  it('rejects a decodable image with the wrong format', async () => {
    const png = await sharp({
      create: { width: 2560, height: 1440, channels: 3, background: '#000000' },
    }).png().toBuffer();
    writeFileSync(desktopPoster, png);
    expect(verify()).toThrow();
  });

  it('rejects a valid AVIF with the wrong dimensions', async () => {
    const wrongSizeAvif = await sharp({
      create: { width: 1280, height: 720, channels: 3, background: '#000000' },
    }).avif().toBuffer();
    writeFileSync(desktopPoster, wrongSizeAvif);
    expect(verify()).toThrow();
  });
});

describe('hero video verification', () => {
  it('rejects a six-second delivery encoded below 30 fps', () => {
    execFileSync(
      ffmpegPath,
      [
        '-v',
        'error',
        '-y',
        '-f',
        'lavfi',
        '-i',
        'color=c=black:s=1920x1080:r=24:d=6',
        '-c:v',
        'libx264',
        '-preset',
        'ultrafast',
        '-pix_fmt',
        'yuv420p',
        desktopMp4,
      ],
      { stdio: 'pipe' },
    );

    expect(verify()).toThrow(/frame rate/i);
  });
});
