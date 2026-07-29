import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

import sharp from 'sharp';
import { afterEach, describe, expect, it } from 'vitest';

const desktopPoster = 'public/media/hero/ulixes-signal-desktop-poster.avif';
const originalDesktopPoster = readFileSync(desktopPoster);

afterEach(() => {
  writeFileSync(desktopPoster, originalDesktopPoster);
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
