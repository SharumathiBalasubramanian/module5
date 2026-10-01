import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="max-w-md mx-auto px-6 py-28 text-center">
    <span className="font-mono text-5xl font-black text-slate-300 mb-3 block">404</span>
    <h1 className="text-base font-bold uppercase tracking-wider text-slate-900 mb-2">Page Not Found</h1>
    <p className="text-slate-500 text-xs mb-6">The page you were looking for doesn't exist or was moved.</p>
    <Link
      to="/"
      className="inline-block bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-teal-600 transition"
    >
      Return to Store
    </Link>
  </div>
);

export default NotFound;