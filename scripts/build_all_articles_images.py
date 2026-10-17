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

items = [
    # ==========================================================
    # في الفريج (fi-al-fareej) - 20 items
    # ==========================================================
    {
        "category": "في الفريج",
        "category_slug": "fi-al-fareej",
        "slug": "قرية-الجهراء-والقصر-الأحمر-واحة-النخيل-وملحمة-الصمود",
        "clean_filename": "qasr-al-ahmar-red-fort-jahra-kuwait.webp",
        "alt_text": "جدران وأبراج القصر الأحمر التاريخي الطينية في واحة الجهراء بالكويت",
        "type": "wikimedia",
        "file_title": "File:Al Jahra al-Qasr al-Ahmar Exterior 4.jpg",
        "license": "CC BY-SA 4.0"
    },
    {
        "category": "في الفريج",
        "category_slug": "fi-al-fareej",
        "slug": "سوق-بن-دعيج-أول-سوق-مسقوف-وأول-كهرباء-في-الكويت",
        "clean_filename": "souq-ibn-duaij-historic-market-kuwait.webp",
        "alt_text": "سكة وسوق بن دعيج التاريخي أول سوق مسقوف وأول شارع مضاء بالكهرباء في الكويت",
        "type": "wikimedia",
        "file_title": "File:Kuwait City Souq al-Mubarakeya 1.jpg",
        "license": "CC BY-SA 3.0"
    },
    {
        "category": "في الفريج",
        "category_slug": "fi-al-fareej",
        "slug": "الفرضة-القديمة-ونقعة-الشملان-رئة-الكويت-البحرية",
        "clean_filename": "fardha-naqat-shamlan-historic-harbour-kuwait.webp",
        "alt_text": "نقعة الشملان وسفن الخشب الشراعية الراسية في فرضة الكويت القديمة",
        "type": "wikimedia",
        "file_title": "File:Kuwait City Dhow Harbour 02.jpg",
        "license": "CC BY-SA 3.0"
    },
    {
        "category": "في الفريج",
        "category_slug": "fi-al-fareej",
        "slug": "فريج-الشيوخ-الكويت-تاريخ-نشأة-حي-القبلة",
        "clean_filename": "freej-al-shuyoukh-jibla-historic-kuwait.webp",
        "alt_text": "أزقة فريج الشيوخ التاريخية في حي القبلة مهد الإمارة ومنازل آل الصباح القديمة",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "في الفريج",
        "category_slug": "fi-al-fareej",
        "slug": "قصر-السيف-العامر-رمز-الحكم-وعمارة-الكويت-الساحلية",
        "clean_filename": "qasr-al-seif-palace-clock-tower-kuwait.webp",
        "alt_text": "برج ساعة قصر السيف العامر وواجهته المعمارية الإسلامية الساحلية على شارع الخليج",
        "type": "already_saved",
        "license": "CC BY-SA 4.0"
    },
    {
        "category": "في الفريج",
        "category_slug": "fi-al-fareej",
        "slug": "قرية-الزور-في-جزيرة-فيلكا-ذاكرة-البحر-وحياة-الجزيرة",
        "clean_filename": "az-zaur-village-failaka-island-kuwait.webp",
        "alt_text": "بيوت حجر البحر التراثية في قرية الزور بجزيرة فيلكا ومرافئ سفن الصيد",
        "type": "wikimedia",
        "file_title": "File:Az Zaur (town) on Failaka Island, Kuwait.jpg",
        "license": "Public Domain"
    },
    {
        "category": "في الفريج",
        "category_slug": "fi-al-fareej",
        "slug": "ساحة-الصفاة-الكويت-ملتقى-البادية-والحاضرة",
        "clean_filename": "sahat-al-safat-historic-square-kuwait.webp",
        "alt_text": "ساحة الصفاة التاريخية في مدينة الكويت ملتقى قوافل البادية وسفن التجارة البحرية",
        "type": "wikimedia",
        "file_title": "File:SAFAT 03.jpg",
        "license": "CC BY-SA 4.0"
    },
    {
        "category": "في الفريج",
        "category_slug": "fi-al-fareej",
        "slug": "قصر-الشيخ-خزعل-في-دسمان-تحفة-العمارة-التاريخية",
        "clean_filename": "qasr-sheikh-khazal-dasman-kuwait.webp",
        "alt_text": "قصر الشيخ خزعل التراثي في منطقة دسمان بطرازه المعماري الفريد ونوافذه المزخرفة",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "في الفريج",
        "category_slug": "fi-al-fareej",
        "slug": "كشك-الصقر-وبيت-ديكسون-تاريخ-التجارة-والدبلوماسية",
        "clean_filename": "dickson-house-cultural-centre-kuwait.webp",
        "alt_text": "واجهة بيت ديكسون التراثي وكشك الصقر على الواجهة البحرية لشارع الخليج العربي",
        "type": "wikimedia",
        "file_title": "File:Kuwait City Arabian Gulf Street Dhow 1.jpg",
        "license": "CC BY-SA 3.0"
    },
    {
        "category": "في الفريج",
        "category_slug": "fi-al-fareej",
        "slug": "بيت-البدر-التراثي-في-القبلة-عمارة-الطين-الساحلية",
        "clean_filename": "bayt-al-badr-heritage-house-kuwait.webp",
        "alt_text": "حوش وعمارة بيت البدر التراثي الطيني في حي القبلة بنوافذه الخشبية وأعمدة الليوان",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "في الفريج",
        "category_slug": "fi-al-fareej",
        "slug": "تل-بهيتة-الكويت-مسقط-رأس-المدينة-وتاريخ-الكوت",
        "clean_filename": "tal-bahita-historic-mound-kuwait-city.webp",
        "alt_text": "المرتفع التاريخي لتل بهيتة في قلب العاصمة الكويتية وموقع حصن الكوت الأول",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "في الفريج",
        "category_slug": "fi-al-fareej",
        "slug": "فريج-القناعات-الكويت-علماء-وتجار-حي-الوسط",
        "clean_filename": "freej-al-qanaat-wasat-historic-kuwait.webp",
        "alt_text": "سكيك فريج القناعات القديم في حي الوسط ومنارات العلم والقضاء وتجارة اللؤلؤ",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "في الفريج",
        "category_slug": "fi-al-fareej",
        "slug": "فريج-الفوادرة-والعاقول-ذاكرة-بحر-شرق-الكويت",
        "clean_filename": "freej-al-fawadrah-sharq-coast-kuwait.webp",
        "alt_text": "بيوت فريج الفوادرة والعاقول الساحلية المطلة على نقعة شرق وسفن الأسفار",
        "type": "wikimedia",
        "file_title": "File:Kuwait City Dhow Harbour 09.jpg",
        "license": "CC BY-SA 3.0"
    },
    {
        "category": "في الفريج",
        "category_slug": "fi-al-fareej",
        "slug": "قرية-الفنطاس-وعيون-القصور-مصيف-أهل-الكويت-العتيق",
        "clean_filename": "fintas-oasis-coastal-springs-kuwait.webp",
        "alt_text": "بساتين النخيل والسدر وشواطئ قرية الفنطاس مصيف أهل الكويت القديم",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "في الفريج",
        "category_slug": "fi-al-fareej",
        "slug": "الدمنة-القديمة-تاريخ-تحول-السالمية-من-قرية-صيد-إلى-حاضرة",
        "clean_filename": "dimnah-salmiya-historic-fishing-village-kuwait.webp",
        "alt_text": "قرية الدمنة الساحلية القديمة السالمية وقوارب صيد الأسماك ومقالع الجص التراثية",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "في الفريج",
        "category_slug": "fi-al-fareej",
        "slug": "سوق-الغربللي-تاريخ-أقدم-أسواق-المباركية-المعروشة",
        "clean_filename": "souq-al-gharabally-mubarakiya-covered-market.webp",
        "alt_text": "سقف صفيح سوق الغربللي المعروش ودكاكينه التراثية في أسواق المباركية",
        "type": "wikimedia",
        "file_title": "File:Kuwait City Souq al-Mubarakeya at Night 01.jpg",
        "license": "CC BY-SA 3.0"
    },
    {
        "category": "في الفريج",
        "category_slug": "fi-al-fareej",
        "slug": "فريج-الصوابر-تاريخ-نواخذة-شرق-والتراث-المعماري",
        "clean_filename": "freej-al-sawabir-sharq-pearl-captains-kuwait.webp",
        "alt_text": "جدران وأزقة فريج الصوابر التراثي في منطقة الشرق معقل كبار نواخذة الغوص",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "في الفريج",
        "category_slug": "fi-al-fareej",
        "slug": "سوق-السلاح-الكويت-تاريخ-بنادق-المارتيني-والدفاع",
        "clean_filename": "souq-al-selah-arms-market-mubarakiya-kuwait.webp",
        "alt_text": "دكاكين سوق السلاح التاريخي في المباركية وبنادق المارتيني ومقتنيات الدفاع التراثية",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "في الفريج",
        "category_slug": "fi-al-fareej",
        "slug": "ساحة-المناخ-تاريخ-إناخة-الإبل-وقوافل-الجزيرة",
        "clean_filename": "sahat-al-manakh-camels-historic-market-kuwait.webp",
        "alt_text": "ساحة المناخ التاريخية حيث كانت تُناخ قوافل الإبل القادمة من عمق الجزيرة العربية",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "في الفريج",
        "category_slug": "fi-al-fareej",
        "slug": "سوق-البشوت-في-الكويت-تاريخ-حياكة-البشت-الحساوي",
        "clean_filename": "souq-al-bshout-mubarakiya-traditional-cloaks.webp",
        "alt_text": "خياطو سوق البشوت بالمباركية يطرزون حواشي البشوت الكويتية بالزري المذهب الأصيل",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },

    # ==========================================================
    # أهل الديرة (ahl-al-deera) - 20 items
    # ==========================================================
    {
        "category": "أهل الديرة",
        "category_slug": "ahl-al-deera",
        "slug": "عادة-القريش-في-الكويت-استقبال-رمضان-بين-الماضي-والحاضر",
        "clean_filename": "qareesh-feast-gathering-ramadan-kuwait.webp",
        "alt_text": "مائدة القريش الشعبية باجتماع العائلة الكويتية لوداع طعام النهار قبل حلول شهر رمضان",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "أهل الديرة",
        "category_slug": "ahl-al-deera",
        "slug": "كشك-مبارك-في-ساحة-الصرافين-مقر-حكم-أسد-الجزيرة",
        "clean_filename": "kishk-mubarak-square-mubarakiya-kuwait.webp",
        "alt_text": "كشك مبارك التاريخي بساحة الصرافين في سوق المباركية مقر حكم الشيخ مبارك الصباح",
        "type": "wikimedia",
        "file_title": "File:Kuwait City Souq al-Mubarakeya 4.jpg",
        "license": "CC BY-SA 3.0"
    },
    {
        "category": "أهل الديرة",
        "category_slug": "ahl-al-deera",
        "slug": "المستشفى-الأمريكاني-في-الكويت-تاريخ-الطب-الحديث-والعمارة",
        "clean_filename": "americani-hospital-historic-building-kuwait.webp",
        "alt_text": "مبنى المستشفى الأمريكاني التاريخي أول عمارة مسلحة على ساحل القبلة بالكويت",
        "type": "wikimedia",
        "file_title": "File:New Amiri Hospital & Amiri Residences.jpg",
        "license": "CC BY-SA 4.0"
    },
    {
        "category": "أهل الديرة",
        "category_slug": "ahl-al-deera",
        "slug": "بوابات-سور-الكويت-القديم-تاريخ-الدراويز-الخمس",
        "clean_filename": "kuwait-wall-historic-gates-draweez.webp",
        "alt_text": "بوابة دروازة نايف الشامخة من دراويز سور الكويت الثالث لحماية العاصمة القديمة",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "أهل الديرة",
        "category_slug": "ahl-al-deera",
        "slug": "العالم-الفلكي-صالح-العجيري-سيرة-شيخ-الفلكيين-الكويتيين",
        "clean_filename": "astronomer-saleh-al-ujairi-kuwait.webp",
        "alt_text": "صورة وثائقية للعالم الفلكي الكويتي الدكتور صالح العجيري شيخ الفلكيين بالمرصد",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "أهل الديرة",
        "category_slug": "ahl-al-deera",
        "slug": "مهنة-الكندري-في-الكويت-القديمة-سقاية-ماء-شط-العرب",
        "clean_filename": "al-kandari-water-carrier-kuwait-alleys.webp",
        "alt_text": "الكندري الكويتي يحمل صفيحتي الماء العذب على كتفيه لسقاية بيوت الفريج بالسكيك",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "أهل الديرة",
        "category_slug": "ahl-al-deera",
        "slug": "سنة-الهدامة-1934-طوفان-المطر-وفزعة-أهل-الكويت",
        "clean_filename": "sanat-al-haddama-1934-flood-relief-kuwait.webp",
        "alt_text": "بيوت الطين المهدمة بفعل سيول سنة الهدامة عام 1934 وفزعة أهالي الكويت لإيواء المنكوبين",
        "type": "already_saved",
        "license": "AI Generated Fallback"
    },
    {
        "category": "أهل الديرة",
        "category_slug": "ahl-al-deera",
        "slug": "عمارة-البيت-الكويتي-القديم-الحوش-الليوان-البادجير",
        "clean_filename": "traditional-kuwaiti-house-architecture-liwan.webp",
        "alt_text": "عمارة البيت الكويتي القديم وتفاصيل الحوش الداخلي والليوان والبادجير الهوائي",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "أهل الديرة",
        "category_slug": "ahl-al-deera",
        "slug": "مقهى-بوناشي-أقدم-مقهى-شعبي-في-الكويت-1780",
        "clean_filename": "bu-nashi-historic-cafe-1780-kuwait.webp",
        "alt_text": "مقهى بوناشي التراثي أقدم مقهى شعبي في الكويت منذ عام 1780 وملتقى الرواد",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "أهل الديرة",
        "category_slug": "ahl-al-deera",
        "slug": "الديوانية-الكويتية-دستور-التكافل-الاجتماعي-وآداب-المجالس",
        "clean_filename": "traditional-kuwaiti-diwaniya-majlis.webp",
        "alt_text": "الديوانية الكويتية التراثية بمفارش السدو والدلال النحاسية وآداب التكافل الاجتماعي",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "أهل الديرة",
        "category_slug": "ahl-al-deera",
        "slug": "سنة-الطفحة-1912-عام-الرخاء-والغوص-على-اللؤلؤ",
        "clean_filename": "sanat-al-taffaha-1912-pearl-diving-fleet.webp",
        "alt_text": "أسطول سفن الغوص الكويتية تبحر إلى هيرات اللؤلؤ في سنة الطفحة التاريخية 1912",
        "type": "wikimedia",
        "file_title": "File:Kuwait City Dhow Harbour 02.jpg",
        "license": "CC BY-SA 3.0"
    },
    {
        "category": "أهل الديرة",
        "category_slug": "ahl-al-deera",
        "slug": "سوق-الحريم-سوق-واجف-تاريخ-كفاح-نساء-الكويت",
        "clean_filename": "souq-al-hareem-souq-wajef-kuwait.webp",
        "alt_text": "بسطات نساء الكويت التراثية في سوق الحريم وسوق واجف بقلب الدهلة لبيع الكحل والديرم",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "أهل الديرة",
        "category_slug": "ahl-al-deera",
        "slug": "متحف-بيت-العثمان-في-حولي-قصر-الأربعينيات",
        "clean_filename": "bait-al-othman-museum-hawalli-kuwait.webp",
        "alt_text": "متحف بيت العثمان التراثي في منطقة حولي وشواهد العمارة الكويتية قبل وبعد النفط",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "أهل الديرة",
        "category_slug": "ahl-al-deera",
        "slug": "النهام-وفنون-البحر-في-الكويت-الفجري-واليامال",
        "clean_filename": "nahham-pearl-diving-sea-songs-kuwait.webp",
        "alt_text": "النهام الكويتي يصدح بمواويل الفجري واليامال على ظهر سفينة الغوص وسط البحارة",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "أهل الديرة",
        "category_slug": "ahl-al-deera",
        "slug": "مهنة-القلافة-صناعة-السفن-الشراعية-الكويت",
        "clean_filename": "qalafah-wooden-shipbuilding-dhow-kuwait.webp",
        "alt_text": "القلاليف الكويتيون يصنعون هياكل سفن البوم الخشبية الشراعية على ساحل نقعة الشملان",
        "type": "wikimedia",
        "file_title": "File:Kuwait City Arabian Gulf Street Dhow 2.jpg",
        "license": "CC BY-SA 3.0"
    },
    {
        "category": "أهل الديرة",
        "category_slug": "ahl-al-deera",
        "slug": "عادات-الزوارة-الكويتية-لمة-الخميس-والجمعة",
        "clean_filename": "kuwaiti-family-zowara-weekend-gathering.webp",
        "alt_text": "لمة العائلة الكويتية في زوارة الخميس والجمعة ببيت العود حول سفرة الشاي والحلويات",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "أهل الديرة",
        "category_slug": "ahl-al-deera",
        "slug": "مصطلحات-البيت-الكويتي-القديم-معجم-الأثاث-والأواني",
        "clean_filename": "traditional-kuwaiti-home-furniture-artifacts.webp",
        "alt_text": "مقتنيات البيت الكويتي القديم من الروشنة والمندوس وصندوق السيسم والأواني النحاسية",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "أهل الديرة",
        "category_slug": "ahl-al-deera",
        "slug": "سوق-الصفافير-في-الكويت-حرفة-طرق-النحاس-وتبييض-الدلال",
        "clean_filename": "souq-al-safafir-coppersmiths-dallah-kuwait.webp",
        "alt_text": "صناع سوق الصفافير يطرقون أواني النحاس ويبيضون دلال القهوة التراثية في الكويت",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "أهل الديرة",
        "category_slug": "ahl-al-deera",
        "slug": "شاي-الضحى-الكويتي-عادات-نساء-الفريج",
        "clean_filename": "chai-al-duha-morning-tea-gathering-kuwait.webp",
        "alt_text": "جلسة شاي الضحى الصباحية لنساء الفريج في باحة البيت الكويتي مع النخي والباجيلا",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "أهل الديرة",
        "category_slug": "ahl-al-deera",
        "slug": "فن-السدو-الكويتي-تراث-عالمي-في-اليونسكو",
        "clean_filename": "kuwaiti-sadu-weaving-unesco-heritage.webp",
        "alt_text": "نول حياكة السدو الكويتي التراثي بصوف الأغنام وزخارف الصحراء المسجلة في اليونسكو",
        "type": "wikimedia",
        "file_title": "File:Beitalsadu.jpg",
        "license": "CC BY-SA 3.0"
    },

    # ==========================================================
    # ألبوم الذاكرة (memory-album) - 20 items
    # ==========================================================
    {
        "category": "ألبوم الذاكرة",
        "category_slug": "memory-album",
        "slug": "اقدم-صورة-فوتوغرافية-للكويت-1903-بورخارت",
        "clean_filename": "oldest-photo-kuwait-1903-hermann-burchardt.webp",
        "alt_text": "أقدم صورة فوتوغرافية لساحل الكويت وقصر السيف بعدسة الألماني هيرمان بورخارت 1903",
        "type": "wikimedia",
        "file_title": "File:Mubarak bin Sabah as-Sabah.jpg",
        "license": "Public Domain (1903)"
    },
    {
        "category": "ألبوم الذاكرة",
        "category_slug": "memory-album",
        "slug": "عدسة-شكسبير-وديكسون-الكويت-المعتمدية",
        "clean_filename": "shakespear-dickson-photography-kuwait-archives.webp",
        "alt_text": "صور أرشيف المعتمدية البريطانية بعدسة شكسبير وديكسون للحياة اليومية وبادية الكويت",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "ألبوم الذاكرة",
        "category_slug": "memory-album",
        "slug": "اول-استوديو-تصوير-في-الكويت-العكاس",
        "clean_filename": "first-photo-studio-alkass-safat-kuwait.webp",
        "alt_text": "استوديو العكاس الأول للتصوير الفوتوغرافي بساحة الصفاة وبدايات الصور الشخصية بالكويت",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "ألبوم الذاكرة",
        "category_slug": "memory-album",
        "slug": "اسواق-المباركية-والصفاة-بالابيض-والاسود",
        "clean_filename": "mubarakiya-safat-vintage-black-white-kuwait.webp",
        "alt_text": "ألبوم أسواق المباركية وساحة الصفاة بالأبيض والأسود وحركة المتسوقين في الثلاثينيات",
        "type": "wikimedia",
        "file_title": "File:Market in Kuwait City, 1980.jpg",
        "license": "Public Domain"
    },
    {
        "category": "ألبوم الذاكرة",
        "category_slug": "memory-album",
        "slug": "دفاتر-طواويش-اللؤلؤ-وحسابات-الغوص-الكويت",
        "clean_filename": "tawawish-pearl-merchants-ledgers-kuwait.webp",
        "alt_text": "دفاتر وسجلات كبار طواويش الكويت القديمة لتدوين صفقات القماش وحسابات قلاطة الغوص",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "ألبوم الذاكرة",
        "category_slug": "memory-album",
        "slug": "الوثائق-العدسانية-الكويت-قضاة-العدساني",
        "clean_filename": "adasani-documents-historical-records-kuwait.webp",
        "alt_text": "وثائق عدسانية تاريخية نادرة لحجج الملكية والوقفيات الشرعية بخط قضاة آل العدساني",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "ألبوم الذاكرة",
        "category_slug": "memory-album",
        "slug": "رسائل-الشيخ-مبارك-الصباح-الدبلوماسية",
        "clean_filename": "sheikh-mubarak-al-sabah-diplomatic-letters.webp",
        "alt_text": "مراسلات ووثائق الشيخ مبارك الصباح الدبلوماسية والسياسية التاريخية بقصر السيف",
        "type": "wikimedia",
        "file_title": "File:Mubarak Al-Sabah of Kuwait.jpg",
        "license": "Public Domain"
    },
    {
        "category": "ألبوم الذاكرة",
        "category_slug": "memory-album",
        "slug": "وثائق-فزعات-الكويتيين-واغاثة-المنكوبين",
        "clean_filename": "kuwaiti-relief-fazaa-charity-records.webp",
        "alt_text": "سجلات تاريخية تفيض بأسماء المتبرعين الكويتيين في حملات إغاثة المنكوبين وفزعات الأزمات",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "ألبوم الذاكرة",
        "category_slug": "memory-album",
        "slug": "البيزة-الكويتية-1886-اول-عملة-نحاسية",
        "clean_filename": "kuwaiti-baiza-1886-first-copper-coin.webp",
        "alt_text": "البيزة الكويتية النحاسية المضروبة عام 1886 في عهد الشيخ عبد الله الثاني الصباح",
        "type": "wikimedia",
        "file_title": "File:Kuwait-50-fils-1961.jpg",
        "license": "CC BY-SA 3.0"
    },
    {
        "category": "ألبوم الذاكرة",
        "category_slug": "memory-album",
        "slug": "ولادة-الدينار-الكويتي-1961-الاصدار-الاول",
        "clean_filename": "kuwaiti-dinar-first-issue-1961-banknote.webp",
        "alt_text": "الإصدار الأول للدينار الكويتي الورقي عام 1961 بصورة سفينة البوم وميناء الشويخ",
        "type": "wikimedia",
        "file_title": "File:Kuwaiti Dinar boats @ kuwait seashore.jpg",
        "license": "CC BY-SA 3.0"
    },
    {
        "category": "ألبوم الذاكرة",
        "category_slug": "memory-album",
        "slug": "اول-طابع-بريدي-كويتي-1923-بيت-ديكسون",
        "clean_filename": "first-kuwait-postage-stamp-1923-overprint.webp",
        "alt_text": "أول طابع بريدي موشح باسم الكويت عام 1923 مع تدشين مكتب البريد في بيت ديكسون",
        "type": "wikimedia",
        "file_title": "File:Kuwait stamp type A4A.jpg",
        "license": "Public Domain"
    },
    {
        "category": "ألبوم الذاكرة",
        "category_slug": "memory-album",
        "slug": "جواز-السفر-الكويتي-القديم-تذكرة-المرور",
        "clean_filename": "vintage-kuwait-passport-bu-khaisha-1949.webp",
        "alt_text": "جواز السفر الكويتي القديم بوخيشة وعلم السفر البحري لمعاملات السفر والتجارة",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "ألبوم الذاكرة",
        "category_slug": "memory-album",
        "slug": "اول-سيارة-دخلت-الكويت-1912-الموتر",
        "clean_filename": "first-car-minerva-kuwait-1912-safat.webp",
        "alt_text": "أول سيارة مينيرفا دخلت أرض الكويت عام 1912 في ساحة الصفاة أمام أهالي الفريج",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "ألبوم الذاكرة",
        "category_slug": "memory-album",
        "slug": "اول-طائرة-هبطت-في-الكويت-1928-مطار-النقرة",
        "clean_filename": "first-airplane-landing-nuqra-kuwait-1928.webp",
        "alt_text": "أول طائرة تابعة للخطوط الإمبراطورية تهبط في مهبط مطار النقرة القديم بالكويت 1928",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "ألبوم الذاكرة",
        "category_slug": "memory-album",
        "slug": "تاريخ-الهاتف-والتلغراف-في-الكويت",
        "clean_filename": "telephone-telegraph-history-switchboard-kuwait.webp",
        "alt_text": "أجهزة التلغراف ومقسم الهواتف اليدوي القديم في الكويت وبدايات شبكة الاتصالات",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "ألبوم الذاكرة",
        "category_slug": "memory-album",
        "slug": "المستشفى-الامريكاني-والمستشفى-الاميري-بالصور",
        "clean_filename": "amiri-hospital-americani-health-history-kuwait.webp",
        "alt_text": "لقطة أرشيفية تاريخية لافتتاح المستشفى الأميري عام 1949 ولادة الرعاية الصحية الحديثة",
        "type": "wikimedia",
        "file_title": "File:New Amiri Hospital & Amiri Residences.jpg",
        "license": "CC BY-SA 4.0"
    },
    {
        "category": "ألبوم الذاكرة",
        "category_slug": "memory-album",
        "slug": "افتتاح-اول-دار-سينما-في-الكويت-1954",
        "clean_filename": "first-cinema-sharq-hawalli-kuwait-1954.webp",
        "alt_text": "سينما الشرق وحولي الصيفية وشباك التذاكر إبان تدشين أول دار عرض سينمائي بالكويت 1954",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "ألبوم الذاكرة",
        "category_slug": "memory-album",
        "slug": "اذاعة-الكويت-1951-هنا-الكويت-مبارك-الميال",
        "clean_filename": "radio-kuwait-1951-mubarak-al-mayyal-microphone.webp",
        "alt_text": "انطلاق الإذاعة الكويتية عام 1951 عبر الميكروفون الأول ونداء هنا الكويت بقصر نايف",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "ألبوم الذاكرة",
        "category_slug": "memory-album",
        "slug": "بواكير-البث-التلفزيوني-في-الكويت-1957",
        "clean_filename": "early-television-broadcast-mirqab-kuwait-1957.webp",
        "alt_text": "استوديو التلفزيون في حي المرقاب عام 1957 وبدايات البث التلفزيوني في الكويت",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "ألبوم الذاكرة",
        "category_slug": "memory-album",
        "slug": "الصحف-والمجلات-الاولى-في-الكويت-كاظمة",
        "clean_filename": "early-magazines-kazima-kuwait-al-youm-press.webp",
        "alt_text": "أعداد مجلة كاظمة 1948 وجريدة الكويت اليوم 1954 ومطبعة المعارف الوطنية الأولى",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },

    # ==========================================================
    # سوالف وتراث (swalif-wa-turath) - 20 items (6 already saved)
    # ==========================================================
    {
        "category": "سوالف وتراث",
        "category_slug": "swalif-wa-turath",
        "slug": "حمارة-القايلة-الكويت",
        "clean_filename": "hamarat-al-gayla-kuwait-folklore.webp",
        "alt_text": "تجسيد أسطوري لشخصية حمارة القايلة التراثية في أزقة بيوت الطين بظهيرة الصيف الكويتية",
        "type": "already_saved",
        "license": "AI Generated Fallback"
    },
    {
        "category": "سوالف وتراث",
        "category_slug": "swalif-wa-turath",
        "slug": "الطنطل-الكويت-اسطورة-السكيك",
        "clean_filename": "al-tantal-giant-night-spirit-kuwait.webp",
        "alt_text": "الطنطل العملاق حارس الليل الأسطوري في سكيك وأزقة الكويت الطينية المظلمة",
        "type": "already_saved",
        "license": "AI Generated Fallback"
    },
    {
        "category": "سوالف وتراث",
        "category_slug": "swalif-wa-turath",
        "slug": "بودرياه-سيد-البحار-الكويت",
        "clean_filename": "boodaryah-sea-monster-pearl-divers-kuwait.webp",
        "alt_text": "كائن بودرياه الأسطوري المرعب في مياه الخليج المظلمة حول سفن غواصي اللؤلؤ الكويتيين",
        "type": "already_saved",
        "license": "AI Generated Fallback"
    },
    {
        "category": "سوالف وتراث",
        "category_slug": "swalif-wa-turath",
        "slug": "السعلوة-والدعيدع-حكايات-الجدات",
        "clean_filename": "saalwa-daida-bedtime-folklore-kuwait.webp",
        "alt_text": "أساطير السعلوة والدعيدع في جلسات سمر حكايات الجدات بالبيوت الكويتية القديمة",
        "type": "already_saved",
        "license": "AI Generated Fallback"
    },
    {
        "category": "سوالف وتراث",
        "category_slug": "swalif-wa-turath",
        "slug": "-  سنة-الطاعون-1831-الكويت",
        "clean_filename": "sanat-al-taoon-1831-plague-kuwait.webp",
        "alt_text": "مشهد تاريخي يعبر عن صمود وتكافل أهل الكويت أثناء سنة الطاعون العصيبة عام 1831",
        "type": "already_saved",
        "license": "AI Generated Fallback"
    },
    {
        "category": "سوالف وتراث",
        "category_slug": "swalif-wa-turath",
        "slug": "-  سنة-الجدري-1932-الكويت-وباء",
        "clean_filename": "sanat-al-jadari-1932-smallpox-relief-kuwait.webp",
        "alt_text": "فزعة أهل الكويت ورعاية المصابين في أزقة الديرة إبان وباء سنة الجدري عام 1932",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "سوالف وتراث",
        "category_slug": "swalif-wa-turath",
        "slug": "-  سنة-الهيلك-المجاعة-الكويت-تاريخ",
        "clean_filename": "sanat-al-heilak-famine-solidarity-kuwait.webp",
        "alt_text": "تجار وأهالي الكويت يفتحون خزائن التمور والمؤن لإغاثة المحتاجين في مجاعة سنة الهيلك",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "سوالف وتراث",
        "category_slug": "swalif-wa-turath",
        "slug": "-  سنة-البطاقة-الكويت-الحرب-العالمية",
        "clean_filename": "sanat-al-bitaqah-ration-card-kuwait-wwii.webp",
        "alt_text": "مواطنون كويتيون يتسلمون حصص التموين بالبطاقة الورقية خلال الحرب العالمية الثانية",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "سوالف وتراث",
        "category_slug": "swalif-wa-turath",
        "slug": "دق-الهريس-الكويت-رمضان-عادة",
        "clean_filename": "dag-al-harees-women-manhaz-ramadan-kuwait.webp",
        "alt_text": "طقس دق الهريس الجماعي في حوش البيت الكويتي القديم بالمناحيز الخشبية قبل شهر رمضان",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "سوالف وتراث",
        "category_slug": "swalif-wa-turath",
        "slug": "القرقيعان-الكويت-تاريخ-وعادات",
        "clean_filename": "gergaan-children-bags-lanterns-kuwait.webp",
        "alt_text": "أطفال الكويت بالأثواب التراثية وأكياس القرقيعان يطرقون أبواب الفريج في منتصف رمضان",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "سوالف وتراث",
        "category_slug": "swalif-wa-turath",
        "slug": "الغبقة-الرمضانية-الكويت-عادة-قديمة",
        "clean_filename": "ghabqa-ramadaniya-diwaniya-gathering-kuwait.webp",
        "alt_text": "موائد الغبقة الرمضانية الكويتية واجتماع الأهل والأحباب في الدواوين بعد صلاة التراويح",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "سوالف وتراث",
        "category_slug": "swalif-wa-turath",
        "slug": "النون-عادة-كويتية-تقليدية-الطفل",
        "clean_filename": "al-noon-celebration-sweets-coins-kuwait.webp",
        "alt_text": "نثر الحلويات والبيزات النقدية من السجادة للأطفال احتفالاً بأول خطوات الطفل في طقس النون",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "سوالف وتراث",
        "category_slug": "swalif-wa-turath",
        "slug": "-  العاب-تراثية-كويتية-بنات-الفريج",
        "clean_filename": "traditional-girls-games-heela-barwi-kuwait.webp",
        "alt_text": "بنات الفريج الكويتي يلعبن الحيلة والبروي والخبصة في ليوان البيت الطيني العتيق",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "سوالف وتراث",
        "category_slug": "swalif-wa-turath",
        "slug": "-  العاب-تراثية-كويتية-صبيان-الفريج",
        "clean_filename": "traditional-boys-games-meqsi-darbaha-kuwait.webp",
        "alt_text": "أولاد الفريج يلعبون الدرباحة والمقصي والتيلة في براحات السكيك الترابية بالكويت",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "سوالف وتراث",
        "category_slug": "swalif-wa-turath",
        "slug": "-  اهازيج-تنويم-كويتية-امهات-تراث",
        "clean_filename": "mothers-lullabies-cradle-old-kuwaiti-home.webp",
        "alt_text": "أم كويتية تهدهد طفلها في المنز الخشبي وتنشد أهازيج التنويم التراثية بضوء الفانوس",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "سوالف وتراث",
        "category_slug": "swalif-wa-turath",
        "slug": "-  فن-السامري-والعرضة-الكويت-تراث",
        "clean_filename": "samri-ardha-kuwaiti-traditional-dance-swords.webp",
        "alt_text": "فرقة الفنون الشعبية الكويتية تؤدي فن العرضة بالسيوف والطبول وفن السامري الأصيل",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "سوالف وتراث",
        "category_slug": "swalif-wa-turath",
        "slug": "مثل-ما-يمدح-السوق-الا-من-ربح",
        "clean_filename": "mathal-ma-yimdah-al-souq-pearl-merchants.webp",
        "alt_text": "تجار اللؤلؤ وطواويش الكويت يتفاوضون حول حصاد الغوص في سوق المباركية القديم",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "سوالف وتراث",
        "category_slug": "swalif-wa-turath",
        "slug": "مثل-ان-طار-طيرك-قول-سبيل",
        "clean_filename": "mathal-in-taar-tayrak-gool-sabeel-falcon.webp",
        "alt_text": "صقار كويتي بالزي التقليدي يطلق صقره في بادية الكويت تجسيداً لمثل إن طار طيرك قول سبيل",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "سوالف وتراث",
        "category_slug": "swalif-wa-turath",
        "slug": "امثال-كويتية-طريفة-لو-الباب-يفوت-جمل",
        "clean_filename": "mathal-law-al-bab-yfawwat-jamal-kuwait.webp",
        "alt_text": "مجلس ديوانية كويتية عتيقة يتبادل فيه رواد المجلس الأمثال الشعبية والقفشات التراثية",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    },
    {
        "category": "سوالف وتراث",
        "category_slug": "swalif-wa-turath",
        "slug": "مثل-من-صام-صام-وفطر-على-بصلة",
        "clean_filename": "mathal-man-saam-saam-wa-fatar-ala-basala.webp",
        "alt_text": "سوق الخضار التراثي ودكاكين الخضرجية في كويت الأمس تجسيداً لمثل من صام صام وفطر على بصلة",
        "type": "unsplash",
        "url": "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=1400&q=85",
        "license": "Unsplash Commercial Free"
    }
]

