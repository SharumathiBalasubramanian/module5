import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const emptyProduct = { name: "", description: "", price: "", category: "", stock: "", brand: "" };

const Admin = () => {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [message, setMessage] = useState("");

  const loadProducts = async () => {
    const { data } = await axiosInstance.get("/products", { params: { limit: 50 } });
    setProducts(data.products || []);
  };

  const loadOrders = async () => {
    const { data } = await axiosInstance.get("/orders");
    setOrders(data.orders || []);
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/products", { ...form, price: Number(form.price), stock: Number(form.stock) });
      setForm(emptyProduct);
      setMessage("Item created successfully");
      loadProducts();
    } catch (err) {
      setMessage(err.response?.data?.message || "Action failed");
    }
  };

  const handleDelete = async (id) => {
    await axiosInstance.delete(`/products/${id}`);
    loadProducts();
  };

  const handleStatusChange = async (id, status) => {
    await axiosInstance.put(`/orders/${id}/status`, { status });
    loadOrders();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <h1 className="text-xl font-black uppercase tracking-wider text-slate-900">
          Inventory & Orders Hub
        </h1>
        <div className="flex gap-2">
          {["products", "orders"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3.5 py-1.5 rounded-lg capitalize text-xs font-bold tracking-wider transition ${
                tab === t ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === "products" && (
        <div className="grid md:grid-cols-3 gap-8">
          <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 h-fit shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Create Product</h3>
            {message && <p className="text-xs text-teal-700 font-semibold">{message}</p>}
            {Object.keys(emptyProduct).map((field) => (
              <input
                key={field}
                required={field !== "brand"}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs bg-slate-50/50 focus:outline-none focus:border-slate-400"
              />
            ))}
            <button type="submit" className="w-full bg-slate-900 text-white rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-teal-600 transition">
              Publish Item
            </button>
          </form>

          <div className="md:col-span-2 space-y-2">
            {products.map((p) => (
              <div key={p._id} className="flex justify-between items-center bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs">
                <div>
                  <p className="font-bold text-slate-900">{p.name}</p>
                  <p className="text-slate-500 font-mono">{p.category} · ₹{p.price} · stock {p.stock}</p>
                </div>
                <button onClick={() => handleDelete(p._id)} className="text-rose-600 hover:underline font-semibold">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex justify-between items-center text-xs shadow-sm">
              <div>
                <p className="font-bold text-slate-900 font-mono">#{order._id.slice(-8).toUpperCase()} — {order.user?.name}</p>
                <p className="text-slate-500 font-mono">₹{order.totalAmount} · {order.items?.length || 0} unit(s)</p>
              </div>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-slate-50 focus:outline-none"
              >
                {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;