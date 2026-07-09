"""
R-Nikash Crackers comprehensive data scraper.
Extracts products, categories, images, text content, and page data
from rnikashcrackers.com and stores everything locally.
"""
import json
import os
import re
import urllib.request
import html
import time
import csv

BASE_URL = "https://rnikashcrackers.com"
OUTPUT_DIR = r"c:\Users\ragul\.gemini\antigravity\scratch\RNIKASH\scraped_data"

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

def fetch(url, retries=3):
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            })
            with urllib.request.urlopen(req, timeout=30) as resp:
                return resp.read()
        except Exception as e:
            print(f"  Retry {attempt+1}/{retries} for {url}: {e}")
            time.sleep(2)
    return None

def extract_inertia_data(html_content):
    """Extract the Inertia.js page data from the HTML."""
    match = re.search(r'data-page="([^"]*)"', html_content)
    if match:
        raw = match.group(1)
        decoded = html.unescape(raw)
        return json.loads(decoded)
    return None

def download_image(url, save_path):
    """Download an image to a local path."""
    if os.path.exists(save_path):
        print(f"  [SKIP] {os.path.basename(save_path)} already exists")
        return True
    data = fetch(url)
    if data:
        with open(save_path, 'wb') as f:
            f.write(data)
        print(f"  [OK] {os.path.basename(save_path)}")
        return True
    print(f"  [FAIL] {os.path.basename(save_path)}")
    return False

def scrape_page(page_url):
    """Scrape an Inertia page and return its data."""
    print(f"\nFetching {page_url}...")
    raw = fetch(page_url)
    if not raw:
        return None
    content = raw.decode('utf-8', errors='replace')
    return extract_inertia_data(content), content

