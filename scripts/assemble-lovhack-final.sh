#!/usr/bin/env bash
set -euo pipefail

VISUAL="${1:-artifacts/lovhack-video/resilience-atlas-demo-visual.webm}"
AUDIO_DIR="${2:-artifacts/lovhack-audio/raw}"
OUT_DIR="${3:-artifacts/lovhack-final}"
OUT="${OUT_DIR}/Resilience_Atlas_LovHack_Final_Demo.mp4"

mkdir -p "${OUT_DIR}"

CONCAT="${OUT_DIR}/audio-concat.txt"
cat > "${CONCAT}" <<'EOF'
file '../lovhack-audio/raw/01-hook.wav'
file '../lovhack-audio/raw/02-guide-1.wav'
file '../lovhack-audio/raw/03-guide-2.wav'
file '../lovhack-audio/raw/04-guide-3.wav'
file '../lovhack-audio/raw/05-guide-4.wav'
file '../lovhack-audio/raw/06-guide-5.wav'
file '../lovhack-audio/raw/07-guide-6.wav'
file '../lovhack-audio/raw/08-scenario.wav'
file '../lovhack-audio/raw/09-evidence.wav'
file '../lovhack-audio/raw/10-close.wav'
EOF

FINAL_AUDIO="${OUT_DIR}/final-narration.m4a"

ffmpeg -y -v error \
  -f concat -safe 0 -i "${CONCAT}" \
  -af "aresample=48000,loudnorm=I=-16:LRA=7:TP=-1.5" \
  -c:a aac -b:a 192k \
  "${FINAL_AUDIO}"

AUDIO_DUR="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "${FINAL_AUDIO}")"
VIDEO_DUR="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "${VISUAL}")"

PAD="$(python3 - <<PY
v=float("${VIDEO_DUR}")
a=float("${AUDIO_DUR}")
print(max(0,a-v+0.08))
PY
)"

ffmpeg -y -v error \
  -i "${VISUAL}" \
  -i "${FINAL_AUDIO}" \
  -filter_complex "[0:v]tpad=stop_mode=clone:stop_duration=${PAD},format=yuv420p[v]" \
  -map "[v]" -map 1:a:0 \
  -c:v libx264 -preset veryfast -crf 20 -profile:v high \
  -c:a aac -b:a 192k -ar 48000 \
  -movflags +faststart -shortest \
  "${OUT}"

DURATION="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "${OUT}")"
SIZE="$(stat -c '%s' "${OUT}")"
SHA="$(sha256sum "${OUT}" | awk '{print $1}')"

{
  echo "file=Resilience_Atlas_LovHack_Final_Demo.mp4"
  echo "duration_seconds=${DURATION}"
  echo "resolution=1920x1080"
  echo "video_codec=h264"
  echo "audio_codec=aac"
  echo "audio_sample_rate=48000"
  echo "size_bytes=${SIZE}"
  echo "sha256=${SHA}"
} > "${OUT_DIR}/media-manifest.txt"

echo "Built ${OUT}"
cat "${OUT_DIR}/media-manifest.txt"
