import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, registerUser } from "../redux/thunks/authThunks";
import { clearAuthError } from "../redux/slices/authSlice";

const Login = () => {
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error } = useSelector(
    (state) => state.auth
  );

  const redirectTo = location.state?.from || "/";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const toggleMode = (newMode) => {
    dispatch(clearAuthError());
    setMode(newMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(clearAuthError());

    let action;

    if (mode === "login") {
      action = loginUser({
        email: form.email,
        password: form.password,
      });
    } else {
      action = registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
      });
    }

    const result = await dispatch(action);

    // ============================
    // LOGIN / REGISTER SUCCESS
    // ============================
    if (result.meta?.requestStatus === "fulfilled") {
      const responseData = result.payload;

      console.log("AUTH RESPONSE:", responseData);

      // Save JWT token
      if (responseData?.token) {
        localStorage.setItem(
          "token",
          responseData.token
        );

        console.log("TOKEN SAVED ✅");
      }

      // Save user details
      if (responseData?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...responseData.user,
            token: responseData.token,
          })
        );
      }

      navigate(redirectTo, {
        replace: true,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900">
          {mode === "login"
            ? "Account Access"
            : "Join The Registry"}
        </h1>

        <p className="text-slate-500 text-xs mt-1">
          {mode === "login"
            ? "Authenticate to view and track your orders"
            : "Create a profile to unlock seamless checkout"}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm"
      >
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs text-center font-semibold">
            {error}
          </div>
        )}

        {mode === "register" && (
          <div className="space-y-3 border-b border-slate-100 pb-3 mb-2">
            <input
              required
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-slate-400 bg-slate-50/50"
            />

            <input
              name="phone"
              placeholder="Contact Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-slate-400 bg-slate-50/50"
            />

            <input
              name="street"
              placeholder="Street"
              value={form.street}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-slate-400 bg-slate-50/50"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-slate-400 bg-slate-50/50"
              />

              <input
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                className="border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-slate-400 bg-slate-50/50"
              />
            </div>
          </div>
        )}

        <input
          required
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-slate-400 bg-slate-50/50"
        />

        <input
          required
          type="password"
          name="password"
          minLength={6}
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-slate-400 bg-slate-50/50"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider hover:bg-teal-600 transition-colors disabled:opacity-50 mt-2"
        >
          {loading
            ? "Authenticating…"
            : mode === "login"
            ? "Sign In"
            : "Register"}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500 mt-6">
        {mode === "login"
          ? "Need an account?"
          : "Already registered?"}{" "}

        <button
          onClick={() =>
            toggleMode(
              mode === "login"
                ? "register"
                : "login"
            )
          }
          type="button"
          className="text-teal-600 font-bold hover:underline"
        >
          {mode === "login"
            ? "Create one now"
            : "Sign in here"}
        </button>
      </p>

      {mode === "login" && (
        <p className="text-center text-[11px] font-mono text-slate-400 mt-4">
          Demo: admin@shop.com / Admin@123 ·
          user@shop.com / User@123
        </p>
      )}
    </div>
  );
};

export default Login;