def main():
    ensure_dir(OUTPUT_DIR)
    ensure_dir(os.path.join(OUTPUT_DIR, "product_images"))
    ensure_dir(os.path.join(OUTPUT_DIR, "slider_images"))
    ensure_dir(os.path.join(OUTPUT_DIR, "logo"))
    ensure_dir(os.path.join(OUTPUT_DIR, "pages"))

    # ═══════════════════════════════════════
    # 1. Scrape order-now (main product catalog)
    # ═══════════════════════════════════════
    result = scrape_page(f"{BASE_URL}/order-now")
    if not result or not result[0]:
        print("ERROR: Could not extract Inertia data from order-now page")
        return
    
    page_data, raw_html = result
    props = page_data.get('props', {})
    
    # Save raw page data
    with open(os.path.join(OUTPUT_DIR, "order_now_raw.json"), 'w', encoding='utf-8') as f:
        json.dump(page_data, f, indent=2, ensure_ascii=False)
    print(f"Saved raw page data")

    # ═══════════════════════════════════════
    # 2. Extract & save products
    # ═══════════════════════════════════════
    products = props.get('products', [])
    print(f"\nFound {len(products)} products")
    
    # Extract categories from products
    categories = props.get('categories', [])
    
    # Build category map from product data
    cat_ids = set()
    for p in products:
        cat_ids.add(p.get('category_id'))
    
    # If categories aren't in props, we'll derive them
    if not categories:
        # Try fetching categories from a separate page
        cat_result = scrape_page(f"{BASE_URL}/")
        if cat_result and cat_result[0]:
            categories = cat_result[0].get('props', {}).get('categories', [])
    
    # Save categories
    with open(os.path.join(OUTPUT_DIR, "categories.json"), 'w', encoding='utf-8') as f:
        json.dump(categories, f, indent=2, ensure_ascii=False)
    print(f"Found {len(categories)} categories")

    # Process products and download images
    products_clean = []
    for p in products:
        img_filename = p.get('image', '')
        img_url = f"{BASE_URL}/storage/{img_filename}" if img_filename else ''
        
        # Sanitize filename for local storage
        safe_name = re.sub(r'[^\w\-.]', '_', p.get('name', f'product_{p["id"]}')).strip('_')
        ext = os.path.splitext(img_filename)[1] if img_filename else '.jpg'
        if not ext:
            ext = '.jpg'
        local_img = f"{p['id']}_{safe_name}{ext}"
        
        product_entry = {
            'id': p.get('id'),
            'name': p.get('name', '').strip(),
            'seo_title': p.get('seo_title', '').strip(),
            'price': p.get('price'),
            'category_id': p.get('category_id'),
            'image_url': img_url,
            'image_local': local_img,
            'original_image': img_filename,
            'sort': p.get('sort'),
        }
        products_clean.append(product_entry)
        
        # Download image
        if img_url:
            save_path = os.path.join(OUTPUT_DIR, "product_images", local_img)
            download_image(img_url, save_path)

    # Save products JSON
    with open(os.path.join(OUTPUT_DIR, "products.json"), 'w', encoding='utf-8') as f:
        json.dump(products_clean, f, indent=2, ensure_ascii=False)
    
    # Save products CSV
    with open(os.path.join(OUTPUT_DIR, "products.csv"), 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['id', 'name', 'price', 'category_id', 'image_url', 'image_local'])
        writer.writeheader()
        for p in products_clean:
            writer.writerow({k: p[k] for k in ['id', 'name', 'price', 'category_id', 'image_url', 'image_local']})

    # ═══════════════════════════════════════
    # 3. Extract & save sliders
    # ═══════════════════════════════════════
    sliders = props.get('sliders', [])
    print(f"\nFound {len(sliders)} slider images")
    for s in sliders:
        img = s.get('image', '')
        if img:
            url = f"{BASE_URL}/storage/{img}"
            save_path = os.path.join(OUTPUT_DIR, "slider_images", f"slider_{s['id']}{os.path.splitext(img)[1] or '.png'}")
            download_image(url, save_path)
    
    with open(os.path.join(OUTPUT_DIR, "sliders.json"), 'w', encoding='utf-8') as f:
        json.dump(sliders, f, indent=2, ensure_ascii=False)

    # ═══════════════════════════════════════
    # 4. Download logo assets
    # ═══════════════════════════════════════
    print("\nDownloading logo assets...")
    logo_urls = [
        (f"{BASE_URL}/assets/image/logo2.png", "logo2.png"),
        (f"{BASE_URL}/assets/image/logo.png", "logo.png"),
    ]
    for url, name in logo_urls:
        save_path = os.path.join(OUTPUT_DIR, "logo", name)
        download_image(url, save_path)

    # ═══════════════════════════════════════
    # 5. Extract marquee text
    # ═══════════════════════════════════════
    marquee = props.get('marquee', '')
    print(f"\nMarquee text: {marquee}")

    # ═══════════════════════════════════════
    # 6. Scrape other pages for text content
    # ═══════════════════════════════════════
    pages_to_scrape = [
        ('home', '/'),
        ('about', '/about-us'),
        ('contact', '/contact-us'),
        ('safety', '/safety-tips'),
        ('combo', '/combo-pack'),
    ]
    
    page_texts = {}
    for name, path in pages_to_scrape:
        result = scrape_page(f"{BASE_URL}{path}")
        if result:
            data, raw = result
            # Save raw HTML
            with open(os.path.join(OUTPUT_DIR, "pages", f"{name}.html"), 'w', encoding='utf-8') as f:
                f.write(raw)
            # Save Inertia data if available
            if data:
                with open(os.path.join(OUTPUT_DIR, "pages", f"{name}_data.json"), 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                page_texts[name] = data
        time.sleep(1)  # Be polite

    # ═══════════════════════════════════════
    # 7. Generate summary report
    # ═══════════════════════════════════════
    # Count products by category
    cat_counts = {}
    for p in products_clean:
        cid = p['category_id']
        cat_counts[cid] = cat_counts.get(cid, 0) + 1

    summary = {
        'total_products': len(products_clean),
        'total_categories': len(set(p['category_id'] for p in products_clean)),
        'category_product_counts': cat_counts,
        'total_sliders': len(sliders),
        'marquee_text': marquee,
        'pages_scraped': list(page_texts.keys()),
        'product_price_range': {
            'min': min(p['price'] for p in products_clean) if products_clean else 0,
            'max': max(p['price'] for p in products_clean) if products_clean else 0,
        }
    }
    
    with open(os.path.join(OUTPUT_DIR, "scrape_summary.json"), 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    print("\n" + "=" * 60)
    print("SCRAPING COMPLETE!")
    print("=" * 60)
    print(f"Products: {summary['total_products']}")
    print(f"Categories: {summary['total_categories']}")
    print(f"Sliders: {summary['total_sliders']}")
    print(f"Price range: ₹{summary['product_price_range']['min']} - ₹{summary['product_price_range']['max']}")
    print(f"Pages scraped: {', '.join(summary['pages_scraped'])}")
    print(f"\nAll data saved to: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
