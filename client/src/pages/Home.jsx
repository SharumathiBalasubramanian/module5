import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../redux/thunks/productThunks";
import { setFilters } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { items = [], loading, categories = [], filters, pages = 1, page = 1 } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const keyword = searchParams.get("keyword") || "";
    dispatch(setFilters({ keyword }));
  }, [searchParams, dispatch]);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  const applyFilter = (patch) => {
    dispatch(setFilters(patch));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Editorial Store Header */}
      <section className="mb-10 pb-8 border-b border-slate-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 mb-4">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
          <span className="text-[11px] font-bold tracking-widest text-teal-700 uppercase">
            Curated Collections
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight max-w-2xl leading-tight">
          Precision essentials designed for everyday living.
        </h1>
      </section>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-sm mb-8 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={filters.category}
            onChange={(e) => applyFilter({ category: e.target.value })}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg px-3 py-2 outline-none focus:border-teal-400"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
            <input
              type="number"
              placeholder="Min ₹"
              value={filters.minPrice}
              onChange={(e) => applyFilter({ minPrice: e.target.value })}
              className="bg-transparent text-xs text-white placeholder-slate-400 w-20 outline-none"
            />
            <span className="text-slate-500 text-xs">—</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={filters.maxPrice}
              onChange={(e) => applyFilter({ maxPrice: e.target.value })}
              className="bg-transparent text-xs text-white placeholder-slate-400 w-20 outline-none"
            />
          </div>
        </div>

        <select
          value={filters.sort}
          onChange={(e) => applyFilter({ sort: e.target.value })}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg px-3 py-2 outline-none focus:border-teal-400"
        >
          <option value="newest">Latest Release</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>

        {filters.keyword && (
          <div className="w-full text-xs text-slate-400 pt-2 border-t border-slate-800">
            Filtered by keyword: <span className="text-teal-400 font-semibold">"{filters.keyword}"</span>
          </div>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-24 text-slate-400 text-sm font-medium">
          Loading catalog...
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-200 rounded-2xl">
          <p className="text-slate-500 text-sm font-medium">No products match your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((p) => (
            <ProductCard key={p._id || p.id} product={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => dispatch(fetchProducts({ ...filters, page: p }))}
              className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                p === page
                  ? "bg-teal-500 text-slate-950 shadow-md"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;