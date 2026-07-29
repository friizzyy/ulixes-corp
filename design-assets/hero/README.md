# Ulixes hero media provenance

## Source and generation record

- Approved source still: `/Users/frizzy/.codex/generated_images/019faf62-048c-7932-a78a-64af5b2d5ea9/exec-02e3477d-567b-4c3e-8438-87ff8160af3b.png`
- Higgsfield source-upload job: `8205e745-26bc-4551-ad63-aca2570104dd`
- Desktop 4K still job: `371831d3-ca70-4d3f-88ea-5b3af29c54a3`
- Mobile 4K still job: `4ddab8f3-6ebb-4bce-bf6f-e463f03d8d2f`
- Desktop 4K loop job: `a1e7e43f-ac25-4366-8643-0d004d015a38`
- Mobile 4K loop job: `5c9207b8-bdb9-49c7-9d42-8e9bc654447d`

The stills used `nano_banana_pro` at native 4K. The loops used `seedance_2_0` with the approved still supplied as both the start and end image, `duration: 6`, `resolution: "4k"`, `mode: "std"`, `bitrate_mode: "high"`, and `generate_audio: false`. The desktop loop used `aspect_ratio: "16:9"`; the mobile loop used `aspect_ratio: "9:16"`. The motion direction was a locked camera with one restrained ultraviolet pulse, no geometry changes, and no audio.

Local master files (intentionally ignored) are:

- `design-assets/hero/ulixes-signal-desktop-master-4k.mp4` — HEVC, 3840x2160, 6.042 s, silent, 4,962,740 bytes.
- `design-assets/hero/ulixes-signal-mobile-master-4k.mp4` — HEVC, 2160x3840, 6.042 s, silent, 4,333,791 bytes.

Measured master seamless-loop SSIM values are `0.995206` (desktop) and `0.995965` (mobile).

## Browser derivatives

`npm run media:prepare` runs `scripts/prepare-hero-media.mjs`, which creates these deterministic encodes from the local masters. The WebM commands use FFmpeg's bitexact mux/codec flags and a fixed creation timestamp so that the full container—not only the VP9 stream—is reproducible:

```text
desktop WebM: ffmpeg -bitexact -i <desktop-master> -map_metadata -1 -fflags +bitexact -flags +bitexact -metadata creation_time=1970-01-01T00:00:00Z -vf scale=2560:1440 -c:v libvpx-vp9 -crf 24 -b:v 0 -row-mt 1 -an public/media/hero/ulixes-signal-desktop-1440.webm
desktop MP4:  ffmpeg -i <desktop-master> -vf scale=1920:1080 -c:v libx264 -crf 19 -preset slow -pix_fmt yuv420p -movflags +faststart -an public/media/hero/ulixes-signal-desktop-1080.mp4
mobile WebM:  ffmpeg -bitexact -i <mobile-master> -map_metadata -1 -fflags +bitexact -flags +bitexact -metadata creation_time=1970-01-01T00:00:00Z -vf 'crop=trunc(iw/1.16/2)*2:trunc(ih/1.16/2)*2:(iw-ow)/2:0,scale=1080:1920' -c:v libvpx-vp9 -crf 25 -b:v 0 -row-mt 1 -an public/media/hero/ulixes-signal-mobile-1080.webm
mobile MP4:   ffmpeg -i <mobile-master> -vf 'crop=trunc(iw/1.16/2)*2:trunc(ih/1.16/2)*2:(iw-ow)/2:0,scale=1080:1920' -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -movflags +faststart -an public/media/hero/ulixes-signal-mobile-1080.mp4
```

Frame-zero posters are created with Sharp as AVIF files at quality 56 and effort 8. To preserve the mobile text-safe area without regenerating the master, both mobile browser encodes and the mobile poster take the same uniform 1.16x, top-anchored crop (about 86% of each source dimension, horizontally centered) before scaling to 1080x1920. Temporary poster-frame PNGs are ignored and removed after a successful AVIF write.

The repeatability proof uses full-file SHA-256 values, not only video-stream hashes. Two consecutive `npm run media:prepare` runs produce `bb15cc6e87268285d90a97b2b06e603fbe98d2985917d3094a7f21245ce68113` for `ulixes-signal-desktop-1440.webm` and `c51f334c6513bc94c5507b2753ee7996a714037d7c38c322399534c60bd2e370` for `ulixes-signal-mobile-1080.webm`; the second run leaves the tracked tree clean.

## Five-point inspection

Inspection frames are local, ignored files under `design-assets/hero/inspection-frames/`, sampled at 0, 1.5, 3, 4.5, and 5.966 seconds. Run `npm run media:inspect` to recreate all ten: desktop frames come from the 4K desktop master, while mobile frames come from the corrected `public/media/hero/ulixes-signal-mobile-1080.mp4` delivery asset. Each was visually reviewed at its delivered/original resolution for copy-zone clearance, banding, geometry stability, and luminance continuity.

| Evidence source | Time (s) | Copy-zone clearance | Banding | Geometry stability | Luminance continuity | Result |
| --- | ---: | --- | --- | --- | --- | --- |
| Desktop | 0 | PASS | PASS | PASS | PASS | PASS |
| Desktop | 1.5 | PASS | PASS | PASS | PASS | PASS |
| Desktop | 3 | PASS | PASS | PASS | PASS | PASS |
| Desktop | 4.5 | PASS | PASS | PASS | PASS | PASS |
| Desktop | 5.966 | PASS | PASS | PASS | PASS | PASS |
| Mobile delivery | 0 | PASS | PASS | PASS | PASS | PASS |
| Mobile delivery | 1.5 | PASS | PASS | PASS | PASS | PASS |
| Mobile delivery | 3 | PASS | PASS | PASS | PASS | PASS |
| Mobile delivery | 4.5 | PASS | PASS | PASS | PASS | PASS |
| Mobile delivery | 5.966 | PASS | PASS | PASS | PASS | PASS |

Desktop copy-zone luminance stayed between 15.59 and 15.88 (8-bit luma mean). The corrected mobile delivery copy-zone luminance stayed between 3.01 and 3.37. The uncropped mobile master has a static rail near y≈47%, which is outside its intended protected-zone allowance. The delivery crop moves that rail to approximately y≈55%; the five delivery-frame checks above are the final browser-art-direction verdict. No visible color banding, camera movement, geometry growth, or abrupt full-frame luminance transition was observed, and no replacement was generated.

## Verification

`npm run media:verify` checks the four video dimensions, duration (5.9–6.1 seconds), audio absence, file-size budgets, poster presence and budgets, and first-to-final-frame SSIM (minimum 0.98). It also decodes each poster with Sharp, requires `image/avif`, and checks the exact poster dimensions (2560x1440 desktop, 1080x1920 mobile), rejecting empty, corrupt, wrong-format, or wrong-size fallbacks. It passed on the tracked browser outputs.
