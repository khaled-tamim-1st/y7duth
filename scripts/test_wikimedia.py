import requests
import json

headers = {'User-Agent': 'KuwaitMediaSEO/1.0 (https://yahduth-fi-al-kuwait.com; contact@yahduth-fi-al-kuwait.com)'}

def search_wikimedia(query, limit=3):
    url = 'https://commons.wikimedia.org/w/api.php'
    params = {
        'action': 'query',
        'format': 'json',
        'generator': 'search',
        'gsrsearch': query,
        'gsrnamespace': '6',
        'gsrlimit': limit,
        'prop': 'imageinfo',
        'iiprop': 'url|size|mime|extmetadata'
    }
    try:
        r = requests.get(url, params=params, headers=headers, timeout=10)
        data = r.json()
        pages = data.get('query', {}).get('pages', {})
        results = []
        for pid, p in pages.items():
            info = p.get('imageinfo', [{}])[0]
            url = info.get('url')
            if url and (url.endswith('.jpg') or url.endswith('.png') or url.endswith('.jpeg') or url.endswith('.webp')):
                results.append({
                    'title': p.get('title'),
                    'url': url,
                    'width': info.get('width', 0),
                    'height': info.get('height', 0),
                    'license': info.get('extmetadata', {}).get('LicenseShortName', {}).get('value', 'Unknown')
                })
        return results
    except Exception as e:
        print(f"Error querying {query}: {e}")
        return []

tests = [
    'Kuwait Seif Palace',
    'Kuwait Red Fort',
    'Kuwait Gate Naif',
    'Dickson House Kuwait',
    'Bayt Al Badr Kuwait',
    'Souq Al-Mubarakiya',
    'American Mission Hospital Kuwait',
    'Failaka Island Kuwait',
    'Kuwait Dinar',
    'Kuwait stamp 1923'
]

for t in tests:
    res = search_wikimedia(t, limit=1)
    if res:
        print(f"FOUND [{t}] -> {res[0]['title']} ({res[0]['license']}) | {res[0]['url'][:80]}...")
    else:
        print(f"NOT FOUND [{t}]")
