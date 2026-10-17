import os
import sys
import requests
from PIL import Image
import io

sys.stdout.reconfigure(encoding='utf-8')

os.makedirs('public/images/articles/sofra-al-deera', exist_ok=True)

headers = {'User-Agent': 'KuwaitHeritage/1.0 (info@yahduth-fi-al-kuwait.com)'}

# 20 articles in Sofra Al-Deera
sofra_items = [
    {
        "slug": "machboos-laham-kuwaiti-classic",
        "clean_filename": "machboos-laham-kuwaiti-classic-feast.webp",
        "alt_text": "مجبوس اللحم الكويتي الأصيل مع الحشو الذهبي بالزعفران وحبات اللومي ودهن العداني",
        "url": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1400&q=85",
        "source": "Unsplash Royalty-Free",
        "license": "Unsplash License (Commercial Free)"
    },
    {
        "slug": "mutabbaq-zubaidi-hamoor-seafood-classics",
        "clean_filename": "mutabbaq-zubaidi-kuwaiti-classic-fish.webp",
        "alt_text": "مطبق سمك الزبيدي الكويتي الفضي المقرمش فوق الأرز الحبة الطويلة وحشو الكشمش والنخي",
        "url": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1400&q=85",
        "source": "Unsplash Royalty-Free",
        "license": "Unsplash License (Commercial Free)"
    },
    {
        "slug": "ghozi-kuwaiti-diwaniya-feasts",
        "clean_filename": "ghozi-kuwaiti-diwaniya-feast-rice.webp",
        "alt_text": "صينية القوزي الكويتي المحشو بالبيض والزعفران والمكسرات لولائم الدواوين والمناسبات",
        "url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=85",
        "source": "Unsplash Royalty-Free",
        "license": "Unsplash License (Commercial Free)"
    },
    {
        "slug": "al-harees-wa-al-jareesh-al-kuwaiti-turath",
        "clean_filename": "harees-jareesh-kuwaiti-daraseen-ghee.webp",
        "alt_text": "طبق الهريس الكويتي التراثي المضروب والمزين بمسحوق الدارسين ودهن العداني الخالص",
        "url": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1400&q=85",
        "source": "Unsplash Royalty-Free",
        "license": "Unsplash License (Commercial Free)"
    },
    {
        "slug": "al-marqoqah-wa-al-qabbout-al-kuwaiti",
        "clean_filename": "marqoqah-qabbout-kuwaiti-traditional-stew.webp",
        "alt_text": "طبق المرقوقة والقبوط الكويتي بعجين البُر الشهي ومرق اللحم والخضار التراثي",
        "url": "https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=1400&q=85",
        "source": "Unsplash Royalty-Free",
        "license": "Unsplash License (Commercial Free)"
    },
    {
        "slug": "maraq-al-hamour-al-kuwaiti-daqoos-maabouj",
        "clean_filename": "maraq-hamour-kuwaiti-daqoos-maabouj.webp",
        "alt_text": "مرقة سمك الهامور الكويتية الخائرة مع الدقوس الحار ومعبوج الفلفل الحار",
        "url": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1400&q=85",
        "source": "Unsplash Royalty-Free",
        "license": "Unsplash License (Commercial Free)"
    },
    {
        "slug": "al-muaddas-al-kuwaiti-ayam-al-ghaim",
        "clean_filename": "muaddas-kuwaiti-lentil-rice-rain.webp",
        "alt_text": "طبق المعدس الكويتي التقليدي بالأرز والعدس الأصفر ودهن العداني في الأيام الماطرة",
        "url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1400&q=85",
        "source": "Unsplash Royalty-Free",
        "license": "Unsplash License (Commercial Free)"
    },
    {
        "slug": "al-mmoosh-wa-mmoosh-al-rubyan-al-yabis-kuwait",
        "clean_filename": "mmoosh-rubyan-yabis-kuwaiti-winter.webp",
        "alt_text": "طبق المموش الكويتي الشتوي مع الروبيان اليابس ودهن العداني الفواح",
        "url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1400&q=85",
        "source": "Unsplash Royalty-Free",
        "license": "Unsplash License (Commercial Free)"
    },
    {
        "slug": "muhammar-samak-maleh-kuwaiti-pearl-divers",
        "clean_filename": "muhammar-samak-maleh-pearl-divers-kuwait.webp",
        "alt_text": "أرز المحمر المحلى بدبس التمر مع السمك المالح المقلي لغواصي اللؤلؤ في الكويت",
        "url": "https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=1400&q=85",
        "source": "Unsplash Royalty-Free",
        "license": "Unsplash License (Commercial Free)"
    },
    {
        "slug": "samak-al-suboor-al-mashwi-bil-meefa-turath-kuwaiti",
        "clean_filename": "samak-suboor-mashwi-meefa-kuwait.webp",
        "alt_text": "سمك الصبور الكويتي المشوي بحشوة الصبار والتمر الهندي في تنور الميفا التراثي",
        "url": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1400&q=85",
        "source": "Unsplash Royalty-Free",
        "license": "Unsplash License (Commercial Free)"
    },
    {
        "slug": "samak-al-maid-al-mashwi-ala-al-seif-kuwait",
        "clean_filename": "samak-maid-mashwi-seif-kuwait.webp",
        "alt_text": "شواء سمك الميد الطازج على شاطئ السيف الكويتي فوق الجمر المتقد",
        "url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=85",
        "source": "Unsplash Royalty-Free",
        "license": "Unsplash License (Commercial Free)"
    },
    {
        "slug": "hamsat-al-roobian-wal-khathaq-al-kuwaiti",
        "clean_filename": "hamsat-roobian-khathaq-kuwaiti-seafood.webp",
        "alt_text": "حمسة الروبيان الكويتي الطازج والخثاق بالبصل المحمر والطماطم واللومي الأسود",
        "url": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1400&q=85",
        "source": "Unsplash Royalty-Free",
        "license": "Unsplash License (Commercial Free)"
    },
    {
        "slug": "al-luqaimat-wa-sobb-al-qafsha-layali-ramadan-al-kuwait",
        "clean_filename": "luqaimat-sobb-al-qafsha-ramadan-kuwait.webp",
        "alt_text": "حلويات اللقيمات المقرمشة وصب القفشة بالزعفران والهيل لموائد الغبقات الرمضانية الكويتية",
        "url": "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=1400&q=85",
        "source": "Unsplash Royalty-Free",
        "license": "Unsplash License (Commercial Free)"
    },
    {
        "slug": "al-balaleet-wa-qurs-al-tabi-subah-al-eid-al-kuwait",
        "clean_filename": "balaleet-qurs-tabi-breakfast-kuwait.webp",
        "alt_text": "طبق البلاليط الكويتي بالهيل والزعفران يعلوه قرص البيض المقلي لفطور الجمعة والأعياد",
        "url": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1400&q=85",
        "source": "Unsplash Royalty-Free",
        "license": "Unsplash License (Commercial Free)"
    },
    {
        "slug": "darabeel-wa-qurs-uqaili-diyafat-al-eid-al-kuwait",
        "clean_filename": "darabeel-qurs-uqaili-eid-kuwait.webp",
        "alt_text": "رقائق الدرابيل بالقرفة والقرص العقيلي الموشى بالسمسم والزعفران لضيافة العيد بالكويت",
        "url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1400&q=85",
        "source": "Unsplash Royalty-Free",
        "license": "Unsplash License (Commercial Free)"
    },
    {
        "slug": "al-rahash-wal-halwa-al-omaniyya-bil-tamr-al-kuwait",
        "clean_filename": "rahash-kuwaiti-halwa-tamr-traditional.webp",
        "alt_text": "حلوى الرهش الكويتي بالسمسم الفاخر مع الحلوى العمانية ورطب التمر والقهوة المرة",
        "url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1400&q=85",
        "source": "Unsplash Royalty-Free",
        "license": "Unsplash License (Commercial Free)"
    },
    {
        "slug": "qahwa-arabiya-kuwaitiya-adab-al-finjan",
        "clean_filename": "qahwa-arabiya-kuwaitiya-dallah-finjan.webp",
        "alt_text": "دلة القهوة العربية الكويتية الشقراء وفناجين الضيافة التراثية في مجلس ديوانية أصيلة",
        "url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1400&q=85",
        "source": "Unsplash Royalty-Free",
        "license": "Unsplash License (Commercial Free)"
    },
    {
        "slug": "shay-fahm-ma-al-laqah-sharbat-baidhan",
        "clean_filename": "shay-fahm-laqah-sharbat-baidhan-kuwait.webp",
        "alt_text": "استكانات شاي الفحم المخدر على رماد المنقلة وشراب البيذان وماء اللقاح الكويتي",
        "url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1400&q=85",
        "source": "Unsplash Royalty-Free",
        "license": "Unsplash License (Commercial Free)"
    },
    {
        "slug": "bizar-kuwaiti-loomi-sahari",
        "clean_filename": "bizar-kuwaiti-spices-loomi-sahari.webp",
        "alt_text": "توليفة البزار الكويتي التقليدي واللومي السحاري الأسود المجفف لنكهة المرق الأصيل",
        "url": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1400&q=85",
        "source": "Unsplash Royalty-Free",
        "license": "Unsplash License (Commercial Free)"
    },
    {
        "slug": "ajar-kuwaiti-mukhallalat-turathiya",
        "clean_filename": "ajar-kuwaiti-bastooga-pickles.webp",
        "alt_text": "بستوكة الآجار الكويتي التراثي والمخللات التقليدية بالهمبا والثوم الجبلي والخل الطبيعي",
        "url": "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=1400&q=85",
        "source": "Unsplash Royalty-Free",
        "license": "Unsplash License (Commercial Free)"
    }
]

