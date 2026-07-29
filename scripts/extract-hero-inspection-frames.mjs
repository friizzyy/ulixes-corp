import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

import ffmpegPath from 'ffmpeg-static';

const outputDirectory = 'design-assets/hero/inspection-frames';
const samples = [
  ['0', '0'],
  ['1-5', '1.5'],
  ['3', '3'],
  ['4-5', '4.5'],
  ['5-966', '5.966'],
];
const sources = {
  desktop: 'design-assets/hero/ulixes-signal-desktop-master-4k.mp4',
  mobile: 'public/media/hero/ulixes-signal-mobile-1080.mp4',
};

for (const source of Object.values(sources)) {
  if (!existsSync(source)) {
    throw new Error(`Missing required inspection source: ${source}`);
  }
}

mkdirSync(outputDirectory, { recursive: true });

for (const [kind, source] of Object.entries(sources)) {
  for (const [name, timestamp] of samples) {
    execFileSync(
      ffmpegPath,
      [
        '-v',
        'error',
        '-y',
        '-i',
        source,
        '-ss',
        timestamp,
        '-frames:v',
        '1',
        path.join(outputDirectory, `${kind}-${name}.png`),
      ],
      { stdio: 'inherit' },
    );
  }
}

console.log('Hero inspection frames extracted.');
