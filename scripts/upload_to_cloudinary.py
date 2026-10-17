import time
import hashlib
import requests
import json
import os
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

sys.stdout.reconfigure(encoding='utf-8')

CLOUD_NAME = "dufijnmw"
API_KEY = "213933423595273"
API_SECRET = "T3PAcsZq5RC9O35WhXTDKmecEsA"

MANIFEST_PATH = "scripts/all_articles_media_manifest.json"
OUTPUT_MANIFEST_PATH = "scripts/cloudinary_manifest.json"

lock = threading.Lock()

def upload_image(file_path, folder, public_id):
    timestamp = int(time.time())
    to_sign = f"folder={folder}&public_id={public_id}&timestamp={timestamp}{API_SECRET}"
    signature = hashlib.sha1(to_sign.encode('utf-8')).hexdigest()
    
    url = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload"
    
    with open(file_path, "rb") as f:
        files = {"file": f}
        data = {
            "api_key": API_KEY,
            "timestamp": timestamp,
            "folder": folder,
            "public_id": public_id,
            "signature": signature
        }
        res = requests.post(url, data=data, files=files, timeout=60)
        return res.status_code, res.json()

def process_item(item, cloudinary_records, total):
    slug = item["slug"]
    category_slug = item["category_slug"]
    clean_filename = item["clean_filename"]
    public_id = os.path.splitext(clean_filename)[0]
    folder = f"yahduth/articles/{category_slug}"
    
    with lock:
        if slug in cloudinary_records and cloudinary_records[slug].get("secure_url"):
            return "ALREADY", slug, cloudinary_records[slug]["secure_url"]

    file_path = os.path.join("public", item["saved_path"].lstrip("/\\"))
    if not os.path.exists(file_path):
        return "MISSING", slug, file_path

    for attempt in range(1, 4):
        try:
            code, resp = upload_image(file_path, folder, public_id)
            if code == 200 and "secure_url" in resp:
                record = {
                    "slug": slug,
                    "category_slug": category_slug,
                    "clean_filename": clean_filename,
                    "secure_url": resp["secure_url"],
                    "public_id": resp["public_id"],
                    "bytes": resp.get("bytes", 0),
                    "format": resp.get("format", "webp"),
                    "alt_text": item.get("alt_text", "")
                }
                with lock:
                    cloudinary_records[slug] = record
                    with open(OUTPUT_MANIFEST_PATH, "w", encoding="utf-8") as f:
                        json.dump(cloudinary_records, f, ensure_ascii=False, indent=2)
                return "SUCCESS", slug, resp["secure_url"]
            else:
                time.sleep(1)
        except Exception as e:
            time.sleep(1)

    return "FAILED", slug, None

def main():
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)
        
    cloudinary_records = {}
    if os.path.exists(OUTPUT_MANIFEST_PATH):
        try:
            with open(OUTPUT_MANIFEST_PATH, "r", encoding="utf-8") as f:
                cloudinary_records = json.load(f)
        except Exception:
            cloudinary_records = {}
            
    total = len(manifest)
    print(f"Total articles: {total}, Already uploaded: {len(cloudinary_records)}")

    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = {executor.submit(process_item, item, cloudinary_records, total): item for item in manifest}
        completed = 0
        for future in as_completed(futures):
            status, slug, res = future.result()
            completed += 1
            if status == "SUCCESS":
                print(f"[{completed}/{total}] [UPLOADED] {slug} -> {res}")
            elif status == "ALREADY":
                print(f"[{completed}/{total}] [CACHED] {slug}")
            else:
                print(f"[{completed}/{total}] [{status}] {slug} -> {res}")

    print("\n==========================================")
    print(f"FINAL COUNT IN CLOUDINARY: {len(cloudinary_records)}/{total}")
    print("==========================================")

if __name__ == "__main__":
    main()
