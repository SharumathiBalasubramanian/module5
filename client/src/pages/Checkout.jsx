import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { placeOrder } from "../redux/thunks/orderThunks";
import { clearCart } from "../redux/slices/cartSlice";

const isValidObjectId = (id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
const getItemId = (item) => item.productId || item._id || item.id;

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items = [] } = useSelector((state) => state.cart);
  const { loading, error } = useSelector((state) => state.orders || {});

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    const formattedItems = items.map((item) => {
      const rawId = getItemId(item);
      return {
        product: isValidObjectId(rawId) ? rawId : "507f1f77bcf86cd799439011",
        name: item.name,
        image: item.image || item.imageUrl || "",
        price: item.price,
        quantity: item.quantity,
      };
    });

    const orderPayload = {
      items: formattedItems,
      shippingAddress: address,
      paymentMethod: "COD",
    };

    const result = await dispatch(placeOrder(orderPayload));
    if (placeOrder.fulfilled.match(result)) {
      dispatch(clearCart());
      navigate("/orders");
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-3">Your bag is empty</h2>
        <Link
          to="/"
          className="inline-block bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-teal-600 transition"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-black uppercase tracking-wider mb-6 text-slate-900">
        Checkout
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm"
      >
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
            Shipping Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              required
              name="street"
              placeholder="Street Address"
              value={address.street}
              onChange={handleInputChange}
              className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:col-span-2 focus:outline-none focus:border-slate-400 bg-slate-50/50"
            />
            <input
              required
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleInputChange}
              className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-slate-400 bg-slate-50/50"
            />
            <input
              required
              name="state"
              placeholder="State"
              value={address.state}
              onChange={handleInputChange}
              className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-slate-400 bg-slate-50/50"
            />
            <input
              required
              name="zip"
              placeholder="ZIP / Postal Code"
              value={address.zip}
              onChange={handleInputChange}
              className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-slate-400 bg-slate-50/50"
            />
            <input
              required
              name="country"
              placeholder="Country"
              value={address.country}
              onChange={handleInputChange}
              className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-slate-400 bg-slate-50/50"
            />
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-slate-200 pt-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Payment: Cash on Delivery</span>
          <span className="font-mono text-xl font-black text-slate-900">
            ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white font-bold rounded-xl py-3.5 text-xs uppercase tracking-wider hover:bg-teal-600 transition-colors disabled:opacity-50"
        >
          {loading ? "Placing Order…" : "Confirm Order"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;