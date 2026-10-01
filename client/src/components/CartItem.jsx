import { useDispatch } from "react-redux";
import { updateQuantity, removeFromCart } from "../redux/slices/cartSlice";
import { FiTrash2 } from "react-icons/fi";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleDecrease = () => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }));
    } else {
      dispatch(removeFromCart(item.productId));
    }
  };

  return (
    <div className="flex items-center gap-4 bg-zinc-50/70 border border-zinc-200/70 p-3.5 rounded-xl mb-3">
      {/* Product Thumbnail */}
      <div className="w-16 h-16 bg-white border border-zinc-200 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
        ) : (
          <span className="text-lg font-bold text-zinc-300 uppercase">{item.name.charAt(0)}</span>
        )}
      </div>

      {/* Info & Quantity */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-zinc-900 truncate">{item.name}</h4>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">₹{item.price} / unit</p>

        <div className="flex items-center gap-2 mt-2">
          <div className="inline-flex items-center border border-zinc-300 rounded-md bg-white">
            <button
              onClick={handleDecrease}
              className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 rounded-l-md text-sm transition-colors"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center text-xs font-semibold text-zinc-800">{item.quantity}</span>
            <button
              onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
              className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 rounded-r-md text-sm transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Price & Delete */}
      <div className="text-right flex flex-col items-end justify-between self-stretch">
        <p className="font-mono font-bold text-sm text-zinc-900">
          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
        </p>
        <button
          onClick={() => dispatch(removeFromCart(item.productId))}
          className="text-zinc-400 hover:text-rose-500 transition-colors p-1"
          title="Remove item"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;