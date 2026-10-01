const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 mt-28 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10 text-xs">
        {/* Col 1 */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
            <span className="text-white uppercase tracking-widest font-extrabold text-base">Aura Goods</span>
          </div>
          <p className="text-zinc-400 max-w-sm leading-relaxed">
            Curating purposeful objects, industrial utility, and modern workwear built to endure everyday routines.
          </p>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="text-zinc-100 font-semibold uppercase tracking-wider mb-3">Navigation</h4>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-emerald-400 transition-colors">Catalog</a></li>
            <li><a href="/orders" className="hover:text-emerald-400 transition-colors">Track Order</a></li>
            <li><a href="/contact" className="hover:text-emerald-400 transition-colors">Client Support</a></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="text-zinc-100 font-semibold uppercase tracking-wider mb-3">Policies</h4>
          <ul className="space-y-2">
            <li><span className="hover:text-emerald-400 transition-colors cursor-pointer">Shipping & Returns</span></li>
            <li><span className="hover:text-emerald-400 transition-colors cursor-pointer">Privacy Terms</span></li>
            <li><span className="hover:text-emerald-400 transition-colors cursor-pointer">Warranty Care</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-900 py-6 text-center text-zinc-600 text-[11px]">
        © {new Date().getFullYear()} Aura Goods Co. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;