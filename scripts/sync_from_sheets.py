"""
Fetches department and achievement data from a public Google Sheet (no auth)
and writes src/data/departments.json.

Sheet structure:
  Tab "departments": id | name | icon | color
  Tab "achievements": department_id | title | description | tags |
                      mediaType | mediaUrl | fullDescription |
                      statistics | additionalInfo | links

  - tags          : comma-separated
  - statistics    : newline-separated "label:value" pairs  e.g. "കോളേജ്: 4\nസീറ്റ്: 400"
  - additionalInfo: newline-separated strings
  - links         : newline-separated "label|url" pairs  e.g. "വെബ്സൈറ്റ്|https://example.com"

Filter-safe fetching:
  The gviz/tq CSV export respects active sheet filters and only returns
  visible rows. To bypass this, set DEPARTMENTS_GID and ACHIEVEMENTS_GID
  env vars to the numeric gid of each sheet (visible in the sheet URL as #gid=...).
  When gids are provided the /export endpoint is used instead, which always
  returns all rows regardless of any filters applied.
"""

import csv
import io
import json
import os
import urllib.request

SHEET_ID = os.environ["GOOGLE_SHEET_ID"]
DEPARTMENTS_GID = os.environ.get("DEPARTMENTS_GID")
ACHIEVEMENTS_GID = os.environ.get("ACHIEVEMENTS_GID")

OUT_PATH = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "../src/data/departments.json")
)


def fetch_tab(sheet_id: str, tab: str, gid: str | None) -> list[dict]:
    if gid:
        # /export ignores active filters — always returns all rows
        url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv&gid={gid}"
    else:
        # gviz/tq is filter-aware — only returns visible rows
        url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?tqx=out:csv&sheet={tab}"
    with urllib.request.urlopen(url) as resp:
        content = resp.read().decode("utf-8")
    return list(csv.DictReader(io.StringIO(content)))


def parse_lines(value: str) -> list[str]:
    return [v.strip() for v in value.splitlines() if v.strip()]


def parse_statistics(value: str) -> list[dict]:
    stats = []
    for item in parse_lines(value):
        if ":" in item:
            label, val = item.split(":", 1)
            stats.append({"label": label.strip(), "value": val.strip()})
    return stats


def main():
    if not DEPARTMENTS_GID or not ACHIEVEMENTS_GID:
        print("⚠️  DEPARTMENTS_GID / ACHIEVEMENTS_GID not set — falling back to gviz/tq.")
        print("   Active sheet filters will affect which rows are exported.")
        print("   Set these env vars to the numeric gid from the sheet URL (#gid=...) to bypass filters.")

    print("Fetching departments tab...")
    dept_rows = fetch_tab(SHEET_ID, "departments", DEPARTMENTS_GID)
    dept_map = {
        row["id"]: {
            "id": row["id"],
            "name": row["name"],
            "icon": row["icon"],
            "color": row["color"],
            "achievements": [],
        }
        for row in dept_rows
        if row.get("id")
    }

    print("Fetching achievements tab...")
    ach_rows = fetch_tab(SHEET_ID, "achievements", ACHIEVEMENTS_GID)
    for row in ach_rows:
        dept_id = row.get("department_id", "").strip()
        if not dept_id or dept_id not in dept_map:
            continue

        achievement = {
            "title": row["title"],
            "description": row["description"],
            "tags": [t.strip() for t in row.get("tags", "").split(",") if t.strip()],
        }

        if row.get("mediaType"):
            achievement["mediaType"] = row["mediaType"]
            achievement["mediaUrl"] = row.get("mediaUrl", "")

        statistics = parse_statistics(row.get("statistics", ""))
        additional_info = parse_lines(row.get("additionalInfo", ""))
        links = [
            {"label": p[0].strip(), "url": p[1].strip()}
            for line in parse_lines(row.get("links", ""))
            if "|" in line and len(p := line.split("|", 1)) == 2
        ]

        if any([statistics, additional_info, links, row.get("fullDescription")]):
            achievement["detailedReport"] = {
                "fullDescription": row.get("fullDescription", row["description"]),
                "statistics": statistics,
                "additionalInfo": additional_info,
                "links": links,
            }

        dept_map[dept_id]["achievements"].append(achievement)

    departments = list(dept_map.values())

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(departments, f, ensure_ascii=False, indent=2)

    print(f"Written {len(departments)} departments to {OUT_PATH}")
    for d in departments:
        print(f"  {d['icon']} {d['name']}: {len(d['achievements'])} achievements")


if __name__ == "__main__":
    main()
