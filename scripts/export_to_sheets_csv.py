"""
One-time helper: exports current departments.json to two CSV files
(departments.csv and achievements.csv) that can be imported into Google Sheets.

Run: python scripts/export_to_sheets_csv.py
"""

import csv
import json
import os

SRC = os.path.join(os.path.dirname(__file__), "../src/data/departments.json")

with open(SRC, encoding="utf-8") as f:
    data = json.load(f)

# --- departments.csv ---
with open("departments.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["id", "name", "icon", "color"])
    writer.writeheader()
    for dept in data:
        writer.writerow({"id": dept["id"], "name": dept["name"],
                         "icon": dept["icon"], "color": dept["color"]})

# --- achievements.csv ---
fields = ["department_id", "title", "description", "tags",
          "mediaType", "mediaUrl", "fullDescription", "statistics",
          "additionalInfo", "links"]

with open("achievements.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fields)
    writer.writeheader()
    for dept in data:
        for ach in dept["achievements"]:
            dr = ach.get("detailedReport", {})
            statistics = "\n".join(
                f"{s['label']}:{s['value']}" for s in dr.get("statistics", [])
            )
            writer.writerow({
                "department_id":  dept["id"],
                "title":          ach["title"],
                "description":    ach["description"],
                "tags":           ",".join(ach.get("tags", [])),
                "mediaType":      ach.get("mediaType", ""),
                "mediaUrl":       ach.get("mediaUrl", ""),
                "fullDescription": dr.get("fullDescription", ""),
                "statistics":     statistics,
                "additionalInfo": "\n".join(dr.get("additionalInfo", [])),
                "links":          "\n".join(f"{l['label']}|{l['url']}" for l in dr.get("links", [])),
            })

print("Exported departments.csv and achievements.csv")
print(f"  {len(data)} departments")
print(f"  {sum(len(d['achievements']) for d in data)} achievements")
