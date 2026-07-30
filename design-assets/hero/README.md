# Ulixes hero media provenance

## Source and generation record

- Approved source still: `/Users/frizzy/.codex/generated_images/019faf62-048c-7932-a78a-64af5b2d5ea9/exec-02e3477d-567b-4c3e-8438-87ff8160af3b.png`
- Higgsfield source-upload job: `8205e745-26bc-4551-ad63-aca2570104dd`
- Desktop 4K still job: `371831d3-ca70-4d3f-88ea-5b3af29c54a3`
- Mobile 4K still job: `4ddab8f3-6ebb-4bce-bf6f-e463f03d8d2f`
- Desktop 4K loop job: `a1e7e43f-ac25-4366-8643-0d004d015a38`
- Mobile 4K loop job: `5c9207b8-bdb9-49c7-9d42-8e9bc654447d`

The stills used `nano_banana_pro` at native 4K. The loops used `seedance_2_0` with the approved still supplied as both the start and end image, `duration: 6`, `resolution: "4k"`, `mode: "std"`, `bitrate_mode: "high"`, and `generate_audio: false`. The desktop loop used `aspect_ratio: "16:9"`; the mobile loop used `aspect_ratio: "9:16"`. The motion direction was a locked camera with one restrained ultraviolet pulse, no geometry changes, and no audio.

The untouched generation outputs are intentionally ignored and retained as sources:

| Source | Video | Duration | Frames | Bytes | SHA-256 |
| --- | --- | ---: | ---: | ---: | --- |
| `ulixes-signal-desktop-source-4k.mp4` | HEVC Main 10, 3840x2160, 24 fps, silent | 6.042 s | 145 | 4,962,740 | `1701c39593ccf44684f2030fabefc41225b2e1fb7955d14dd7f7638a3ac4b778` |
| `ulixes-signal-mobile-source-4k.mp4` | HEVC Main 10, 2160x3840, 24 fps, silent | 6.042 s | 145 | 4,333,791 | `6fb0524dca14176a141a47b721e4ddbdd8ac4c8d3fd8b2c52045a6ad1a681f37` |

Their measured seamless-loop SSIM values are `0.995206` (desktop) and `0.995965` (mobile).

## Normalized 4K masters

The ignored 4K masters are six-second, 30 fps, 180-frame, silent HEVC Main 10 intermediates. The `fps=30` conversion preserves source-frame detail rather than synthesizing motion. Both use x265's slow preset at CRF 14 and retain the BT.709 limited-range tags. The mobile normalization applies the approved uniform 1.16x crop at master level: 1862x3310 is cropped from the horizontal center and top edge, then Lanczos-scaled back onto a 2160x3840 4K canvas.

```text
desktop master: ffmpeg -i <desktop-source> -map_metadata -1 -vf 'trim=start=0:end=6,setpts=PTS-STARTPTS,fps=30' -c:v libx265 -preset slow -crf 14 -pix_fmt yuv420p10le -tag:v hvc1 -color_range tv -colorspace bt709 -color_trc bt709 -color_primaries bt709 -movflags +faststart -an <desktop-master>
mobile master:  ffmpeg -i <mobile-source> -map_metadata -1 -vf 'crop=trunc(iw/1.16/2)*2:trunc(ih/1.16/2)*2:(iw-ow)/2:0,scale=2160:3840:flags=lanczos,trim=start=0:end=6,setpts=PTS-STARTPTS,fps=30' -c:v libx265 -preset slow -crf 14 -pix_fmt yuv420p10le -tag:v hvc1 -color_range tv -colorspace bt709 -color_trc bt709 -color_primaries bt709 -movflags +faststart -an <mobile-master>
```

| Master | Video | Duration | Frames | Bytes | Loop SSIM | SHA-256 |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| `ulixes-signal-desktop-master-4k.mp4` | HEVC Main 10, 3840x2160, 30 fps, silent | 6.000 s | 180 | 5,343,004 | 0.995173 | `33b9e28ba79f6cabe418112acbc99c69c7c0cd28f43a25dae9556bcfdf98a705` |
| `ulixes-signal-mobile-master-4k.mp4` | HEVC Main 10, 2160x3840, 30 fps, silent | 6.000 s | 180 | 5,182,007 | 0.996094 | `6455391da86c59b34b90f455c9f233d1d80d751d7e3fa891954c771ad7ffa5fb` |

## Browser derivatives

`npm run media:prepare` runs `scripts/prepare-hero-media.mjs` against the normalized masters. The mobile master already contains the approved crop, so mobile delivery generation only scales it; applying the crop here again would be a defect. WebM commands use FFmpeg's bitexact mux/codec flags and a fixed creation timestamp so the full container is reproducible.

