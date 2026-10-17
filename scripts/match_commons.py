import json
import requests
import time

headers = {'User-Agent': 'KuwaitHeritageApp/1.0 (info@yahduth-fi-al-kuwait.com)'}

def search_commons(query, limit=5):
    url = 'https://commons.wikimedia.org/w/api.php'
    params = {
        'action': 'query',
        'format': 'json',
        'list': 'search',
        'srnamespace': '6',
        'srsearch': query,
        'srlimit': limit
    }
    try:
        r = requests.get(url, params=params, headers=headers, timeout=10)
        items = r.json().get('query', {}).get('search', [])
        return [it['title'] for it in items]
    except Exception as e:
        return []

def get_image_info(title):
    url = 'https://commons.wikimedia.org/w/api.php'
    params = {
        'action': 'query',
        'titles': title,
        'prop': 'imageinfo',
        'iiprop': 'url|size|extmetadata',
        'format': 'json'
    }
    try:
        r = requests.get(url, params=params, headers=headers, timeout=10)
        pages = r.json().get('query', {}).get('pages', {})
        for _, p in pages.items():
            info = p.get('imageinfo', [{}])[0]
            url = info.get('url')
            if url and (url.endswith('.jpg') or url.endswith('.jpeg') or url.endswith('.png') or url.endswith('.webp')):
                license_name = info.get('extmetadata', {}).get('LicenseShortName', {}).get('value', 'CC')
                return {
                    'title': title,
                    'url': url,
                    'width': info.get('width', 0),
                    'height': info.get('height', 0),
                    'license': license_name
                }
    except Exception:
        pass
    return None

if __name__ == '__main__':
    with open('scripts/articles_summary.json', 'r', encoding='utf-8') as f:
        articles = json.load(f)
    print(f"Loaded {len(articles)} articles.")
