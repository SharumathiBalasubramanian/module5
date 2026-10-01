import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/thunks/orderThunks";

const statusBadges = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  processing: "bg-sky-50 text-sky-800 border-sky-200",
  shipped: "bg-indigo-50 text-indigo-800 border-indigo-200",
  delivered: "bg-teal-50 text-teal-800 border-teal-200",
  cancelled: "bg-rose-50 text-rose-800 border-rose-200",
};

const Orders = () => {
  const dispatch = useDispatch();
  const { orders = [], loading = false, error = null } = useSelector(
    (state) => state.orders || {}
  );

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900 mb-8 border-b border-slate-200 pb-4">
        Order History
      </h1>

      {loading ? (
        <p className="text-slate-400 text-xs tracking-wider uppercase font-semibold">Loading orders…</p>
      ) : error ? (
        <p className="text-rose-500 text-xs font-semibold">{error}</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
          <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">No order history recorded</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id || Math.random()}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                <span className="font-mono text-xs font-bold text-slate-600">
                  REF #{order._id ? order._id.slice(-8).toUpperCase() : "N/A"}
                </span>
                <span
                  className={`text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full border font-bold ${
                    statusBadges[order.status] || "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {order.status || "pending"}
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items?.map((item, i) => (
                  <div key={item._id || i} className="flex justify-between py-2 text-xs text-slate-700">
                    <span>
                      {item.name || "Item"} <span className="text-slate-400 font-mono">× {item.quantity || 1}</span>
                    </span>
                    <span className="font-mono">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-200 mt-2">
                <span className="text-xs uppercase font-bold text-slate-500">Total Billed</span>
                <span className="font-mono font-bold text-sm text-slate-900">
                  ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;