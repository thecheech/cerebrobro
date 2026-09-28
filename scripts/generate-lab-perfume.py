#!/usr/bin/env python3
"""Perfume track for lab experiment 01: product lock + meaningfully different worlds."""

from __future__ import annotations

import json
import os
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STATE_PATH = ROOT / "scripts" / "lab-perfume-state.json"
OUT = ROOT / "public" / "lab" / "perfume"
API = "https://api.wavespeed.ai/api/v3"

REF_PROMPT = """Extremely clean studio product photograph of a completely unbranded contemporary perfume bottle.

Frosted matte glass rectangular body, soft warm-grey glass, simple cylindrical matte black cap, no label, no logo, no brand marks. Slightly tall proportions. Sits alone on a seamless warm light-grey background.

Three-quarter product view, bottle centered, physically believable glass and refraction, soft large-box studio lighting, subtle contact shadow, premium commercial product photography.

No props, no flowers, no mist, no dramatic styling, no text, no watermark."""

WORLDS: list[tuple[str, str]] = [
    (
        "world-alpine",
        "Keep the exact perfume bottle from the reference image unchanged — identical shape, proportions, glass, and black cap. Do not redesign it.\n\n"
        "Place that same bottle on a massive pale granite rock above a fog-filled alpine valley at dawn. "
        "Cold morning atmosphere, low golden sunlight through clouds, subtle frost on surrounding stone only — not on the bottle.\n\n"
        "Premium outdoor advertising photography. Photorealistic. Believable materials and lighting. "
        "Restrained color, no fantasy glow, no logos, no text.",
    ),
    (
        "world-brutalist",
        "Keep the exact perfume bottle from the reference image unchanged — same shape, proportions, materials.\n\n"
        "Place it inside a monumental brutalist concrete interior with huge geometric walls and stairs. "
        "Strong afternoon sun, long architectural shadows, warm grey concrete, subtle haze.\n\n"
        "High-end contemporary advertising photography. Photorealistic. Minimal composition. "
        "No logos, no text, no CGI look.",
    ),
    (
        "world-still-life",
        "Keep the exact perfume bottle from the reference image unchanged.\n\n"
        "Classical dark still-life: the bottle sits on aged dark walnut beside dried lavender stems and a single dried citrus peel. "
        "Deep Rembrandt lighting from one side, almost black negative space, quiet Dutch-masters mood updated for a modern fragrance campaign.\n\n"
        "Photorealistic materials. No logos, no text, no bright luxury-ad look, no marble spa aesthetic.",
    ),
    (
        "world-greenhouse",
        "Keep the exact perfume bottle from the reference image unchanged.\n\n"
        "Place it on a weathered wooden bench inside a humid glass greenhouse packed with oversized tropical leaves. "
        "Soft overcast daylight through wet glass, condensation droplets, rich greens, organic messiness — botanical documentary, not a clean beauty studio.\n\n"
        "Photorealistic. No logos, no text, no fantasy glow.",
    ),
    (
        "world-studio-void",
        "Keep the exact perfume bottle from the reference image unchanged.\n\n"
        "Place it in a dark contemporary photo studio on a matte charcoal seamless, lit by one large softbox from camera-left "
        "and a thin rim light. Quiet, expensive, almost surgical product photography. Empty void — no props.\n\n"
        "Photorealistic. No logos, no text, no neon, no floating mist.",
    ),
    (
        "world-rain-city",
        "Keep the exact perfume bottle from the reference image unchanged.\n\n"
        "Place it on wet asphalt at night under a soft streetlamp, shallow puddle reflections, distant city bokeh. "
        "Cinematic but quiet — like a still from a prestige fragrance commercial shot on location, not in a studio.\n\n"
        "Photorealistic materials. No logos, no text, no dystopian cyberpunk, no neon overload.",
    ),
]


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


def submit_one(key: str, job: dict) -> dict:
    result = req("POST", f"{API}/{job['model']}", key, job["body"])
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


def run_batch(key: str, jobs: list[dict], label: str) -> list[dict]:
    print(f"submitting {len(jobs)} {label}…", flush=True)
    submitted: list[dict] = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        futs = {pool.submit(submit_one, key, j): j["id"] for j in jobs}
        for fut in as_completed(futs):
            jid = futs[fut]
            try:
                item = fut.result()
                submitted.append(item)
                print(f"submitted {jid} -> {item['prediction_id']}", flush=True)
            except Exception as e:
                print(f"SUBMIT FAIL {jid}: {e}", flush=True)
                submitted.append(
                    {"id": jid, "status": "submit_failed", "error": str(e), "ext": "png"}
                )

    done: list[dict] = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        futs = {}
        for item in submitted:
            if item.get("prediction_id"):
                futs[pool.submit(poll_one, key, item)] = item["id"]
            else:
                done.append(item)
        for fut in as_completed(futs):
            item = fut.result()
            done.append(item)
            print(
                f"done {item['id']}: {item.get('status')} outs={len(item.get('outputs') or [])}",
                flush=True,
            )

    for item in done:
        outs = item.get("outputs") or []
        if not outs:
            continue
        dest = OUT / f"{item['id']}.png"
        try:
            download(outs[0], dest)
            item["local"] = str(dest.relative_to(ROOT))
            print(f"saved {item['local']}", flush=True)
        except Exception as e:
            item["download_error"] = str(e)
            print(f"DOWNLOAD FAIL {item['id']}: {e}", flush=True)
    return done


def main() -> None:
    key = load_key()
    OUT.mkdir(parents=True, exist_ok=True)

    ref_jobs = []
    for i in range(1, 4):
        variation = "" if i == 1 else f"\n\nVariation {i}: slight angle and lighting difference only."
        ref_jobs.append(
            {
                "id": f"perfume-ref-0{i}",
                "model": "google/nano-banana-pro/text-to-image",
                "ext": "png",
                "body": {
                    "prompt": REF_PROMPT + variation,
                    "aspect_ratio": "4:5",
                    "resolution": "2k",
                    "output_format": "png",
                },
            }
        )

    refs = run_batch(key, ref_jobs, "perfume refs")
    state: dict = {"refs": refs, "worlds": []}
    STATE_PATH.write_text(json.dumps(state, indent=2))

    lock = next((r for r in refs if r.get("outputs")), None)
    if not lock:
        raise SystemExit("no perfume reference succeeded — aborting worlds")

    product_url = lock["outputs"][0]
    print(f"product lock: {lock['id']} -> {product_url}", flush=True)

    world_jobs = [
        {
            "id": jid,
            "model": "google/nano-banana-pro/edit",
            "ext": "png",
            "body": {
                "prompt": prompt,
                "images": [product_url],
                "aspect_ratio": "4:5",
                "resolution": "2k",
                "output_format": "png",
            },
        }
        for jid, prompt in WORLDS
    ]
    worlds = run_batch(key, world_jobs, "perfume worlds")
    state["worlds"] = worlds
    state["product_lock_id"] = lock["id"]
    state["product_lock_url"] = product_url
    STATE_PATH.write_text(json.dumps(state, indent=2))

    ok = sum(1 for i in refs + worlds if i.get("local"))
    print(f"perfume track complete: {ok}/{len(refs) + len(worlds)} saved", flush=True)


if __name__ == "__main__":
    main()
