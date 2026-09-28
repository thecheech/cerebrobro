#!/usr/bin/env python3
"""Phase 2: product worlds, character scenes, Veo motion — parallel WaveSpeed jobs."""

from __future__ import annotations

import json
import os
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STATE_PATH = ROOT / "scripts" / "lab-phase2-state.json"
OUT = ROOT / "public" / "lab"
API = "https://api.wavespeed.ai/api/v3"

NEG_VIDEO = (
    "morphing, warping, melting, object deformation, changing product shape, "
    "abrupt camera cuts, flickering, artificial motion, CGI look, text, logos, "
    "extra limbs, distorted faces, oversharpened, plastic skin"
)

PRODUCT_URL = "https://d2h7xmz5gqybh9.cloudfront.net/output/106e4ced-de84-4e71-8e30-a3ba12bce23f.png"
HERO_URL = "https://d2h7xmz5gqybh9.cloudfront.net/output/f3bae1a7-a764-4365-be31-85820ddf1c23.png"
HERO2_URL = "https://d2h7xmz5gqybh9.cloudfront.net/output/6d934f2b-148b-45aa-9b30-cffaed069dec.png"
CHAR_URL = "https://d2h7xmz5gqybh9.cloudfront.net/output/01731081-a2a4-4b6b-a06a-f477483ba9da.png"


def load_key() -> str:
    for path in (ROOT / ".env.local", Path.home() / "projects" / "tools" / ".env.local"):
        if path.exists():
            for line in path.read_text().splitlines():
                if line.startswith("WAVESPEED_API_KEY="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    key = os.environ.get("WAVESPEED_API_KEY", "").strip()
    if not key:
        raise SystemExit("WAVESPEED_API_KEY missing")
    return key


def req(method: str, url: str, key: str, body: dict | None = None) -> dict:
    data = None if body is None else json.dumps(body).encode()
    request = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=180) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"{method} {url} -> {e.code}: {e.read().decode()[:800]}") from e


