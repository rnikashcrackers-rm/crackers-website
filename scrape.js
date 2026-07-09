const fs = require('fs');
const https = require('https');

// Helper to download HTML content
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', (err) => reject(err));
  });
}

async function scrapeProducts() {
  const targetUrl = 'https://rnikashcrackers.com/products'; // Adjust depending on target catalog structure
  console.log(`Fetching products from ${targetUrl}...`);
  
  try {
    const html = await fetchHTML(targetUrl);
    
    // Quick regex parser to pull product cards
    // Adjust selector regex patterns based on actual site inspect source
    const productRegex = /<div[^>]*class="[^"]*product-card[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
    const nameRegex = /<h3[^>]*>([\s\S]*?)<\/h3>/;
    const priceRegex = /<span[^>]*class="[^"]*price[^"]*"[^>]*>([\s\S]*?)<\/span>/;
    const imageRegex = /<img[^>]*src="([^"]*)"/;
    
    let match;
    const products = [];
    
    while ((match = productRegex.exec(html)) !== null) {
      const cardContent = match[1];
      
      const nameMatch = cardContent.match(nameRegex);
      const priceMatch = cardContent.match(priceRegex);
      const imageMatch = cardContent.match(imageRegex);
      
      if (nameMatch) {
        const name = nameMatch[1].trim();
        const price = priceMatch ? parseFloat(priceMatch[1].replace(/[^0-9.]/g, '')) : 100;
        const imageUrl = imageMatch ? imageMatch[1] : '';
        const category = 'General'; // Map dynamically if target lists categorizations
        
        products.push({ name, price, category, imageUrl });
      }
    }
    
    // Format as CSV
    let csvContent = 'name,price,category,image_url,mrp,in_stock,is_featured\n';
    products.forEach(p => {
      const mrp = Math.round(p.price * 2.5); // Example: estimate mrp at 60% discount
      csvContent += `"${p.name}",${p.price},"${p.category}","${p.imageUrl}",${mrp},true,false\n`;
    });
    
    fs.writeFileSync('rnikash_products.csv', csvContent);
    console.log(`Successfully scraped ${products.length} products to rnikash_products.csv!`);
  } catch (error) {
    console.error('Error scraping website:', error);
  }
}

scrapeProducts();
