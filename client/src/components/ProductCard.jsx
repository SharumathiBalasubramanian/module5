import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productId = product._id || product.id;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({
      productId,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      quantity: 1,
    }));
  };

  return (
    <div 
      onClick={() => navigate(`/products/${productId}`)}
      className="group relative bg-white border border-zinc-200/80 rounded-xl overflow-hidden hover:border-zinc-400 transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div className="p-4">
        {/* Image Box */}
        <div className="w-full aspect-square bg-zinc-100 rounded-lg overflow-hidden relative mb-3">
          <img
            src={product.image || product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Preview';
            }}
          />
          {product.category && (
            <span className="absolute top-2 left-2 bg-zinc-900/80 backdrop-blur-sm text-zinc-100 text-[10px] tracking-wider uppercase px-2 py-0.5 rounded font-medium">
              {product.category}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 mb-1">
          <span>★ {product.rating || product.ratings || 4.8}</span>
          <span className="text-[11px] text-emerald-700 font-medium">In Stock</span>
        </div>

        <h3 className="text-sm font-semibold text-zinc-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Footer / Action */}
      <div className="p-4 pt-0 mt-auto flex items-center justify-between gap-3">
        <div>
          <span className="text-xs text-zinc-400 block -mb-0.5">Price</span>
          <span className="text-base font-semibold font-mono text-zinc-950">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-zinc-900 hover:bg-emerald-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors"
        >
          Add +
        </button>
      </div>
    </div>
  );
};

export default ProductCard;