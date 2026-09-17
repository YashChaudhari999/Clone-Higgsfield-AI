#!/usr/bin/env python3
"""
capture_log.py — Antigravity IDE session log extractor
=======================================================
Reads the transcript.jsonl for a given conversation ID and writes a formatted
agent log to .agent-logs/ in the repo root.

Usage:
    python scripts/capture_log.py <conversation-id>

The transcript is read from:
    %APPDATA%/../Local/... or the hard-coded Antigravity brain path.

The log is written to:
    .agent-logs/YYYY-MM-DD_HH-MM-SS_<short-session-id>.md

Run this at the end of each session (after the IDE closes / saves the transcript).
The script is idempotent — running it twice produces the same file.
"""

import json
import os
import sys
import re
from datetime import datetime, timezone
from pathlib import Path

# ── Configuration ──────────────────────────────────────────────────────────────

AUTHOR         = "yash"          # change to your GitHub handle
MODEL          = "claude-sonnet-4.6-thinking"
TOOL           = "antigravity-ide"
PROJECT        = "cad"           # name of this repo / assignment

BRAIN_BASE     = Path(os.environ.get("APPDATA", "")).parent / "Local" / ".gemini" / "antigravity-ide" / "brain"
BRAIN_BASE_ALT = Path(r"C:\Users\Smit Chaudhari\.gemini\antigravity-ide\brain")

REPO_ROOT      = Path(__file__).resolve().parent.parent
LOGS_DIR       = REPO_ROOT / ".agent-logs"

# ── Types we care about in the transcript ─────────────────────────────────────

PROMPT_TYPES   = {"USER_INPUT"}
RESPONSE_TYPES = {"PLANNER_RESPONSE"}

# ── Helpers ───────────────────────────────────────────────────────────────────

def find_brain_base() -> Path:
    for candidate in [BRAIN_BASE, BRAIN_BASE_ALT]:
        if candidate.exists():
            return candidate
    raise FileNotFoundError(
        f"Could not find Antigravity brain directory. "
        f"Tried:\n  {BRAIN_BASE}\n  {BRAIN_BASE_ALT}"
    )


