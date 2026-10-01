import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSearch } from "react-icons/fi";
import { logout } from "../redux/slices/authSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) =>
    state.cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?keyword=${encodeURIComponent(search.trim())}`);
      setOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-900 text-zinc-100 shadow-sm border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3.5 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link to="/" className="text-xl tracking-widest uppercase font-extrabold flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
          Aura<span className="text-zinc-400 font-light">Goods</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm items-center border border-zinc-700 rounded-lg px-3 py-1.5 bg-zinc-800/80 focus-within:border-emerald-400 transition-colors">
          <FiSearch className="text-zinc-400 mr-2 shrink-0" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalog..."
            className="w-full bg-transparent outline-none text-xs text-zinc-100 placeholder:text-zinc-500"
          />
        </form>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wider uppercase">
          <Link to="/" className="text-zinc-300 hover:text-emerald-400 transition-colors">Discover</Link>
          <Link to="/contact" className="text-zinc-300 hover:text-emerald-400 transition-colors">Support</Link>
          {user && <Link to="/orders" className="text-zinc-300 hover:text-emerald-400 transition-colors">My Orders</Link>}
          {user?.role === "admin" && (
            <Link to="/admin" className="text-emerald-400 hover:underline">Dashboard</Link>
          )}

          {/* Cart Icon */}
          <Link to="/cart" className="relative flex items-center p-1.5 hover:text-emerald-400 transition-colors">
            <FiShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-zinc-950 font-bold text-[10px] rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Account / Auth */}
          {user ? (
            <div className="flex items-center gap-3 border-l border-zinc-700 pl-4">
              <span className="text-zinc-400 flex items-center gap-1.5 lowercase font-normal">
                <FiUser size={14} /> {user.name.split(" ")[0]}
              </span>
              <button onClick={handleLogout} className="text-zinc-400 hover:text-rose-400 transition-colors">
                Sign out
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 rounded-md font-bold transition-all">
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-zinc-200" onClick={() => setOpen(!open)}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4 text-xs font-semibold uppercase tracking-wider bg-zinc-900 border-t border-zinc-800">
          <form onSubmit={handleSearch} className="flex items-center border border-zinc-700 rounded-lg px-3 py-2 bg-zinc-800">
            <FiSearch className="text-zinc-400 mr-2" size={16} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search catalog..." className="w-full bg-transparent outline-none text-zinc-100" />
          </form>
          <Link to="/" onClick={() => setOpen(false)}>Discover</Link>
          <Link to="/cart" onClick={() => setOpen(false)}>Cart ({cartCount})</Link>
          <Link to="/contact" onClick={() => setOpen(false)}>Support</Link>
          {user && <Link to="/orders" onClick={() => setOpen(false)}>My Orders</Link>}
          {user?.role === "admin" && <Link to="/admin" onClick={() => setOpen(false)}>Dashboard</Link>}
          {user ? (
            <button onClick={handleLogout} className="text-left text-rose-400">Sign out</button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="text-emerald-400">Sign In</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;