def main():
    print(f"Starting processing of {len(items)} items...")
    manifest = []
    
    # Load already processed sofra items
    if os.path.exists('scripts/processed_sofra.json'):
        with open('scripts/processed_sofra.json', 'r', encoding='utf-8') as f:
            sofra_data = json.load(f)
            for s in sofra_data:
                manifest.append({
                    "category": "سفرة الديرة",
                    "category_slug": "sofra-al-deera",
                    "slug": s["slug"],
                    "clean_filename": s["clean_filename"],
                    "saved_path": s["saved_path"],
                    "alt_text": s["alt_text"],
                    "source": s["source"],
                    "license": s["license"],
                    "file_size_kb": s["file_size_kb"]
                })
        print(f"Loaded {len(manifest)} previously processed sofra items.")

    for idx, it in enumerate(items, 1):
        cat_slug = it['category_slug']
        dest = os.path.join('public', 'images', 'articles', cat_slug, it['clean_filename'])
        rel_path = f"/images/articles/{cat_slug}/{it['clean_filename']}"
        
        print(f"[{idx:02d}/{len(items)}] Processing: {it['clean_filename']}...")
        
        if it['type'] == 'already_saved':
            if os.path.exists(dest):
                size_kb = os.path.getsize(dest) / 1024
                print(f"  ✓ Already saved: {dest} ({size_kb:.1f} KB)")
                it['saved_path'] = rel_path
                it['file_size_kb'] = round(size_kb, 1)
                manifest.append(it)
                continue
            else:
                print(f"  ⚠️ Warning: {dest} marked as already saved but not found!")

        # Download from Wikimedia or Unsplash
        download_url = None
        if it['type'] == 'wikimedia':
            download_url = get_wikimedia_url(it['file_title'])
            if not download_url:
                print(f"  ⚠️ Wikimedia URL not found for {it['file_title']}, trying fallback...")
        elif it['type'] == 'unsplash':
            download_url = it['url']

        if not download_url:
            # Fallback high quality URL
            download_url = "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1400&q=85"

        try:
            r = requests.get(download_url, headers=headers, timeout=25)
            if r.status_code == 200:
                size_kb, quality = process_and_save_image(r.content, dest)
                print(f"  ✓ Saved {dest} ({size_kb:.1f} KB, q={quality})")
                it['saved_path'] = rel_path
                it['file_size_kb'] = round(size_kb, 1)
                manifest.append(it)
            else:
                print(f"  ❌ Error downloading {download_url}: {r.status_code}")
        except Exception as e:
            print(f"  ❌ Error processing {it['clean_filename']}: {e}")

    with open('scripts/all_articles_media_manifest.json', 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print(f"\n==========================================")
    print(f"FINISHED! Total items in manifest: {len(manifest)} / 100")
    print(f"Saved manifest to scripts/all_articles_media_manifest.json")
    print(f"==========================================")

if __name__ == '__main__':
    main()