def load_transcript(conv_id: str) -> list[dict]:
    brain = find_brain_base()
    transcript_path = brain / conv_id / ".system_generated" / "logs" / "transcript.jsonl"
    if not transcript_path.exists():
        raise FileNotFoundError(f"Transcript not found: {transcript_path}")

    entries = []
    with open(transcript_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                entries.append(json.loads(line))
            except json.JSONDecodeError as e:
                print(f"[WARN] Skipping malformed line: {e}", file=sys.stderr)
    return entries


def extract_text(step: dict) -> str:
    """Extract human-readable text from a step object."""
    # content is usually a string or list of content blocks
    content = step.get("content", "")
    if isinstance(content, str):
        return content.strip()
    if isinstance(content, list):
        parts = []
        for block in content:
            if isinstance(block, str):
                parts.append(block)
            elif isinstance(block, dict):
                parts.append(block.get("text", block.get("content", "")))
        return "\n".join(p for p in parts if p).strip()
    return str(content).strip()


def extract_timestamp(step: dict) -> str:
    """Return ISO-8601 UTC timestamp string."""
    ts = step.get("timestamp") or step.get("created_at") or step.get("completed_at")
    if ts:
        # already a string
        if isinstance(ts, str):
            return ts
        # epoch millis
        if isinstance(ts, (int, float)):
            dt = datetime.fromtimestamp(ts / 1000, tz=timezone.utc)
            return dt.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


def pair_exchanges(steps: list[dict]) -> list[tuple[dict, dict | None]]:
    """
    Walk through steps and pair each USER_INPUT with the following
    PLANNER_RESPONSE. Returns list of (prompt_step, response_step|None).
    """
    pairs: list[tuple[dict, dict | None]] = []
    i = 0
    while i < len(steps):
        step = steps[i]
        if step.get("type") in PROMPT_TYPES:
            # find the next response
            j = i + 1
            while j < len(steps) and step.get("type") not in RESPONSE_TYPES:
                if steps[j].get("type") in RESPONSE_TYPES:
                    pairs.append((step, steps[j]))
                    i = j + 1
                    break
                j += 1
            else:
                # no response found, record prompt alone
                if not pairs or pairs[-1][0] is not step:
                    pairs.append((step, None))
                i += 1
        else:
            i += 1
    return pairs


def build_log(conv_id: str, steps: list[dict]) -> str:
    """Build the full markdown log string."""
    # gather exchange pairs
    exchanges: list[tuple[dict, dict | None]] = []
    i = 0
    while i < len(steps):
        step = steps[i]
        if step.get("type") in PROMPT_TYPES:
            j = i + 1
            response_step = None
            while j < len(steps):
                if steps[j].get("type") in RESPONSE_TYPES:
                    response_step = steps[j]
                    break
                j += 1
            exchanges.append((step, response_step))
            i = (j + 1) if response_step else (i + 1)
        else:
            i += 1

    if not exchanges:
        print("[WARN] No USER_INPUT/PLANNER_RESPONSE pairs found in transcript.", file=sys.stderr)

    short_id = conv_id[:8]
    first_ts = extract_timestamp(exchanges[0][0]) if exchanges else datetime.now(timezone.utc).isoformat()
    last_ts  = extract_timestamp(exchanges[-1][0]) if exchanges else first_ts

    # parse date for header
    date_str = first_ts[:10]

    header = f"""---
session_id: {conv_id}
date: {date_str}
author: {AUTHOR}
model: {MODEL}
tool: {TOOL}
project: {PROJECT}
total_exchanges: {len(exchanges)}
first_prompt_time: {first_ts}
last_prompt_time: {last_ts}
---

# Session Log - {date_str}

Session: `{short_id}` | Project: `{PROJECT}` | Author: `{AUTHOR}`

---
"""

    body_parts = [header]
    for n, (prompt_step, response_step) in enumerate(exchanges, start=1):
        p_ts   = extract_timestamp(prompt_step)
        p_text = extract_text(prompt_step)

        body_parts.append(f"""
[LOG_ENTRY type=PROMPT num={n} session={short_id}]
timestamp: {p_ts}
model: {MODEL}

{p_text}

""")

        if response_step:
            r_ts   = extract_timestamp(response_step)
            r_text = extract_text(response_step)
        else:
            r_ts   = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
            r_text = "(no response captured)"

        body_parts.append(f"""[LOG_ENTRY type=RESPONSE num={n} session={short_id}]
timestamp: {r_ts}
model: {MODEL}

{r_text}

---
""")

    return "\n".join(body_parts)


def output_path(conv_id: str, first_ts: str) -> Path:
    # parse timestamp to filename
    try:
        dt = datetime.fromisoformat(first_ts.replace("Z", "+00:00"))
    except Exception:
        dt = datetime.now(timezone.utc)
    fname = dt.strftime("%Y-%m-%d_%H-%M-%S") + f"_{conv_id[:8]}.md"
    return LOGS_DIR / fname


# ── Entry point ───────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/capture_log.py <conversation-id>", file=sys.stderr)
        print("\nConversation IDs are shown in the Antigravity IDE sidebar.", file=sys.stderr)
        sys.exit(1)

    conv_id = sys.argv[1].strip()
    print(f"[INFO] Reading transcript for session: {conv_id}")

    steps = load_transcript(conv_id)
    print(f"[INFO] Loaded {len(steps)} steps from transcript.")

    log_text = build_log(conv_id, steps)

    LOGS_DIR.mkdir(parents=True, exist_ok=True)

    # determine output path from first exchange timestamp or now
    now_ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    out = output_path(conv_id, now_ts)

    with open(out, "w", encoding="utf-8") as f:
        f.write(log_text)

    print(f"[INFO] Log written to: {out}")
    return str(out)


if __name__ == "__main__":
    main()
