import os
import sys
import requests
from PIL import Image
import io
import json

sys.stdout.reconfigure(encoding='utf-8')

headers = {'User-Agent': 'KuwaitHeritageApp/1.0 (info@yahduth-fi-al-kuwait.com)'}

def get_wikimedia_url(file_title):
    api_url = 'https://commons.wikimedia.org/w/api.php'
    params = {
        'action': 'query',
        'titles': file_title,
        'prop': 'imageinfo',
        'iiprop': 'url',
        'format': 'json'
    }
    try:
        r = requests.get(api_url, params=params, headers=headers, timeout=15)
        pages = r.json().get('query', {}).get('pages', {})
        for _, p in pages.items():
            info = p.get('imageinfo', [{}])[0]
            if 'url' in info:
                return info['url']
    except Exception as e:
        print(f"Error fetching wikimedia URL for {file_title}: {e}")
    return None

def process_and_save_image(image_bytes, dest_path):
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    im = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    orig_w, orig_h = im.size
    target_ratio = 16.0 / 9.0
    current_ratio = orig_w / orig_h
    
    if current_ratio > target_ratio:
        new_w = int(orig_h * target_ratio)
        left = (orig_w - new_w) // 2
        im = im.crop((left, 0, left + new_w, orig_h))
    else:
        new_h = int(orig_w / target_ratio)
        top = (orig_h - new_h) // 2
        im = im.crop((0, top, orig_w, top + new_h))
        
    im = im.resize((1200, 675), Image.Resampling.LANCZOS)
    
    quality = 84
    while quality >= 55:
        im.save(dest_path, 'WEBP', quality=quality, method=6)
        size_kb = os.path.getsize(dest_path) / 1024
        if size_kb <= 245:
            break
        quality -= 5
        
    return os.path.getsize(dest_path) / 1024, quality

print("Helper functions ready.")
