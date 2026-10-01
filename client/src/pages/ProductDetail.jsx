import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, fetchRecommendations } from "../redux/thunks/productThunks";
import { clearSelectedProduct } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import ProductCard from "../components/ProductCard";

import {
  FiStar,
  FiShoppingBag,
  FiArrowLeft,
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiMessageSquare,
  FiSend,
  FiUser,
} from "react-icons/fi";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedProduct: product, recommendations = [], loading } = useSelector(
    (state) => state.products
  );

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const [reviews, setReviews] = useState([
    {
      id: 1,
      reviewer: "Arun Swaminathan",
      rating: 5,
      comment: "Exceptional quality. Packaging was immaculate and shipping was swift.",
      date: "04/09/2026",
    },
    {
      id: 2,
      reviewer: "Pooja V.",
      rating: 4,
      comment: "Solid finish and looks sleek on the desk. Exactly as described.",
      date: "01/09/2026",
    },
  ]);

  const [reviewerName, setReviewerName] = useState("");
  const [reviewRating, setReviewerRating] = useState(5);
  const [reviewComment, setReviewerComment] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchRecommendations(id));
    }
    return () => dispatch(clearSelectedProduct());
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addToCart({
        productId: product._id || product.id,
        name: product.name,
        price: product.price,
        image: product.image || product.images?.[0] || "",
        stock: product.stock,
        quantity: qty,
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newReview = {
      id: Date.now(),
      reviewer: reviewerName.trim() || "Verified Client",
      rating: Number(reviewRating),
      comment: reviewComment.trim(),
      date: new Date().toLocaleDateString("en-IN"),
    };

    setReviews([newReview, ...reviews]);
    setReviewerName("");
    setReviewerComment("");
    setReviewerRating(5);
  };

  if (loading || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        <span className="text-xs uppercase tracking-widest font-semibold">Retrieving Details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors"
      >
        <FiArrowLeft size={16} /> Back
      </button>

      {/* Main Spec Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden">
          {product.image || product.images?.[0] ? (
            <img
              src={product.image || product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain p-6 hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/500x500?text=No+Preview";
              }}
            />
          ) : (
            <span className="text-6xl font-mono text-slate-300 uppercase">
              {product.name?.charAt(0)}
            </span>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-md border border-teal-200">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 font-bold text-slate-800">
                <FiStar className="fill-amber-400 text-amber-400" />
                {product.ratings ? product.ratings.toFixed(1) : "4.8"}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">
                {product.numReviews || reviews.length} verified ratings
              </span>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed pt-2">
              {product.description}
            </p>

            <div className="pt-4 border-t border-slate-100">
              <p className="font-mono text-3xl font-extrabold text-slate-900">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </p>
              <p className={`text-xs mt-1 font-semibold ${product.stock > 0 ? "text-teal-600" : "text-rose-500"}`}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : "Sold Out"}
              </p>
            </div>
          </div>

          <div className="space-y-6 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-200/60 rounded-l-xl font-bold"
                >
                  −
                </button>
                <span className="w-8 text-center text-xs font-mono font-bold text-slate-800">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock || 99, qty + 1))}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-200/60 rounded-r-xl font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-slate-900 hover:bg-teal-600 text-white rounded-xl py-3 px-6 flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-wider font-bold shadow-sm disabled:opacity-40"
              >
                <FiShoppingBag size={16} /> {added ? "Added to Cart" : "Add to Cart"}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 text-center text-[11px] text-slate-500 border-t border-slate-100">
              <div className="flex flex-col items-center gap-1">
                <FiTruck size={16} className="text-teal-600" />
                <span>Express Courier</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <FiRefreshCw size={16} className="text-teal-600" />
                <span>7-Day Return</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <FiShield size={16} className="text-teal-600" />
                <span>Quality Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
          <FiMessageSquare className="text-teal-600" /> Community Reviews
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleReviewSubmit} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3 h-fit">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Submit Review
            </h3>
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Your Name"
              className="w-full p-2.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-slate-400"
            />
            <select
              value={reviewRating}
              onChange={(e) => setReviewerRating(Number(e.target.value))}
              className="w-full p-2.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-slate-400 font-semibold"
            >
              <option value="5">★★★★★ (5 Stars)</option>
              <option value="4">★★★★☆ (4 Stars)</option>
              <option value="3">★★★☆☆ (3 Stars)</option>
              <option value="2">★★☆☆☆ (2 Stars)</option>
              <option value="1">★☆☆☆☆ (1 Star)</option>
            </select>
            <textarea
              rows="3"
              required
              value={reviewComment}
              onChange={(e) => setReviewerComment(e.target.value)}
              placeholder="Write your feedback..."
              className="w-full p-2.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-slate-400 resize-none"
            />
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-teal-600 transition flex items-center justify-center gap-2"
            >
              <FiSend size={12} /> Post Comment
            </button>
          </form>

          <div className="lg:col-span-2 space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {reviews.map((rev) => (
              <div key={rev.id} className="border border-slate-200/80 bg-slate-50/50 p-4 rounded-xl flex gap-3 items-start">
                <div className="p-2 bg-slate-200 text-slate-700 rounded-full shrink-0">
                  <FiUser size={13} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{rev.reviewer}</h4>
                    <span className="text-[11px] font-mono text-slate-400">{rev.date}</span>
                  </div>
                  <div className="flex items-center text-amber-500 text-xs my-1">
                    {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested Items */}
      {recommendations && recommendations.length > 0 && (
        <section className="pt-4">
          <h2 className="text-base font-extrabold uppercase tracking-wider text-slate-900 mb-6">
            Recommended Alongside This
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {recommendations.map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;