def jobs() -> list[dict]:
    worlds = [
        (
            "world-alpine",
            "Keep the exact shoe from the reference image — identical shape, proportions, materials, and silhouette. Do not redesign it.\n\n"
            "Place that same shoe on a massive pale granite rock above a fog-filled alpine valley at dawn. "
            "Cold morning atmosphere, low golden sunlight through clouds, subtle frost on surrounding surfaces only — not on the shoe upper.\n\n"
            "Premium outdoor advertising photography. Photorealistic. Believable materials and lighting. "
            "Restrained color, no fantasy glow, no logos, no text, no UI.",
        ),
        (
            "world-brutalist",
            "Keep the exact shoe from the reference image unchanged — same shape, proportions, materials.\n\n"
            "Place it inside a monumental brutalist concrete interior with huge geometric walls and stairs. "
            "Strong afternoon sun, long architectural shadows, warm grey concrete, subtle haze.\n\n"
            "High-end contemporary advertising photography. Photorealistic. Minimal composition. "
            "No logos, no text, no CGI look.",
        ),
        (
            "world-liquid",
            "Keep the exact shoe from the reference image unchanged.\n\n"
            "Place it on a narrow black platform above a calm dark reflective water surface. "
            "A sculptural sheet of water rises behind it, frozen mid-wave, physically believable.\n\n"
            "Luxury sports advertising photography, dramatic but restrained, realistic physics. "
            "No logos, no text, no surreal melting.",
        ),
        (
            "world-desert",
            "Keep the exact shoe from the reference image unchanged.\n\n"
            "Place it on a sculptural sandstone formation in a vast desert at sunrise. "
            "Fine wind-blown dust, enormous empty sky, warm orange light, long shadows, subtle haze.\n\n"
            "Premium outdoor campaign photography. Photorealistic, sophisticated, restrained. "
            "No logos, no text.",
        ),
        (
            "world-studio-night",
            "Keep the exact shoe from the reference image unchanged.\n\n"
            "Place it in a dark contemporary photo studio on a matte charcoal seamless, lit by one large softbox from camera-left "
            "and a thin rim light. Quiet, expensive, almost surgical product photography.\n\n"
            "Photorealistic. No props, no logos, no text, no neon cyber aesthetic.",
        ),
        (
            "world-rain-city",
            "Keep the exact shoe from the reference image unchanged.\n\n"
            "Place it on wet asphalt at night under a soft streetlamp, shallow puddle reflections, distant city bokeh. "
            "Cinematic but quiet — like a still from a prestige sports commercial.\n\n"
            "Photorealistic materials. No logos, no text, no dystopian cyberpunk.",
        ),
    ]

    scenes = [
        (
            "char-museum",
            "Keep this person's identity, facial structure, hair, skin tone, freckles, and distinctive features exactly consistent with the reference.\n\n"
            "She is walking through a brutalist art museum, charcoal jacket, looking slightly aside. Natural afternoon light. "
            "Editorial campaign photography, realistic proportions, candid expression.\n\n"
            "Do not beautify or change her identity. No text, no logo.",
        ),
        (
            "char-cafe",
            "Keep this person's identity, facial structure, hair, skin tone, freckles, and distinctive features exactly consistent with the reference.\n\n"
            "She sits at a small cafe table early morning, looking through a notebook. Soft window light, candid moment, 50mm editorial photography.\n\n"
            "Do not change her identity. No text, no logo, no beauty filter.",
        ),
        (
            "char-coast",
            "Keep this person's identity, facial structure, hair, skin tone, freckles, and distinctive features exactly consistent with the reference.\n\n"
            "She stands on a windswept coastal cliff at golden hour in a dark oversized coat. Cinematic editorial campaign photography.\n\n"
            "Do not change her identity. No text, no logo.",
        ),
        (
            "char-workspace",
            "Keep this person's identity, facial structure, hair, skin tone, freckles, and distinctive features exactly consistent with the reference.\n\n"
            "She is in a quiet creative studio reviewing printed stills pinned to a wall, natural window light, observational documentary style.\n\n"
            "Do not change her identity. No text, no logo, no AI interface graphics.",
        ),
    ]

    out: list[dict] = []
    for jid, prompt in worlds:
        out.append(
            {
                "id": jid,
                "group": "worlds",
                "model": "google/nano-banana-pro/edit",
                "ext": "png",
                "body": {
                    "prompt": prompt,
                    "images": [PRODUCT_URL],
                    "aspect_ratio": "4:5",
                    "resolution": "2k",
                    "output_format": "png",
                },
            }
        )
    for jid, prompt in scenes:
        out.append(
            {
                "id": jid,
                "group": "scenes",
                "model": "google/nano-banana-pro/edit",
                "ext": "png",
                "body": {
                    "prompt": prompt,
                    "images": [CHAR_URL],
                    "aspect_ratio": "4:5",
                    "resolution": "2k",
                    "output_format": "png",
                },
            }
        )

    videos = [
        {
            "id": "motion-hero-push",
            "group": "motion",
            "model": "google/veo3.1/image-to-video",
            "ext": "mp4",
            "body": {
                "image": HERO_URL,
                "prompt": (
                    "Slow, controlled cinematic camera movement. "
                    "A very subtle forward dolly toward the shoe while translucent fabric moves naturally in the air, "
                    "catching sunlight and gently changing shape. Fine dust particles move through the light. "
                    "The shoe remains completely stable and physically realistic. "
                    "Premium commercial cinematography. Natural motion. Subtle depth shift. "
                    "No dramatic movement. No morphing. No object deformation. Hold on the product at the end."
                ),
                "negative_prompt": NEG_VIDEO,
                "aspect_ratio": "16:9",
                "duration": 8,
                "resolution": "1080p",
                "generate_audio": False,
            },
        },
        {
            "id": "motion-hero-parallax",
            "group": "motion",
            "model": "google/veo3.1/image-to-video",
            "ext": "mp4",
            "body": {
                "image": HERO2_URL,
                "prompt": (
                    "The camera slowly arcs a few degrees around the product from left to right while keeping exact product proportions. "
                    "Environment stays physically stable. Fine atmospheric particles move naturally. "
                    "Background fabric gently responds to a soft breeze. Subtle cinematic parallax, realistic depth, "
                    "premium commercial product film. No product deformation. No camera shake. No sudden movement."
                ),
                "negative_prompt": NEG_VIDEO,
                "aspect_ratio": "16:9",
                "duration": 8,
                "resolution": "1080p",
                "generate_audio": False,
            },
        },
        {
            "id": "motion-character",
            "group": "motion",
            "model": "google/veo3.1/reference-to-video",
            "ext": "mp4",
            "body": {
                "images": [CHAR_URL],
                "prompt": (
                    "The woman slowly turns her head toward the camera and gives a very subtle natural smile. "
                    "Hair moves slightly. The camera performs a slow cinematic push-in. "
                    "Natural human movement, realistic facial motion, subtle breathing, realistic fabric movement. "
                    "Premium editorial fashion film. Quiet, restrained, observational. "
                    "Preserve her identity and facial features exactly."
                ),
                "negative_prompt": NEG_VIDEO,
                "resolution": "1080p",
                "generate_audio": False,
            },
        },
    ]
    out.extend(videos)
    return out


