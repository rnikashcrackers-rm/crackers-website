'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Sparkles, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/lib/supabase/types';

interface ProductCatalogClientProps {
  initialProducts: Product[];
  initialCategories: Array<{ id: string; label: string; emoji: string }>;
}

const sortOptions = [
  { id: 'default', label: 'Default' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'name', label: 'Name: A to Z' },
  { id: 'discount', label: 'Best Discount' },
];

export function ProductCatalogClient({ initialProducts, initialCategories }: ProductCatalogClientProps) {
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showSort, setShowSort] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [mounted, setMounted] = useState(false);
  const [totalProducts, setTotalProducts] = useState(initialProducts.length);
  const [searchDebounce, setSearchDebounce] = useState('');
  const [highlightedCategory, setHighlightedCategory] = useState('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Background refresh to keep catalog updated without jarring jumps
  useEffect(() => {
    if (!mounted) return;

    const fetchLatest = async () => {
      try {
        const res = await fetch('/api/products?limit=500');
        if (!res.ok) throw new Error('Failed to fetch latest products');
        const data = await res.json();

        let fetchedList: Product[] = [];
        if (Array.isArray(data)) {
          fetchedList = data;
        } else {
          fetchedList = data.products || [];
        }

        if (fetchedList.length > 0) {
          try {
            sessionStorage.setItem('nc_products_catalog_cache', JSON.stringify({
              data: fetchedList,
              timestamp: Date.now()
            }));
          } catch (e) {
            console.error('Error writing to cache:', e);
          }

          // Only update if product count or items changed to prevent count jumping
          setAllProducts((prev) => {
            if (prev.length === 0 || prev.length !== fetchedList.length) {
              setTotalProducts(fetchedList.length);
              return fetchedList;
            }
            return prev;
          });
        }
      } catch (err) {
        console.error('Failed to update products in background:', err);
      }
    };

    const timer = setTimeout(() => {
      fetchLatest();
    }, 3000);

    return () => clearTimeout(timer);
  }, [mounted]);

  // Keep highlightedCategory in sync when activeCategory changes manually
  useEffect(() => {
    setHighlightedCategory(activeCategory);
  }, [activeCategory]);

  // Scroll-spy: Detect and highlight category section in viewport
  useEffect(() => {
    if (activeCategory !== 'all' || !mounted) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting);
      if (visible.length > 0) {
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const topSection = visible[0];
        const catId = topSection.target.id.replace('category-sec-', '');
        setHighlightedCategory(catId);
      }
    }, {
      root: null,
      rootMargin: '-10% 0px -70% 0px',
      threshold: 0
    });

    initialCategories.forEach(cat => {
      if (cat.id === 'all') return;
      const el = document.getElementById(`category-sec-${cat.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeCategory, initialCategories, mounted]);

  // Auto-scroll the active category button into view inside the sticky container
  useEffect(() => {
    const btn = document.getElementById(`cat-btn-${highlightedCategory}`);
    if (btn) {
      btn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
    const mobileBtn = document.getElementById(`cat-btn-mobile-${highlightedCategory}`);
    if (mobileBtn) {
      mobileBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [highlightedCategory]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Compute filtered and sorted products instantaneously on the client side
  const products = useMemo(() => {
    let filtered = [...allProducts];

    // Category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Search filter
    if (searchDebounce) {
      const q = searchDebounce.toLowerCase();
      filtered = filtered.filter(p => 
        (p.name_en || '').toLowerCase().includes(q) ||
        (p.name_ta || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name':
        filtered.sort((a, b) => (a.name_en || '').localeCompare(b.name_en || ''));
        break;
      case 'discount':
        filtered.sort((a, b) => (b.discount_percent || 0) - (a.discount_percent || 0));
        break;
    }

    return filtered;
  }, [allProducts, activeCategory, searchDebounce, sortBy]);

  // Category counts from current products (only when showing all)
  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return totalProducts;
    if (activeCategory !== 'all') return null; // Don't show counts when filtered
    return products.filter(p => p.category === catId).length || null;
  };

  return (
    <div className="max-w-[1600px] w-full mx-auto px-2 sm:px-8 md:px-12 py-6 md:py-12">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold text-[var(--color-coral)] uppercase tracking-[0.2em] mb-3">
              <Sparkles size={12} /> Premium Collection
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">Our Products</h1>
            <p className="text-[var(--text-muted)] max-w-2xl">
              Browse our premium collection of Sivakasi crackers. Quality and safety guaranteed.
            </p>
            {/* Search Bar */}
            <div className="mt-4 relative max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, Tamil name, or category..."
                className="w-full bg-[var(--surface-high)] border border-[var(--border)] rounded-xl px-4 py-3 pl-10 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--color-coral)] focus:outline-none transition-all"
                id="product-search-input"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] hover:text-[var(--color-coral)] font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* View Toggle & Sort */}
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1 gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${viewMode === 'grid' ? 'bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] text-[#1a1400] font-bold shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
                aria-label="Grid View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${viewMode === 'list' ? 'bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] text-[#1a1400] font-bold shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
                aria-label="List View"
              >
                <List size={15} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text-muted)] hover:border-[var(--color-coral)] transition-colors cursor-pointer"
              >
                Sort <ChevronDown size={14} />
              </button>
              <AnimatePresence>
                {showSort && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-2xl z-20 overflow-hidden"
                  >
                    {sortOptions.map((opt) => (
                      <button key={opt.id} onClick={() => { setSortBy(opt.id); setShowSort(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${sortBy === opt.id ? 'bg-[var(--color-coral)]/10 text-[var(--color-coral)] font-bold' : 'text-[var(--text-muted)] hover:bg-[var(--surface-high)]'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Sticky Top Category Pill Navigation Bar (< md) */}
      <div className="md:hidden sticky top-16 z-30 bg-[#0B132B]/95 backdrop-blur-md py-2 border-y border-[var(--border)] shadow-md mb-4 -mx-2 px-2">
        <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none w-full pl-1 pr-3">
          {initialCategories.map((cat) => {
            const count = getCategoryCount(cat.id);
            const isActive = highlightedCategory === cat.id;
            return (
              <button
                key={`mobile-${cat.id}`}
                id={`cat-btn-mobile-${cat.id}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  const mobileEl = document.getElementById(`cat-btn-mobile-${cat.id}`);
                  if (mobileEl) mobileEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }}
                className={`shrink-0 flex-none flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border min-h-[44px] ${
                  isActive
                    ? 'bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] text-[#1a1400] border-[var(--color-coral)] shadow-md'
                    : 'bg-[var(--surface-high)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
                }`}
              >
                <span className="text-base shrink-0">{cat.emoji}</span>
                <span className="whitespace-nowrap font-bold text-xs">
                  {cat.label.replace(' Products', '')}
                </span>
                {count !== null && count > 0 && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${
                    isActive ? 'bg-[#1a1400]/20 text-[#1a1400]' : 'bg-[var(--surface)] text-[var(--text-muted)]'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        {/* Desktop Left Side Vertical Category Sidebar (Visible on desktop ≥ md) */}
        <aside className="hidden md:block w-52 lg:w-64 flex-shrink-0">
          <div className="glass-card rounded-2xl p-4 sticky top-28 max-h-[78vh] overflow-y-auto scrollbar-none">
            <div className="flex items-center gap-2 font-bold text-sm mb-3 border-b border-[var(--border)] pb-2.5 text-[var(--text)]">
              <SlidersHorizontal size={15} className="shrink-0 text-[var(--color-coral)]" /> Categories
            </div>
            <div className="flex flex-col gap-1.5">
              {initialCategories.map((cat) => {
                const count = getCategoryCount(cat.id);
                const isActive = highlightedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    id={`cat-btn-${cat.id}`}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full px-3 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between cursor-pointer min-h-[44px] gap-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] text-[#1a1400] font-bold shadow-md'
                        : 'text-[var(--text-muted)] hover:bg-[var(--surface-high)] hover:text-[var(--text)]'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-base shrink-0">{cat.emoji}</span>
                      <span className="whitespace-normal line-clamp-2 text-xs lg:text-sm leading-snug text-left break-words font-semibold">
                        {cat.label.replace(' Products', '')}
                      </span>
                    </span>
                    {count !== null && count > 0 && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                        isActive ? 'bg-[#1a1400]/20 text-[#1a1400]' : 'bg-[var(--surface-high)] text-[var(--text-muted)]'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Product Grid Container */}
        <div className="flex-1">
          {/* Results count */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between mb-6">
            <span className="text-sm text-[var(--text-muted)]">
              Showing <span className="font-bold text-[var(--text)]">{products.length}</span> of <span className="font-bold text-[var(--text)]">{totalProducts}</span> products
            </span>
          </motion.div>

          {products.length > 0 ? (
            activeCategory === 'all' ? (
              // E-commerce Grouped Category Sections
              <div className="space-y-16">
                {initialCategories.filter(cat => cat.id !== 'all').map((cat) => {
                  const catProducts = products.filter(p => p.category === cat.id);
                  if (catProducts.length === 0) return null;
                  return (
                    <section 
                      key={cat.id} 
                      id={`category-sec-${cat.id}`} 
                      className="scroll-mt-28"
                      style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 500px' }}
                    >
                      {/* Category Header */}
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-bold font-display flex items-center gap-2.5 text-[var(--text)]">
                          <span className="text-2xl">{cat.emoji}</span>
                          <span className="text-gradient-coral text-glow">{cat.label}</span>
                          <span className="text-[10px] font-black bg-[var(--surface-high)] text-[var(--text-muted)] px-2.5 py-0.5 rounded-full border border-[var(--border)] ml-1">
                            {catProducts.length} Products
                          </span>
                        </h2>
                      </div>

                      {/* Category Divider */}
                      <div className="h-px bg-gradient-to-r from-[var(--color-coral)]/40 via-[var(--border)]/30 to-transparent mb-6" />

                      {/* Responsive Grid / List */}
                      <div className={viewMode === 'grid' 
                        ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5" 
                        : "flex flex-col gap-3 md:gap-4"}>
                        {catProducts.map((product) => (
                          <ProductCard key={product.id} product={product} viewMode={viewMode} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              // Single Category View
              <section>
                {/* Category Header */}
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold font-display flex items-center gap-2.5 text-[var(--text)]">
                    <span className="text-2xl">{initialCategories.find(c => c.id === activeCategory)?.emoji || '🎆'}</span>
                    <span className="text-gradient-coral text-glow">{initialCategories.find(c => c.id === activeCategory)?.label || activeCategory}</span>
                    <span className="text-[10px] font-black bg-[var(--surface-high)] text-[var(--text-muted)] px-2.5 py-0.5 rounded-full border border-[var(--border)] ml-1">
                      {products.length} Products
                    </span>
                  </h2>
                </div>

                {/* Category Divider */}
                <div className="h-px bg-gradient-to-r from-[var(--color-coral)]/40 via-[var(--border)]/30 to-transparent mb-6" />

                {/* Responsive Grid / List */}
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5" 
                  : "flex flex-col gap-3 md:gap-4"}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} viewMode={viewMode} />
                  ))}
                </div>
              </section>
            )
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-16 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold font-display mb-2">No products found</h3>
              <p className="text-[var(--text-muted)] text-sm mb-4">Try adjusting your search or filter criteria</p>
              <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="px-4 py-2 rounded-lg bg-[var(--color-coral)] text-[#1a1400] font-bold text-sm cursor-pointer">
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
