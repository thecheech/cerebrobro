#!/usr/bin/env python3
"""Submit CerebroBro lab stills to WaveSpeed in parallel, then poll + download."""

from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JOBS_PATH = ROOT / "scripts" / "lab-jobs.json"
STATE_PATH = ROOT / "scripts" / "lab-state.json"
OUT_ROOT = ROOT / "public" / "lab"
API = "https://api.wavespeed.ai/api/v3"


def load_key() -> str:
    env = ROOT / ".env.local"
    tools = Path.home() / "projects" / "tools" / ".env.local"
    for path in (env, tools):
        if not path.exists():
            continue
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
        with urllib.request.urlopen(request, timeout=120) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        err = e.read().decode()[:800]
        raise RuntimeError(f"{method} {url} -> {e.code}: {err}") from e


def assert_still_body(body: dict) -> None:
    assert body.get("aspect_ratio") == "4:5", body
    assert body.get("resolution") == "2k", body
    assert body.get("output_format") == "png", body


def submit_one(key: str, job: dict) -> dict:
    assert_still_body(job["body"])
    url = f"{API}/{job['model']}"
    result = req("POST", url, key, job["body"])
    data = result.get("data") or result
    prediction_id = data.get("id") or data.get("prediction_id") or data.get("request_id")
    if not prediction_id:
        raise RuntimeError(f"no prediction id for {job['id']}: {json.dumps(result)[:500]}")
    return {
        **job,
        "prediction_id": prediction_id,
        "status": data.get("status") or "submitted",
        "submitted_at": time.time(),
    }


def poll_one(key: str, item: dict, timeout: float = 600) -> dict:
    prediction_id = item["prediction_id"]
    url = f"{API}/predictions/{prediction_id}/result"
    start = time.time()
    while True:
        result = req("GET", url, key)
        data = result.get("data") or result
        status = (data.get("status") or "").lower()
        item["status"] = status
        item["raw"] = {
            "status": data.get("status"),
            "outputs": data.get("outputs") or data.get("output"),
            "error": data.get("error"),
        }
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
        time.sleep(3)


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url, timeout=180) as resp, dest.open("wb") as f:
        f.write(resp.read())


def main() -> None:
    key = load_key()
    jobs = json.loads(JOBS_PATH.read_text())["jobs"]
    print(f"submitting {len(jobs)} jobs in parallel…", flush=True)
    for j in jobs:
        assert_still_body(j["body"])
        print(
            f"  {j['id']}: {j['model']} "
            f"{j['body']['aspect_ratio']} {j['body']['resolution']} {j['body']['output_format']}",
            flush=True,
        )

    submitted: list[dict] = []
    with ThreadPoolExecutor(max_workers=12) as pool:
        futures = {pool.submit(submit_one, key, job): job["id"] for job in jobs}
        for fut in as_completed(futures):
            job_id = futures[fut]
            try:
                item = fut.result()
                submitted.append(item)
                print(f"submitted {job_id} -> {item['prediction_id']}", flush=True)
            except Exception as e:
                print(f"SUBMIT FAIL {job_id}: {e}", flush=True)
                submitted.append({"id": job_id, "status": "submit_failed", "error": str(e)})

    STATE_PATH.write_text(json.dumps({"items": submitted}, indent=2))
    print(f"polling {sum(1 for s in submitted if s.get('prediction_id'))} predictions…", flush=True)

    done: list[dict] = []
    with ThreadPoolExecutor(max_workers=12) as pool:
        futures = {}
        for item in submitted:
            if item.get("prediction_id"):
                futures[pool.submit(poll_one, key, item)] = item["id"]
            else:
                done.append(item)
        for fut in as_completed(futures):
            item = fut.result()
            done.append(item)
            print(f"done {item['id']}: {item.get('status')} outputs={len(item.get('outputs') or [])}", flush=True)

    # download
    for item in done:
        outs = item.get("outputs") or []
        if not outs:
            continue
        group = item.get("group") or "misc"
        dest = OUT_ROOT / group / f"{item['id']}.png"
        try:
            download(outs[0], dest)
            item["local"] = str(dest.relative_to(ROOT))
            print(f"saved {item['local']}", flush=True)
        except Exception as e:
            item["download_error"] = str(e)
            print(f"DOWNLOAD FAIL {item['id']}: {e}", flush=True)

    STATE_PATH.write_text(json.dumps({"items": done}, indent=2))
    ok = sum(1 for i in done if i.get("local"))
    fail = len(done) - ok
    print(f"complete: {ok} saved, {fail} failed/pending", flush=True)


if __name__ == "__main__":
    main()
