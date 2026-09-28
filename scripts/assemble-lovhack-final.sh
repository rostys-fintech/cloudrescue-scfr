#!/usr/bin/env bash
set -euo pipefail

VISUAL="${1:-artifacts/lovhack-video/resilience-atlas-demo-visual.webm}"
AUDIO_DIR="${2:-artifacts/lovhack-audio/raw}"
OUT_DIR="${3:-artifacts/lovhack-final}"
TIMELINE="${4:-artifacts/lovhack-video/timeline.json}"
OUT="${OUT_DIR}/Resilience_Atlas_LovHack_Final_Demo.mp4"

mkdir -p "${OUT_DIR}"

FILES=(
  "01-hook.wav"
  "02-guide-1.wav"
  "03-guide-2.wav"
  "04-guide-3.wav"
  "05-guide-4.wav"
  "06-guide-5.wav"
  "07-guide-6.wav"
  "08-scenario.wav"
  "09-evidence.wav"
  "10-close.wav"
)

mapfile -t START_MS < <(python3 - "${TIMELINE}" "${AUDIO_DIR}" <<'PY'
import json, subprocess, sys
from pathlib import Path

timeline_path=Path(sys.argv[1])
audio_dir=Path(sys.argv[2])
timeline=json.loads(timeline_path.read_text())
scene_starts=timeline["guidedSceneStartsSeconds"]
guided_actual=float(timeline["guidedActualSeconds"])

files=[
    "01-hook.wav","02-guide-1.wav","03-guide-2.wav","04-guide-3.wav",
    "05-guide-4.wav","06-guide-5.wav","07-guide-6.wav",
    "08-scenario.wav","09-evidence.wav","10-close.wav"
]

def dur(name):
    out=subprocess.check_output([
        "ffprobe","-v","error","-show_entries","format=duration",
        "-of","csv=p=0",str(audio_dir/name)
    ],text=True)
    return float(out.strip())

hook=dur("01-hook.wav")
scenario=dur("08-scenario.wav")
evidence=dur("09-evidence.wav")

starts=[0.0]
starts.extend(hook+float(v) for v in scene_starts)
scenario_start=hook+guided_actual
evidence_start=scenario_start+scenario
close_start=evidence_start+evidence
starts.extend([scenario_start,evidence_start,close_start])

if len(starts)!=10:
    raise SystemExit(f"Expected 10 narration starts, got {len(starts)}")

for value in starts:
    print(round(value*1000))
PY
)

if [ "${#START_MS[@]}" -ne 10 ]; then
  echo "Expected 10 narration timestamps, got ${#START_MS[@]}" >&2
  exit 1
fi

FINAL_AUDIO="${OUT_DIR}/final-narration.m4a"
FF_INPUTS=()
FILTER=""
LABELS=""

for i in "${!FILES[@]}"; do
  FF_INPUTS+=(-i "${AUDIO_DIR}/${FILES[$i]}")
  FILTER+="[${i}:a]aresample=48000,adelay=${START_MS[$i]}:all=1[a${i}];"
  LABELS+="[a${i}]"
done

FILTER+="${LABELS}amix=inputs=10:duration=longest:dropout_transition=0:normalize=0,loudnorm=I=-16:LRA=7:TP=-1.5[mix]"

ffmpeg -y -v error \
  "${FF_INPUTS[@]}" \
  -filter_complex "${FILTER}" \
  -map "[mix]" \
  -c:a aac -b:a 192k -ar 48000 \
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
  echo "scene_aligned_audio=true"
  echo "narration_starts_ms=${START_MS[*]}"
} > "${OUT_DIR}/media-manifest.txt"

echo "Built ${OUT}"
cat "${OUT_DIR}/media-manifest.txt"