```text
desktop WebM: ffmpeg -bitexact -i <desktop-master> -map_metadata -1 -fflags +bitexact -flags +bitexact -metadata creation_time=1970-01-01T00:00:00Z -vf scale=2560:1440 -c:v libvpx-vp9 -crf 24 -b:v 0 -row-mt 1 -an public/media/hero/ulixes-signal-desktop-1440.webm
desktop MP4:  ffmpeg -i <desktop-master> -map_metadata -1 -vf scale=1920:1080 -c:v libx264 -crf 19 -preset slow -pix_fmt yuv420p -movflags +faststart -an public/media/hero/ulixes-signal-desktop-1080.mp4
mobile WebM:  ffmpeg -bitexact -i <mobile-master> -map_metadata -1 -fflags +bitexact -flags +bitexact -metadata creation_time=1970-01-01T00:00:00Z -vf scale=1080:1920 -c:v libvpx-vp9 -crf 25 -b:v 0 -row-mt 1 -an public/media/hero/ulixes-signal-mobile-1080.webm
mobile MP4:   ffmpeg -i <mobile-master> -map_metadata -1 -vf scale=1080:1920 -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -movflags +faststart -an public/media/hero/ulixes-signal-mobile-1080.mp4
```

Frame-zero posters are created from the same normalized masters with Sharp as AVIF at quality 56 and effort 8. Temporary poster-frame PNGs are ignored and removed after a successful AVIF write.

| Tracked asset | Dimensions | Frames | Bytes | Loop SSIM | SHA-256 |
| --- | ---: | ---: | ---: | ---: | --- |
| `ulixes-signal-desktop-1440.webm` | 2560x1440 | 180 | 1,469,309 | 0.996166 | `44e299d67b21cc37c7f4c7638bd41ef493445aea3dbfafa9dc224dd2979ed73d` |
| `ulixes-signal-desktop-1080.mp4` | 1920x1080 | 180 | 1,156,216 | 0.993515 | `19b6f87bb42eae21b5d8e1770bb584c0e8fb53f236bde51831f91631340a5a74` |
| `ulixes-signal-mobile-1080.webm` | 1080x1920 | 180 | 679,757 | 0.996833 | `47e72184a87e62943b81029c314943a4fae61a1a25c67ca48c6d36a2f234514f` |
| `ulixes-signal-mobile-1080.mp4` | 1080x1920 | 180 | 879,541 | 0.993036 | `51f3d0931fcbd708e4993eb2dce2dc447fe59e98e7188ae64fb76c1007b0206e` |
| `ulixes-signal-desktop-poster.avif` | 2560x1440 | — | 109,417 | — | `6638679db5805f67d88636bde575d606e523929bdef1794f525a7e538be6b8c3` |
| `ulixes-signal-mobile-poster.avif` | 1080x1920 | — | 36,758 | — | `54d4d857890bcbbf0be1a89acb1f2297c4eb30a5a27c09bb80da4595bf620ae4` |

Two consecutive `npm run media:prepare` runs produced the listed WebM checksums; the deterministic WebM containers were byte-identical.

## Five-point inspection

Inspection frames are local, ignored files under `design-assets/hero/inspection-frames/`, sampled at 0, 1.5, 3, 4.5, and 5.966 seconds. Run `npm run media:inspect` to recreate all ten. Desktop frames come from the normalized 4K desktop master; mobile frames come from the corrected `public/media/hero/ulixes-signal-mobile-1080.mp4` delivery. Each frame was reviewed at its delivered/original resolution for copy-zone clearance, banding, geometry stability, and luminance continuity.

| Evidence source | Time (s) | Copy-zone clearance | Banding | Geometry stability | Luminance continuity | Result |
| --- | ---: | --- | --- | --- | --- | --- |
| Desktop master | 0 | PASS | PASS | PASS | PASS | PASS |
| Desktop master | 1.5 | PASS | PASS | PASS | PASS | PASS |
| Desktop master | 3 | PASS | PASS | PASS | PASS | PASS |
| Desktop master | 4.5 | PASS | PASS | PASS | PASS | PASS |
| Desktop master | 5.966 | PASS | PASS | PASS | PASS | PASS |
| Mobile delivery | 0 | PASS | PASS | PASS | PASS | PASS |
| Mobile delivery | 1.5 | PASS | PASS | PASS | PASS | PASS |
| Mobile delivery | 3 | PASS | PASS | PASS | PASS | PASS |
| Mobile delivery | 4.5 | PASS | PASS | PASS | PASS | PASS |
| Mobile delivery | 5.966 | PASS | PASS | PASS | PASS | PASS |

The source mobile rail near y≈47% is moved to approximately y≈55% by the top-anchored crop in the normalized mobile master. No additional delivery crop is applied. No visible color banding, camera movement, geometry growth, or abrupt full-frame luminance transition was observed.

## Verification

`npm run media:verify` checks the four tracked delivery dimensions, duration (5.9–6.1 seconds), audio absence, approximately 30 fps, approximately 180 decoded frames, byte budgets, and first-to-final-frame SSIM (minimum 0.98). It decodes each poster with Sharp, requires `image/avif`, and checks exact dimensions and byte budgets. When the ignored normalized masters are present, it additionally requires one HEVC video stream, 4K dimensions, 5.9–6.1-second duration, approximately 30 fps and 180 frames, and no audio.