def process_item(item):
    dest_path = os.path.join('public', 'images', 'articles', 'sofra-al-deera', item['clean_filename'])
    print(f"Downloading {item['clean_filename']}...")
    r = requests.get(item['url'], headers=headers, timeout=20)
    if r.status_code != 200:
        raise Exception(f"Failed to download {item['url']}, status {r.status_code}")
    
    im = Image.open(io.BytesIO(r.content)).convert('RGB')
    
    # Crop to 16:9
    orig_w, orig_h = im.size
    target_ratio = 16.0 / 9.0
    current_ratio = orig_w / orig_h
    
    if current_ratio > target_ratio:
        # Too wide, crop width
        new_w = int(orig_h * target_ratio)
        left = (orig_w - new_w) // 2
        im = im.crop((left, 0, left + new_w, orig_h))
    else:
        # Too tall, crop height
        new_h = int(orig_w / target_ratio)
        top = (orig_h - new_h) // 2
        im = im.crop((0, top, orig_w, top + new_h))
        
    im = im.resize((1200, 675), Image.Resampling.LANCZOS)
    
    # Save as WebP with target size < 250KB
    quality = 84
    while quality >= 60:
        im.save(dest_path, 'WEBP', quality=quality, method=6)
        size_kb = os.path.getsize(dest_path) / 1024
        if size_kb <= 245:
            break
        quality -= 5
        
    size_kb = os.path.getsize(dest_path) / 1024
    print(f"✓ Saved {dest_path} ({size_kb:.1f} KB, quality={quality})")
    item['saved_path'] = f"/images/articles/sofra-al-deera/{item['clean_filename']}"
    item['file_size_kb'] = round(size_kb, 1)

if __name__ == '__main__':
    for it in sofra_items:
        process_item(it)
    import json
    with open('scripts/processed_sofra.json', 'w', encoding='utf-8') as f:
        json.dump(sofra_items, f, ensure_ascii=False, indent=2)
    print("All 20 Sofra Al-Deera images processed successfully!")
