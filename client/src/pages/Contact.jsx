import { useState } from "react";

const initialForm = { name: "", email: "", message: "" };

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Valid email address required";
    if (!form.message.trim()) errs.message = "Message cannot be empty";
    else if (form.message.trim().length < 10) errs.message = "At least 10 characters required";
    return errs;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
      setForm(initialForm);
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900">Get In Touch</h1>
        <p className="text-slate-500 text-xs mt-1">Have an inquiry regarding an order or product specs? Send a note.</p>
      </div>

      {submitted && (
        <div className="bg-teal-50 text-teal-800 border border-teal-200 rounded-xl px-4 py-2.5 mb-6 text-xs text-center font-semibold">
          Message dispatched. We will reply within 24 hours.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div>
          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className={`w-full border rounded-xl px-3.5 py-2.5 text-xs bg-slate-50/50 ${errors.name ? "border-rose-400" : "border-slate-200"}`}
          />
          {errors.name && <p className="text-rose-500 text-[11px] mt-1">{errors.name}</p>}
        </div>

        <div>
          <input
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className={`w-full border rounded-xl px-3.5 py-2.5 text-xs bg-slate-50/50 ${errors.email ? "border-rose-400" : "border-slate-200"}`}
          />
          {errors.email && <p className="text-rose-500 text-[11px] mt-1">{errors.email}</p>}
        </div>

        <div>
          <textarea
            name="message"
            rows={5}
            placeholder="How can we help?"
            value={form.message}
            onChange={handleChange}
            className={`w-full border rounded-xl px-3.5 py-2.5 text-xs bg-slate-50/50 resize-none ${errors.message ? "border-rose-400" : "border-slate-200"}`}
          />
          {errors.message && <p className="text-rose-500 text-[11px] mt-1">{errors.message}</p>}
        </div>

        <button type="submit" className="w-full bg-slate-900 text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider hover:bg-teal-600 transition">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;