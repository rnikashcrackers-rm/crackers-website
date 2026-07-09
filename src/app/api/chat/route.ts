import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { products as staticProducts } from '@/lib/data/products';

export const dynamic = 'force-dynamic';

// Helper to clean and format simplified product catalog for Gemini system instructions
const simplifiedCatalog = staticProducts.map(p => ({
  id: p.id,
  name: p.name_en,
  category: p.category,
  price: p.price,
  mrp: p.mrp,
  discount: p.discount_percent,
  in_stock: p.in_stock
}));

// Fallback search and response generator when Gemini key is missing
async function handleLocalFallback(userMessage: string): Promise<string> {
  const query = userMessage.toLowerCase();
  
  // 1. Order Tracking Check
  const orderMatch = userMessage.match(/NC-\d{8}-\d{4}/i);
  if (orderMatch || query.includes('track') || query.includes('order status') || query.includes('where is my order')) {
    const orderNumber = orderMatch ? orderMatch[0].toUpperCase() : 'your order';
    
    // Check in database if Supabase is configured
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      
      if (supabaseUrl && !supabaseUrl.includes('your_supabase') && orderMatch) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('order_number', orderNumber)
          .single();
          
        if (data && !error) {
          const itemsList = data.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ');
          return `I found order **${orderNumber}** in our database! Here are the details:\n\n` +
                 `👤 **Customer:** ${data.customer_name}\n` +
                 `📦 **Items:** ${itemsList}\n` +
                 `💰 **Total Amount:** ₹${data.total_amount.toLocaleString('en-IN')}\n` +
                 `🟢 **Status:** **${data.status.toUpperCase()}**\n` +
                 `💳 **Payment Status:** **${data.payment_status.toUpperCase()}**\n` +
                 `📅 **Order Date:** ${new Date(data.created_at).toLocaleDateString('en-IN')}\n\n` +
                 `Our concierge team will update you as soon as the transport agency confirms dispatch from Sivakasi.`;
        }
      }
    } catch (e) {
      console.error('Error in fallback order query:', e);
    }
    
    // Default mock response if database not configured/not found
    const targetOrderNum = orderMatch ? orderMatch[0].toUpperCase() : 'NC-20260524-4321';
    return `I searched our database for **${targetOrderNum}**.\n\n` +
           `Currently, the status is **PENDING VERIFICATION**.\n\n` +
           `Since we operate directly from the Sivakasi factory, our support concierge verifies shipping routes and logs details before confirmation. Our team will ring you on your phone number shortly to verify. You can also chat directly on WhatsApp to speed things up!`;
  }

  // 2. Budget / Combo package recommendations
  const budgetMatch = query.match(/(?:budget|spend|combo|package|₹|rs\.?)\s*(\d{4,5})/);
  if (budgetMatch || query.includes('budget') || query.includes('suggest') || query.includes('recommend')) {
    const budgetStr = budgetMatch ? budgetMatch[1] : '';
    const budget = budgetStr ? parseInt(budgetStr) : 5000; // Default budget ₹5000
    
    // Select popular, featured items from different categories to build a diverse pack
    const featured = staticProducts.filter(p => p.in_stock && (p.is_featured || p.price > 50));
    const selected: typeof staticProducts = [];
    let currentTotal = 0;
    
    // Shuffle featured list to get varied packages
    const shuffled = [...featured].sort(() => 0.5 - Math.random());
    
    // Attempt to select items covering diverse categories
    const categoriesSeen = new Set<string>();
    for (const item of shuffled) {
      if (currentTotal + item.price <= budget * 1.05) {
        // Limit duplication of categories unless budget is large
        if (!categoriesSeen.has(item.category) || budget > 6000) {
          selected.push(item);
          currentTotal += item.price;
          categoriesSeen.add(item.category);
        }
      }
      if (currentTotal >= budget * 0.9) break;
    }
    
    // If still far below, add any in-stock products
    if (currentTotal < budget * 0.8) {
      const inStockAll = staticProducts.filter(p => p.in_stock && !selected.some(s => s.id === p.id));
      for (const item of inStockAll) {
        if (currentTotal + item.price <= budget * 1.02) {
          selected.push(item);
          currentTotal += item.price;
        }
        if (currentTotal >= budget * 0.95) break;
      }
    }
    
    const recIds = selected.map(item => ({ id: item.id, quantity: 1 }));
    const itemsText = selected.map(item => `- **${item.name_en}** (${item.category.toUpperCase()}) — **₹${item.price}** (MRP: <span class="line-through">₹${item.mrp}</span>)`).join('\n');
    
    return `Absolutely! Here is a custom festival package compiled for a budget of **₹${budget.toLocaleString('en-IN')}** (Total cost: **₹${currentTotal}** with direct Sivakasi wholesale discounts applied):\n\n` +
           `${itemsText}\n\n` +
           `Click the button below to add all these recommended crackers directly to your cart at once!\n` +
           `<recommendations>${JSON.stringify(recIds)}</recommendations>`;
  }

  // 3. Product Search / Category search
  let matchedProducts = [...staticProducts];
  let searchMode = false;
  
  // Category mapping helper
  const categoryKeywords: Record<string, string> = {
    sparkler: 'sparklers',
    pot: 'flowerpots',
    flowerpot: 'flowerpots',
    rocket: 'rockets',
    chakkar: 'chakkars',
    wheel: 'chakkars',
    bomb: 'bombs',
    bijili: 'bijili',
    chain: 'chain',
    fountain: 'fountains',
    novelty: 'novelties',
    pencil: 'novelties',
    shot: 'multishots',
    aerial: 'multishots',
    giftbox: 'giftbox',
    box: 'giftbox'
  };

  let matchedCategory = '';
  for (const [key, cat] of Object.entries(categoryKeywords)) {
    if (query.includes(key)) {
      matchedCategory = cat;
      break;
    }
  }

  if (matchedCategory) {
    matchedProducts = staticProducts.filter(p => p.category === matchedCategory);
    searchMode = true;
  } else {
    // Exact name matching
    const keywords = query.split(/\s+/).filter(w => w.length > 2);
    if (keywords.length > 0) {
      matchedProducts = staticProducts.filter(p => 
        keywords.some(kw => p.name_en.toLowerCase().includes(kw))
      );
      if (matchedProducts.length > 0 && matchedProducts.length < staticProducts.length) {
        searchMode = true;
      }
    }
  }

  if (searchMode && matchedProducts.length > 0) {
    const listLimit = matchedProducts.slice(0, 5);
    const recIds = listLimit.map(item => ({ id: item.id, quantity: 1 }));
    const itemsText = listLimit.map(item => `- **${item.name_en}** — **₹${item.price}** (MRP: <span class="line-through">₹${item.mrp}</span>)`).join('\n');
    
    return `Yes! I found the following items matching your search:\n\n` +
           `${itemsText}\n\n` +
           `Would you like to add any of these to your cart?\n` +
           `<recommendations>${JSON.stringify(recIds)}</recommendations>`;
  }

  // 4. Safety FAQ
  if (query.includes('safe') || query.includes('child') || query.includes('kid') || query.includes('burn') || query.includes('accident') || query.includes('light')) {
    return `Safety is our highest priority! Here are the core guidelines for a safe celebration:\n\n` +
           `👦 **Supervision:** Never allow children under 12 to handle fireworks alone. Keep a responsible adult nearby.\n` +
           `🔥 **Lighting:** Always use incense sticks (Agarbatti) to light crackers. Never use matchsticks or lighters directly, and never lean over a cracker while lighting it.\n` +
           `🪣 **Water Ready:** Keep buckets of water and sand nearby to douse used crackers. Never attempt to relight a "dud" (unexploded) cracker; douse it with water instead.\n` +
           `👓 **Protection:** Wear snug cotton clothes and protective footwear. Avoid loose clothing.\n` +
           `📦 **Storage:** Store fireworks in a cool, dry place inside their original closed boxes, away from heat sources.`;
  }

  // 5. Shipping & Delivery FAQ
  if (query.includes('ship') || query.includes('deliver') || query.includes('transport') || query.includes('state') || query.includes('charge') || query.includes('karnataka') || query.includes('tamil') || query.includes('chennai')) {
    return `Here are our shipping details:\n\n` +
           `📍 **Origin:** All orders are packed and dispatched directly from our factory in Sivakasi, Tamil Nadu.\n` +
           `🚚 **Coverage:** We deliver to major locations across India (Tamil Nadu, Karnataka, Kerala, Andhra Pradesh, Telangana, Maharashtra, Goa, Pondicherry, etc.).\n` +
           `💰 **Minimum Order:** Due to transport company regulations for shipping commercial explosives safely, our minimum order limit for transport delivery is **₹3,000**.\n` +
           `⏱️ **Delivery Time:** Orders usually take 3 to 7 working days to reach major cities from the date of dispatch.\n` +
           `📦 **Charges:** Shipping charges are based on the parcel volume and weight, payable directly to the lorry transport service agent upon collection.`;
  }

  // 6. Generic Q&A / Sivakasi info
  if (query.includes('about') || query.includes('heritage') || query.includes('years') || query.includes('history') || query.includes('sivakasi')) {
    return `NIKASH CRACKERS (NIKASH CRACKERS) is one of Sivakasi's premier fireworks brands, carrying a legacy since **2015**.\n\n` +
           `- **Over a Decade of Excellence:** Crafting high-quality fireworks with premium safety standards.\n` +
           `- **Safety & Certification:** Fully safety certified and government licensed.\n` +
           `- **Green Crackers:** Over 40% of our catalog consists of patented eco-friendly formulas that reduce emissions by 40% while preserving the classic crackle and bright color display.\n` +
           `- **Direct Factory Pricing:** By cutting out middle distributors, we pass on direct Sivakasi factory discounts (flat 60% off) directly to families.`;
  }

  // Default Hello
  if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('greetings')) {
    return `Hello! Welcome to the **NIKASH CRACKERS AI Assistant**! 🎆\n\n` +
           `I am your virtual guide directly from Sivakasi. Here's what I can do for you:\n` +
           `1. **Custom Combo Recommendations**: Tell me your budget (e.g. "Suggest a package for ₹4,000") and I'll curate a list.\n` +
           `2. **Product Search**: Ask if we have specific crackers or categories (e.g. "Show me flower pots").\n` +
           `3. **Order Status Tracking**: Supply your order number (e.g. "Track order NC-20260524-1234").\n` +
           `4. **General Q&A**: Learn about delivery areas, shipping costs, safety rules, and green crackers.\n\n` +
           `How can I assist you in lighting up your celebrations today?`;
  }

  // Fallback default
  return `I'd be happy to help you with that! Here are a few things you can ask me:\n\n` +
         `- "Suggest a celebration combo for ₹3,000"\n` +
         `- "Show me aerial multi-shots and rockets"\n` +
         `- "What are the rules for safe firework handling?"\n` +
         `- "Where do you ship to, and what is the minimum order?"\n` +
         `- "Track order NC-20260524-1234"\n\n` +
         `What would you like to explore?`;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage.content;

    const apiKey = process.env.GEMINI_API_KEY;

    // Use local rule-based fallback if Gemini API Key is not set or set to placeholder
    if (!apiKey || apiKey.includes('your_gemini') || apiKey.trim() === '') {
      const responseText = await handleLocalFallback(userPrompt);
      return NextResponse.json({
        content: responseText,
        isFallback: true
      });
    }

    // Call real Gemini API
    const systemPrompt = `You are the NIKASH CRACKERS AI Concierge, a premium virtual pyrotechnics shopping advisor for NIKASH CRACKERS (also known as NIKASH CRACKERS), Sivakasi's premium fireworks brand.
Your tone is professional, luxury-themed, enthusiastic, helpful, and polite.

Facts about NIKASH CRACKERS:
- Brand Name: NIKASH CRACKERS (NIKASH CRACKERS)
- Origin: Sivakasi, Tamil Nadu, India (India's fireworks capital)
- History: Established in 2015. Celebrating over a decade of trust.
- Safety: Fully safety certified and government licensed.
- Green Crackers: We sell eco-friendly green crackers, reducing emissions by 40%.
- Price/Discounts: Direct Sivakasi factory prices, representing a flat 60% wholesale discount which is already applied in our shop.
- Shipping & Logistics: We ship from Sivakasi to major states like Tamil Nadu, Karnataka, Andhra Pradesh, Telangana, Kerala, Maharashtra, Goa, Pondicherry, etc.
- Minimum Order: The minimum order value for lorry transport dispatch is ₹3,000.
- Shipping Cost: Shipping charges depend on parcel volume/weight and are paid directly to the transport agency by the customer upon collecting the goods.
- Ordering Process: Add products to cart -> proceed to enquiry checkout page -> input customer name, email, phone, city, address, pincode -> place order -> downloads receipt PDF -> support team contacts via phone/WhatsApp to arrange payment (UPI, Bank Transfer, or Cash on Delivery) -> items dispatched.
- Support Number: +91 7867955841

Core Capabilities:
1. Catalog Queries: Answer if we carry certain items. Recommend items.
2. Custom Packages: If the user mentions a budget (e.g., "suggest a bundle for ₹4,000") or occasion ("wedding show"), calculate a list of matching items from the catalog. Show each item name, category, and price. Sum them up to fit within the budget.
3. Order Status: Tell them to input their order number (e.g. "NC-20260524-4321"). If they provide a valid order number, kindly tell them that the order is "Pending Verification", direct factory shipments require route logistics verification, and our team will contact them shortly or they can click WhatsApp.
4. Add to Cart: You can recommend specific products. Whenever you recommend products, you MUST append a JSON array containing the exact IDs and quantity of those products at the very end of your response inside a '<recommendations>' XML tag.
Example output format:
"I highly recommend the following flowerpots and sparklers:
- **Flower Pot Big (₹73)**
- **WIN WHEEL MAX (₹220)**
Total: ₹293.

<recommendations>[{"id":"16","quantity":1},{"id":"15","quantity":1}]</recommendations>"

Make sure to ONLY use real product IDs and names from the simplified catalog below.
Here is the available simplified product catalog of NIKASH CRACKERS:
${JSON.stringify(simplifiedCatalog)}`;

    // Build standard contents array for Gemini REST endpoint
    // Mapping Next.js message structures to Gemini REST structure
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    // Perform HTTP Request to Gemini REST Endpoint
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 1500
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API returned status ${response.status}: ${errText}`);
    }

    const resJson = await response.json();
    const botText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, I am having trouble compiling a response right now. Please try again or chat with our team on WhatsApp!";

    return NextResponse.json({
      content: botText,
      isFallback: false
    });
  } catch (error: any) {
    console.error('Error in chat API route:', error);
    // Graceful fallback to local engine on error
    try {
      const body = await req.clone().json();
      const lastMsg = body.messages[body.messages.length - 1].content;
      const responseText = await handleLocalFallback(lastMsg);
      return NextResponse.json({
        content: responseText + "\n\n*(Note: Operating in fallback mode)*",
        isFallback: true
      });
    } catch {
      return NextResponse.json({ error: 'Failed to process chat response' }, { status: 500 });
    }
  }
}