def submit_one(key: str, job: dict) -> dict:
    # assert image settings
    body = job["body"]
    if job["ext"] == "png":
        assert body.get("aspect_ratio") == "4:5", body
        assert body.get("resolution") == "2k", body
    if "veo3.1/image-to-video" in job["model"]:
        assert body.get("aspect_ratio") == "16:9"
        assert body.get("resolution") == "1080p"
        assert body.get("duration") == 8
        assert body.get("generate_audio") is False
    if "reference-to-video" in job["model"]:
        assert body.get("resolution") == "1080p"
        assert body.get("generate_audio") is False

    result = req("POST", f"{API}/{job['model']}", key, body)
    data = result.get("data") or result
    pid = data.get("id") or data.get("prediction_id") or data.get("request_id")
    if not pid:
        raise RuntimeError(f"no id for {job['id']}: {json.dumps(result)[:400]}")
    return {**job, "prediction_id": pid, "status": "submitted"}


def poll_one(key: str, item: dict, timeout: float = 900) -> dict:
    url = f"{API}/predictions/{item['prediction_id']}/result"
    start = time.time()
    while True:
        result = req("GET", url, key)
        data = result.get("data") or result
        status = (data.get("status") or "").lower()
        item["status"] = status
        if status in {"completed", "succeeded", "success"}:
            outputs = data.get("outputs") or data.get("output") or []
            if isinstance(outputs, str):
                outputs = [outputs]
            item["outputs"] = outputs
            return item
        if status in {"failed", "error", "cancelled"}:
            item["error"] = data.get("error") or data
            return item
        if time.time() - start > timeout:
            item["error"] = "timeout"
            return item
        time.sleep(4)


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url, timeout=300) as resp, dest.open("wb") as f:
        f.write(resp.read())


def main() -> None:
    key = load_key()
    all_jobs = jobs()
    print(f"submitting {len(all_jobs)} phase-2 jobs…", flush=True)
    for j in all_jobs:
        print(f"  {j['id']}: {j['model']}", flush=True)

    submitted: list[dict] = []
    with ThreadPoolExecutor(max_workers=10) as pool:
        futs = {pool.submit(submit_one, key, j): j["id"] for j in all_jobs}
        for fut in as_completed(futs):
            jid = futs[fut]
            try:
                item = fut.result()
                submitted.append(item)
                print(f"submitted {jid} -> {item['prediction_id']}", flush=True)
            except Exception as e:
                print(f"SUBMIT FAIL {jid}: {e}", flush=True)
                submitted.append({"id": jid, "status": "submit_failed", "error": str(e), "group": "unknown", "ext": "png"})

    STATE_PATH.write_text(json.dumps({"items": submitted}, indent=2))

    done: list[dict] = []
    with ThreadPoolExecutor(max_workers=10) as pool:
        futs = {}
        for item in submitted:
            if item.get("prediction_id"):
                futs[pool.submit(poll_one, key, item)] = item["id"]
            else:
                done.append(item)
        for fut in as_completed(futs):
            item = fut.result()
            done.append(item)
            print(f"done {item['id']}: {item.get('status')} outs={len(item.get('outputs') or [])}", flush=True)

    for item in done:
        outs = item.get("outputs") or []
        if not outs:
            continue
        group = item.get("group") or "misc"
        dest = OUT / group / f"{item['id']}.{item.get('ext', 'png')}"
        try:
            download(outs[0], dest)
            item["local"] = str(dest.relative_to(ROOT))
            print(f"saved {item['local']}", flush=True)
        except Exception as e:
            item["download_error"] = str(e)
            print(f"DOWNLOAD FAIL {item['id']}: {e}", flush=True)

    STATE_PATH.write_text(json.dumps({"items": done}, indent=2))
    ok = sum(1 for i in done if i.get("local"))
    print(f"phase2 complete: {ok}/{len(done)} saved", flush=True)


if __name__ == "__main__":
    main()
