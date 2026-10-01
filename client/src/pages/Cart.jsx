import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";

const Cart = () => {
  const { items = [] } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-8">
        <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900">
          Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
        </h1>
        <Link to="/" className="text-xs uppercase tracking-wider text-teal-600 font-bold hover:underline">
          Continue Exploring
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-200 rounded-3xl">
          <p className="text-slate-400 text-sm mb-4">Your shopping bag is currently empty.</p>
          <Link
            to="/"
            className="inline-block bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-teal-600 transition"
          >
            Start Browsing
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            {items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 h-fit sticky top-24 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-4 pb-3 border-b border-slate-100">
              Summary
            </h3>
            <div className="flex justify-between text-xs text-slate-600 mb-2">
              <span>Subtotal</span>
              <span className="font-mono text-slate-900 font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600 mb-4">
              <span>Delivery</span>
              <span className="text-teal-600 font-extrabold uppercase text-[10px]">Free</span>
            </div>
            <div className="flex justify-between font-mono font-black text-lg border-t border-slate-200 pt-4 mb-6 text-slate-900">
              <span>Grand Total</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-slate-900 text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider hover:bg-teal-600 transition-colors shadow-sm"
            >
              Checkout Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;