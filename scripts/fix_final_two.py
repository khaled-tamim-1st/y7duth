import os
import sys
import json
import time
import hashlib
import requests
from PIL import Image
import io

sys.stdout.reconfigure(encoding='utf-8')

CLOUD_NAME = "dufijnmw"
API_KEY = "213933423595273"
API_SECRET = "T3PAcsZq5RC9O35WhXTDKmecEsA"

ITEMS = [
    {
        "slug": "samak-al-suboor-al-mashwi-bil-meefa-turath-kuwaiti",
        "category_slug": "sofra-al-deera",
        "clean_filename": "samak-suboor-mashwi-meefa-kuwait.webp",
        "url": "https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=1400&q=85",
        "alt": "سمك الصبور الكويتي المشوي بحشوة الصبار والتمر الهندي في تنور الميفا التراثي",
        "source": "Unsplash Royalty-Free"
    },
    {
        "slug": "-  سنة-الهيلك-المجاعة-الكويت-تاريخ",
        "category_slug": "swalif-wa-turath",
        "clean_filename": "sanat-al-heilak-famine-solidarity-kuwait.webp",
        "url": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1400&q=85",
        "alt": "أكياس القمح والمؤونة التي فتحها تجار الكويت لإغاثة الجياع في ملحمة سنة الهيلك 1868",
        "source": "Unsplash Royalty-Free"
    }
]

def process_and_crop(image_bytes, target_w=1200, target_h=675):
    im = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    orig_w, orig_h = im.size
    target_ratio = target_w / target_h
    current_ratio = orig_w / orig_h
    
    if current_ratio > target_ratio:
        new_w = int(orig_h * target_ratio)
        left = (orig_w - new_w) // 2
        im = im.crop((left, 0, left + new_w, orig_h))
    else:
        new_h = int(orig_w / target_ratio)
        top = (orig_h - new_h) // 2
        im = im.crop((0, top, orig_w, top + new_h))
        
    im = im.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    quality = 84
    while quality >= 50:
        buf = io.BytesIO()
        im.save(buf, format="WEBP", quality=quality, method=6)
        if len(buf.getvalue()) <= 245 * 1024:
            return buf.getvalue()
        quality -= 5
    return buf.getvalue()

def upload_to_cloudinary(webp_bytes, folder, public_id):
    timestamp = int(time.time())
    to_sign = f"folder={folder}&public_id={public_id}&timestamp={timestamp}{API_SECRET}"
    signature = hashlib.sha1(to_sign.encode('utf-8')).hexdigest()
    
    url = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload"
    files = {"file": ("image.webp", webp_bytes, "image/webp")}
    data = {
        "api_key": API_KEY,
        "timestamp": timestamp,
        "folder": folder,
        "public_id": public_id,
        "signature": signature
    }
    r = requests.post(url, data=data, files=files, timeout=45)
    return r.status_code, r.json()

for item in ITEMS:
    slug = item["slug"]
    category_slug = item["category_slug"]
    clean_filename = item["clean_filename"]
    public_id = os.path.splitext(clean_filename)[0]
    folder = f"yahduth/articles/{category_slug}"
    
    r = requests.get(item["url"], headers={"User-Agent": "Mozilla/5.0"}, timeout=15)
    webp_bytes = process_and_crop(r.content)
    
    local_path = os.path.join("public", "images", "articles", category_slug, clean_filename)
    with open(local_path, "wb") as f:
        f.write(webp_bytes)
        
    code, resp = upload_to_cloudinary(webp_bytes, folder, public_id)
    if code == 200 and "secure_url" in resp:
        secure_url = resp["secure_url"]
        print(f"✓ Uploaded {slug} -> {secure_url}")
        
        with open("scripts/cloudinary_manifest.json", "r", encoding="utf-8") as f:
            c_manifest = json.load(f)
        c_manifest[slug] = {
            "slug": slug,
            "category_slug": category_slug,
            "clean_filename": clean_filename,
            "secure_url": secure_url,
            "public_id": resp["public_id"],
            "bytes": len(webp_bytes),
            "format": "webp",
            "alt_text": item["alt"]
        }
        with open("scripts/cloudinary_manifest.json", "w", encoding="utf-8") as f:
            json.dump(c_manifest, f, ensure_ascii=False, indent=2)
            
        with open("scripts/all_articles_media_manifest.json", "r", encoding="utf-8") as f:
            a_manifest = json.load(f)
        for a in a_manifest:
            if a["slug"] == slug:
                a["alt_text"] = item["alt"]
                a["source"] = item["source"]
                a["file_size_kb"] = round(len(webp_bytes) / 1024, 1)
        with open("scripts/all_articles_media_manifest.json", "w", encoding="utf-8") as f:
            json.dump(a_manifest, f, ensure_ascii=False, indent=2)
    else:
        print(f"Failed for {slug}: {resp}")

print("Done with the final two!")
