import { useState, useEffect } from "react";
import "./Register.css";

const quotes = [
  { text: "Your time is precious. FlowQ makes sure none of it is wasted in line.", author: "FlowQ" },
  { text: "A queue managed well is a business run well.", author: "FlowQ" },
  { text: "Efficiency is not a luxury — it's a standard.", author: "FlowQ" },
  { text: "The best service is the one that respects your customer's time.", author: "FlowQ" },
  { text: "Smart queues. Happy customers. Thriving businesses.", author: "FlowQ" },
  { text: "From chaos to clarity — one queue at a time.", author: "FlowQ" },
  { text: "No more waiting rooms. Just seamless flow.", author: "FlowQ" },
];

function Register() {
  const [form, setForm] = useState({
    name: "",
    type: "",
    phone: "",
    countryCode: "+1"
  });

  const countryCodes = [
    { code: "+1",   label: "🇺🇸 +1" },
    { code: "+44",  label: "🇬🇧 +44" },
    { code: "+91",  label: "🇮🇳 +91" },
    { code: "+61",  label: "🇦🇺 +61" },
    { code: "+81",  label: "🇯🇵 +81" },
    { code: "+49",  label: "🇩🇪 +49" },
    { code: "+33",  label: "🇫🇷 +33" },
    { code: "+971", label: "🇦🇪 +971" },
    { code: "+92",  label: "🇵🇰 +92" },
    { code: "+880", label: "🇧🇩 +880" },
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex(i => (i + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const createQueue = async () => {
    if (!form.name || !form.type || !form.phone) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgName: form.name,
          queueType: form.type,
          phone: form.countryCode + form.phone
        })
      });

      if (!response.ok) throw new Error("Server error. Please try again.");

      const data = await response.json();

      localStorage.setItem("queueCode", data.code);
      localStorage.setItem("qrURL", data.qrURL);
      localStorage.setItem("orgName", data.orgName);

      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">

      {/* ── Background design ── */}
      <div className="bg-grid" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
      <div className="orb orb-5" />

      {/* ── Title ── */}
      <h1 className="app-title">FlowQ</h1>

      {/* ── Rotating quote ── */}
      <div className="quote-box" key={quoteIndex}>
        <p className="quote-text">"{quotes[quoteIndex].text}"</p>
        <p className="quote-author">— {quotes[quoteIndex].author}</p>
      </div>

      {/* ── Form card ── */}
      <div className="register-box">
        <p className="card-label">Create Queue</p>

        <div className="field">
          <label>Organization Name</label>
          <input
            type="text"
            placeholder="Enter organization name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="field">
          <label>Queue Type</label>
          <input
            type="text"
            placeholder="Enter queue type"
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          />
        </div>

        <div className="field">
          <label>Phone Number</label>
          <div className="phone-wrap">
            <select
              className="country-select"
              value={form.countryCode}
              onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
            >
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
            <input
              type="tel"
              placeholder="10-digit number"
              value={form.phone}
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key))
                  e.preventDefault();
              }}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
              maxLength={10}
            />
          </div>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <hr className="divider" />

        <button className="btn-primary" onClick={createQueue} disabled={loading}>
          {loading ? "Creating..." : "Generate QR & Start"}
        </button>
      </div>

    </div>
  );
}

export default Register;
