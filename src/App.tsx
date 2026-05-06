import { useState, useEffect, useRef } from "react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const G = "#C9A84C", GD = "#8B6914"
;const D0 = "#0A0A0A", D1 = "#101010", D2 = "#141414", D3 = "#1A1A1A", D4 = "#222";
const BR = "rgba(201,168,76,0.15)";
const TM = "#888", TD = "#444";

const STATUS_COLORS = {
  Incoming:    { color: "#E8C97A", bg: "rgba(232,201,122,.1)" },
  Searching:   { color: "#7BC8F6", bg: "rgba(123,200,246,.1)" },
  Shortlisted: { color: "#5DCAA5", bg: "rgba(93,202,165,.1)"  },
  Complete:    { color: "#888",    bg: "rgba(136,136,136,.1)" },
  "On Hold":   { color: "#E24B4A", bg: "rgba(226,75,74,.1)"  },
};
const STATUSES = ["Incoming", "Searching", "Shortlisted", "Complete", "On Hold"];

// ─── STATIC DATA ──────────────────────────────────────────────────────────────
const BUYER_TYPES  = ["First-time buyer","Upgrading my current car","Building a collection","Company / fleet vehicle","Weekend / track car","Investment purchase"];
const BUDGETS_OB   = ["Under £15,000","£15,000 – £30,000","£30,000 – £50,000","£50,000 – £100,000","£100,000 – £200,000","£200,000+"];
const MAKES_OB     = ["Audi","BMW","Ferrari","Lamborghini","Land Rover","Lexus","McLaren","Mercedes","Porsche","Tesla","Volkswagen","Other"];
const CAR_TYPES    = ["Saloon","SUV / 4x4","Coupe","Convertible","Estate","Hatchback","Sports car","Classic","Electric / Hybrid"];
const QUICK_SPECS  = ["Fast SUV under £40k","Weekend sports car","Family estate diesel","EV under £50k","Classic investment car","Daily driver under £20k","Performance saloon","Luxury convertible"];
const MAKES_FORM   = ["Any","Audi","BMW","Mercedes","Porsche","Ferrari","Lamborghini","Range Rover","Tesla","Volkswagen","Other"];
const BUDGETS_FORM = ["Under £15k","£15k–£30k","£30k–£50k","£50k–£100k","£100k–£200k","£200k+"];
const YEARS        = ["2023+","2021+","2019+","2017+","2015+","Any year"];
const MILEAGES     = ["Under 5,000","Under 15,000","Under 30,000","Under 60,000","Under 100,000","Any"];

const FAQS = [
  { q: "How quickly can you find my car?",          a: "Most searches return shortlisted options within 24–72 hours. Complex or rare specs may take up to 7 days." },
  { q: "Do you work with private sellers?",          a: "Yes — we span franchised dealers, specialist independents, and vetted private vendors nationwide." },
  { q: "Is there a fee if you don't find my car?",  a: "No. No-Find, No-Fee — if we can't source a match, you pay nothing." },
  { q: "Can I update my search after submitting?",   a: "Yes — open the search from your dashboard and edit your criteria at any time." },
  { q: "Do you handle purchase negotiation?",        a: "Unlimited plan members get full purchase support including negotiation, inspection, and handover." },
];

const TESTIMONIALS = [
  { n: "James T.", l: "London",     c: "911 Carrera GTS",      q: "Found my dream 911 in 4 days. Exactly the right spec.", r: 5 },
  { n: "Sarah M.", l: "Manchester", c: "Range Rover Autobiography", q: "Three perfect matches within 48 hours. Incredible service.", r: 5 },
  { n: "David K.", l: "Edinburgh",  c: "M4 Competition",        q: "Sourced an Isle of Man Green M4 in under a week.", r: 5 },
  { n: "Priya L.", l: "Bristol",    c: "Tesla Model S Plaid",   q: "Found a better spec than I'd hoped for. Flawless.", r: 5 },
];

const SEED_ACCOUNTS = [
  { id: "demo-james", email: "james@demo.com",               password: "demo123",  name: "James Thornton", role: "client", plan: "Unlimited", joined: "01 May 2026", avatar: "JT", onboarding: { buyerType: "Building a collection", budget: "£90,000 – £200,000", makes: ["Porsche","BMW"], types: ["Coupe","Sports car"] } },
  { id: "demo-sarah", email: "sarah@demo.com",               password: "demo123",  name: "Sarah Mitchell", role: "client", plan: "Explorer",  joined: "02 May 2026", avatar: "SM", onboarding: { buyerType: "Upgrading my current car", budget: "£50,000 – £100,000", makes: ["Land Rover","Mercedes"], types: ["SUV / 4x4"] } },
  { id: "admin-1",    email: "admin@findmyspec.co.uk",       password: "admin123", name: "Admin",          role: "admin",  avatar: "A" },
];

const SEED_SEARCHES = [
  {
    id: 101, clientId: "demo-james", client: "James Thornton", email: "james@demo.com", plan: "Unlimited",
    submitted: "02 May 2026", status: "Shortlisted",
    spec: { make: "Porsche", model: "911 Carrera GTS", budget: "£90–110k", year: "2020+", mileage: "Under 30,000", colour: "Chalk or GT Silver", notes: "Manual preferred. Full service history essential.", tags: [] },
    cars: [
      { id: 1, make: "Porsche", model: "911 Carrera GTS", year: 2021, miles: "18,400", price: "£98,500",  colour: "Chalk White", dealer: "Porsche Centre Leeds", img: "https://picsum.photos/seed/pca/400/260" },
      { id: 2, make: "Porsche", model: "911 Carrera GTS", year: 2022, miles: "9,200",  price: "£107,000", colour: "GT Silver",   dealer: "HR Owen London",        img: "https://picsum.photos/seed/pcb/400/260" },
    ],
    notes: [],
    messages: [
      { id: 1, from: "admin",       senderName: "FindMySpec",     text: "Hi James, we've started sourcing your 911 GTS. Expect your first shortlist within 48 hours.", ts: "02 May, 09:14", read: true },
      { id: 2, from: "demo-james",  senderName: "James Thornton", text: "Brilliant — just to confirm, manual gearbox is essential. Happy to wait for the right car.",  ts: "02 May, 11:32", read: true },
      { id: 3, from: "admin",       senderName: "FindMySpec",     text: "Noted — manual only. We've shortlisted two strong options. Both full history, under 20k miles.", ts: "03 May, 14:05", read: true },
    ],
  },
  {
    id: 102, clientId: "demo-sarah", client: "Sarah Mitchell", email: "sarah@demo.com", plan: "Explorer",
    submitted: "03 May 2026", status: "Searching",
    spec: { make: "Range Rover", model: "Sport HSE", budget: "£60–80k", year: "2022+", mileage: "Under 20,000", colour: "Santorini Black", notes: "7 seats required.", tags: [] },
    cars: [], notes: [],
    messages: [
      { id: 1, from: "admin", senderName: "FindMySpec", text: "Hi Sarah, we've picked up your search and we're scanning the market now. Watch this space!", ts: "03 May, 10:00", read: true },
    ],
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const mkInitials = (n) => n.trim().split(" ").map((w) => w[0]).join("").toUpperCase();
const nowTs = () => new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).replace(",", "");
const nowDate = () => new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:#0A0A0A;color:#E8E8E0;font-family:'Inter',sans-serif;font-size:14px;line-height:1.6}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#101010}::-webkit-scrollbar-thumb{background:#8B6914;border-radius:2px}
.serif{font-family:'Cormorant Garamond',serif}
.btn-gold{background:#C9A84C;color:#0A0A0A;font-weight:600;border:none;border-radius:3px;padding:11px 26px;font-size:13px;letter-spacing:.07em;text-transform:uppercase;cursor:pointer;transition:all .2s;white-space:nowrap;display:inline-flex;align-items:center;justify-content:center}
.btn-gold:hover{background:#E8C97A;transform:translateY(-1px)}.btn-gold:disabled{opacity:.4;cursor:not-allowed;transform:none}
.btn-ghost{background:transparent;color:#C9A84C;font-weight:500;border:1px solid rgba(201,168,76,.3);border-radius:3px;padding:10px 20px;font-size:13px;cursor:pointer;transition:all .2s;white-space:nowrap}
.btn-ghost:hover{background:rgba(201,168,76,.07)}
.btn-danger{background:transparent;color:#E24B4A;border:1px solid rgba(226,75,74,.25);border-radius:3px;padding:5px 11px;font-size:11px;cursor:pointer;transition:all .2s}
.btn-danger:hover{background:rgba(226,75,74,.07)}
.inp{width:100%;background:#222;border:1px solid rgba(255,255,255,.09);border-radius:4px;color:#E8E8E0;font-family:'Inter',sans-serif;font-size:13px;padding:10px 14px;outline:none;transition:border-color .2s}
.inp:focus{border-color:#C9A84C}.inp::placeholder{color:#444}
.sel{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23C9A84C' stroke-width='1.5'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center}
.card{background:#1A1A1A;border:1px solid rgba(201,168,76,0.15);border-radius:6px}
.chip{background:rgba(201,168,76,.08);color:#C9A84C;border:1px solid rgba(201,168,76,.2);border-radius:3px;font-size:12px;padding:6px 14px;cursor:pointer;transition:all .2s;user-select:none}
.chip:hover{background:rgba(201,168,76,.15)}.chip.on{background:rgba(201,168,76,.22);border-color:#C9A84C}
.pill{display:inline-block;border-radius:2px;font-size:11px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;padding:3px 9px}
.nb{background:none;border:none;color:#888;font-family:'Inter',sans-serif;font-size:13px;cursor:pointer;padding:6px 10px;transition:color .2s}
.nb:hover{color:#E8E8E0}.nb.on{color:#C9A84C}
.sdb{background:none;border:none;color:#888;font-family:'Inter',sans-serif;font-size:13px;cursor:pointer;padding:8px 12px;border-radius:4px;transition:all .2s;text-align:left;width:100%;display:flex;align-items:center;gap:9px}
.sdb:hover{color:#E8E8E0;background:rgba(255,255,255,.04)}.sdb.on{color:#C9A84C;background:rgba(201,168,76,.08)}
.irow{padding:12px 15px;border-bottom:1px solid rgba(255,255,255,.04);cursor:pointer;transition:background .15s;border-left:2px solid transparent}
.irow:hover{background:rgba(255,255,255,.02)}.irow.on{background:rgba(201,168,76,.05);border-left-color:#C9A84C}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.78);display:flex;align-items:center;justify-content:center;z-index:400;padding:20px}
.modal{background:#141414;border:1px solid rgba(201,168,76,.15);border-radius:8px;width:100%;max-width:500px;max-height:90vh;overflow-y:auto}
.prog{height:2px;background:rgba(201,168,76,.15);border-radius:1px;margin-bottom:32px}
.prog-fill{height:100%;background:#C9A84C;border-radius:1px;transition:width .4s ease}
.lbl{font-size:11px;color:#444;letter-spacing:.08em;text-transform:uppercase;display:block;margin-bottom:7px}
.ferr{font-size:12px;color:#E24B4A;margin-top:8px}
.fade{animation:fadeIn .25s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
.toast{position:fixed;top:66px;right:20px;background:#1A1A1A;border:1px solid #C9A84C;border-radius:5px;padding:11px 18px;font-size:13px;color:#E8E8E0;z-index:500;animation:slideIn .3s ease}
@keyframes slideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
`;

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return <div className="toast">✦ {msg}</div>;
}

function Badge({ label }) {
  return <span style={{ display: "inline-block", background: "rgba(201,168,76,.1)", color: G, border: "1px solid rgba(201,168,76,.22)", borderRadius: 2, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", padding: "3px 11px" }}>{label}</span>;
}

function Divider() {
  return <div style={{ width: 40, height: 1, background: G, margin: "10px auto 26px" }} />;
}

function Lbl({ children }) {
  return <span className="lbl">{children}</span>;
}

function Avt({ text, size = 36 }) {
  return <div style={{ width: size, height: size, borderRadius: "50%", background: "rgba(201,168,76,.12)", border: "1px solid rgba(201,168,76,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.34, fontWeight: 600, color: G, flexShrink: 0 }}>{text}</div>;
}

function StatusPill({ status }) {
  const sc = STATUS_COLORS[status] || STATUS_COLORS.Incoming;
  return <span className="pill" style={{ background: sc.bg, color: sc.color }}>{status}</span>;
}

function CarCard({ car, onRemove }) {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ height: 115, overflow: "hidden", position: "relative" }}>
        <img src={car.img} alt={car.model} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,.55),transparent 55%)" }} />
        <div style={{ position: "absolute", bottom: 7, left: 10, fontSize: 11, color: "#FFF", fontWeight: 500 }}>{car.colour}</div>
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 2 }}>{car.year} {car.model}</div>
        <div style={{ fontSize: 11, color: TM, marginBottom: 2 }}>{car.miles} miles</div>
        <div style={{ fontSize: 11, color: TM, marginBottom: 8 }}>{car.dealer}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="serif" style={{ fontSize: 17, color: G, fontWeight: 600 }}>{car.price}</span>
          {onRemove && <button className="btn-danger" onClick={onRemove}>Remove</button>}
        </div>
      </div>
    </div>
  );
}

// ─── MESSAGE THREAD ───────────────────────────────────────────────────────────
function MessageThread({ search, userId, isAdmin, onSend }) {
  const [msg, setMsg] = useState("");
  const endRef = useRef(null);
  const msgs = search.messages || [];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs.length]);

  function send() {
    if (!msg.trim()) return;
    onSend(search.id, {
      id: Date.now(),
      from: isAdmin ? "admin" : userId,
      senderName: isAdmin ? "FindMySpec" : search.client,
      text: msg.trim(),
      ts: nowTs(),
      read: false,
    });
    setMsg("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <div style={{ padding: "11px 16px", borderBottom: `1px solid ${BR}`, flexShrink: 0, background: D3 }}>
        <div style={{ fontWeight: 500, fontSize: 13, color: "#E0DDD5", marginBottom: 3 }}>{search.client}</div>
        <div style={{ fontSize: 11, color: TD, display: "flex", alignItems: "center", gap: 8 }}>
          {search.spec.make} {search.spec.model || ""} · {search.spec.budget || "TBC"}
          <StatusPill status={search.status} />
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.length === 0 && <div style={{ textAlign: "center", color: TD, fontSize: 13, marginTop: 40 }}>No messages yet. Send the first one.</div>}
        {msgs.map((m) => {
          const mine = isAdmin ? m.from === "admin" : m.from === userId;
          return (
            <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: mine ? "flex-end" : "flex-start" }}>
              {!mine && <div style={{ fontSize: 11, color: TD, marginBottom: 3 }}>{m.senderName}</div>}
              <div style={{ maxWidth: "75%", background: mine ? "rgba(201,168,76,.12)" : D4, border: `1px solid ${mine ? "rgba(201,168,76,.28)" : BR}`, borderRadius: mine ? "10px 10px 2px 10px" : "10px 10px 10px 2px", padding: "10px 14px", fontSize: 13, color: "#DDD", lineHeight: 1.6 }}>{m.text}</div>
              <div style={{ fontSize: 10, color: TD, marginTop: 3 }}>{m.ts}</div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <div style={{ padding: "11px 14px", borderTop: `1px solid ${BR}`, flexShrink: 0, display: "flex", gap: 9, background: D3 }}>
        <input className="inp" value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder={isAdmin ? "Reply to client…" : "Message your concierge…"} style={{ flex: 1 }} />
        <button className="btn-gold" style={{ padding: "10px 18px" }} onClick={send}>Send</button>
      </div>
    </div>
  );
}

// ─── LANDING ──────────────────────────────────────────────────────────────────
function Landing({ onLogin, onSignup }) {
  return (
    <div style={{ background: D0, minHeight: "100vh" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,10,.96)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${BR}`, padding: "0 28px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="serif" style={{ fontSize: 22, color: G, fontWeight: 600 }}>FindMySpec</span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="nb" onClick={onLogin}>Sign In</button>
          <button className="btn-gold" style={{ padding: "9px 22px" }} onClick={onSignup}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ minHeight: "88vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "70px 24px", background: "radial-gradient(ellipse 90% 70% at 50% 0%,rgba(201,168,76,.08) 0%,transparent 65%)" }}>
        <Badge label="Premium · Nationwide · Personalised" />
        <h1 className="serif" style={{ fontSize: "clamp(40px,7.5vw,78px)", fontWeight: 600, lineHeight: 1.06, margin: "22px 0 18px", color: "#F2EFE4" }}>
          Your dream car.<br /><span style={{ color: G, fontStyle: "italic" }}>Effortlessly found.</span>
        </h1>
        <p style={{ fontSize: 17, color: TM, maxWidth: 520, lineHeight: 1.75, marginBottom: 42 }}>Tell us exactly what you want. Our concierge team sources it — nationwide, on your terms, without the dealer grind.</p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <button className="btn-gold" style={{ padding: "14px 36px", fontSize: 14 }} onClick={onSignup}>Start Your Search</button>
          <button className="btn-ghost" onClick={onLogin}>Sign In</button>
        </div>
        <div style={{ marginTop: 72, display: "flex", gap: 56, flexWrap: "wrap", justifyContent: "center" }}>
          {[["2,400+", "Cars Sourced"], ["98%", "Satisfaction"], ["48hrs", "Avg Turnaround"], ["£0", "If We Fail"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div className="serif" style={{ fontSize: 32, color: G, fontWeight: 600 }}>{n}</div>
              <div style={{ fontSize: 11, color: TM, letterSpacing: ".09em", textTransform: "uppercase", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <Badge label="Process" />
        <h2 className="serif" style={{ fontSize: "clamp(26px,4vw,44px)", margin: "16px 0 10px", color: "#F2EFE4" }}>How It Works</h2>
        <Divider />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}>
          {[{ n: "01", t: "Tell Us", d: "Share your ideal spec — make, model, budget, extras. Quick-pick or fully custom." }, { n: "02", t: "We Source", d: "Our team scours the entire market — dealers, independents, private sales, and auctions nationwide." }, { n: "03", t: "You Choose", d: "Receive a curated shortlist of verified matches. Pick your favourite — we handle everything else." }].map((s) => (
            <div key={s.n} className="card" style={{ padding: 26, textAlign: "left" }}>
              <div style={{ fontSize: 11, color: GD, letterSpacing: ".15em", fontWeight: 600, marginBottom: 10 }}>{s.n}</div>
              <h3 className="serif" style={{ fontSize: 20, color: "#F2EFE4", marginBottom: 8 }}>{s.t}</h3>
              <p style={{ fontSize: 13, color: TM, lineHeight: 1.7 }}>{s.d}</p>
            </div>
          ))}
        </div>
        <button className="btn-gold" style={{ marginTop: 42 }} onClick={onSignup}>Create Your Account</button>
      </div>

      {/* Testimonials */}
      <div style={{ borderTop: `1px solid ${BR}`, padding: "70px 24px", background: D1 }}>
        <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
          <Badge label="Client Stories" />
          <h2 className="serif" style={{ fontSize: "clamp(24px,4vw,40px)", margin: "16px 0 10px", color: "#F2EFE4" }}>What our clients say</h2>
          <Divider />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, textAlign: "left" }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.n} className="card" style={{ padding: 22 }}>
                <div style={{ color: G, fontSize: 13, letterSpacing: 2 }}>{"★".repeat(t.r)}</div>
                <p style={{ fontSize: 13, color: "#CCC", lineHeight: 1.7, margin: "13px 0 16px", fontStyle: "italic" }}>"{t.q}"</p>
                <div style={{ borderTop: `1px solid ${BR}`, paddingTop: 12 }}>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{t.n}</div>
                  <div style={{ fontSize: 12, color: TM, marginTop: 2 }}>{t.l} · {t.c}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ borderTop: `1px solid ${BR}`, padding: "28px 24px", textAlign: "center" }}>
        <div className="serif" style={{ fontSize: 18, color: G, marginBottom: 6 }}>FindMySpec</div>
        <p style={{ fontSize: 11, color: TD }}>© 2026 FindMySpec Ltd · hello@findmyspec.co.uk</p>
      </footer>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage({ accounts, onLogin, onBack, onSignup }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  function attempt() {
    const u = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase() && a.password === pass);
    if (u) { setErr(""); onLogin(u); } else setErr("Incorrect email or password.");
  }

  return (
    <div style={{ minHeight: "100vh", background: D0, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }} className="fade">
        <button onClick={onBack} style={{ background: "none", border: "none", color: TM, cursor: "pointer", fontSize: 13, marginBottom: 28 }}>← Back</button>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div className="serif" style={{ fontSize: 34, color: G, fontWeight: 600 }}>FindMySpec</div>
          <div style={{ fontSize: 11, color: TD, letterSpacing: ".18em", textTransform: "uppercase", marginTop: 4 }}>Sign in to your account</div>
        </div>
        <div className="card" style={{ padding: 30 }}>
          <div style={{ marginBottom: 14 }}><Lbl>Email</Lbl><input className="inp" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") attempt(); }} placeholder="your@email.com" /></div>
          <div style={{ marginBottom: 20 }}><Lbl>Password</Lbl><input className="inp" type="password" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") attempt(); }} placeholder="••••••••" /></div>
          {err && <div className="ferr" style={{ marginBottom: 14 }}>{err}</div>}
          <button className="btn-gold" style={{ width: "100%" }} onClick={attempt}>Sign In</button>
          <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: TM }}>
            No account?{" "}<button onClick={onSignup} style={{ background: "none", border: "none", color: G, cursor: "pointer", fontSize: 13 }}>Create one →</button>
          </div>
          <div style={{ marginTop: 22, padding: 14, background: D4, borderRadius: 4, fontSize: 12, color: TM, lineHeight: 1.9 }}>
            <div style={{ color: TD, marginBottom: 4, fontSize: 10, letterSpacing: ".07em", textTransform: "uppercase" }}>Demo accounts</div>
            <div><span style={{ color: G }}>Admin:</span> admin@findmyspec.co.uk / admin123</div>
            <div><span style={{ color: G }}>Client:</span> james@demo.com / demo123</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [pass, setPass] = useState(""); const [pass2, setPass2] = useState("");
  const [buyerType, setBuyerType] = useState(""); const [budget, setBudget] = useState("");
  const [makes, setMakes] = useState([]); const [types, setTypes] = useState([]);
  const [plan, setPlan] = useState(""); const [err, setErr] = useState("");
  const TOTAL = 6;

  const toggle = (_arr, set, v) => set((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);

  function next() {
    setErr("");
    if (step === 0) {
      if (!name.trim() || !email.trim() || !pass || !pass2) { setErr("Please fill in all fields."); return; }
      if (pass !== pass2) { setErr("Passwords do not match."); return; }
      if (pass.length < 6) { setErr("Password must be at least 6 characters."); return; }
    }
    if (step === 1 && !buyerType) { setErr("Please select one."); return; }
    if (step === 2 && !budget) { setErr("Please select your budget."); return; }
    if (step === 3 && makes.length === 0) { setErr("Please select at least one make."); return; }
    if (step === 4 && !plan) { setErr("Please choose a plan."); return; }
    if (step < TOTAL - 1) setStep((s) => s + 1);
    else onComplete({ id: `user-${Date.now()}`, email, password: pass, name: name.trim(), role: "client", plan, joined: nowDate(), avatar: mkInitials(name), onboarding: { buyerType, budget, makes, types } });
  }

  const PLAN_OPTS = [
    { id: "Explorer",  price: "£100",    sub: "10 searches · Pay once",      features: ["10 search credits", "Nationwide sourcing", "48hr turnaround", "3 shortlisted matches", "Email support"] },
    { id: "Unlimited", price: "£250/mo", sub: "Unlimited · Cancel anytime", features: ["Unlimited search credits", "Priority 24hr turnaround", "5+ shortlisted matches", "Dedicated account manager", "Purchase negotiation", "Priority support"] },
  ];

  const STEPS = [
    <div key={0} className="fade">
      <Badge label="Step 1 of 5" /><h2 className="serif" style={{ fontSize: 30, color: "#F2EFE4", margin: "14px 0 6px" }}>Create your account</h2>
      <p style={{ color: TM, fontSize: 13, marginBottom: 28 }}>Start your journey to finding the perfect car.</p>
      <div style={{ display: "grid", gap: 13 }}>
        <div><Lbl>Full name</Lbl><input className="inp" value={name} onChange={(e) => setName(e.target.value)} placeholder="James Thornton" /></div>
        <div><Lbl>Email address</Lbl><input className="inp" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="james@email.com" /></div>
        <div><Lbl>Password</Lbl><input className="inp" type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="At least 6 characters" /></div>
        <div><Lbl>Confirm password</Lbl><input className="inp" type="password" value={pass2} onChange={(e) => setPass2(e.target.value)} placeholder="Repeat password" /></div>
      </div>
    </div>,
    <div key={1} className="fade">
      <Badge label="Step 2 of 5" /><h2 className="serif" style={{ fontSize: 30, color: "#F2EFE4", margin: "14px 0 6px" }}>What best describes you?</h2>
      <p style={{ color: TM, fontSize: 13, marginBottom: 28 }}>This helps us tailor your experience.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {BUYER_TYPES.map((b) => <button key={b} onClick={() => setBuyerType(b)} style={{ background: buyerType === b ? "rgba(201,168,76,.18)" : D4, border: `1px solid ${buyerType === b ? G : "rgba(255,255,255,.08)"}`, borderRadius: 5, padding: "14px 16px", cursor: "pointer", textAlign: "left", color: buyerType === b ? "#F2EFE4" : "#AAA", fontSize: 13 }}>{b}</button>)}
      </div>
    </div>,
    <div key={2} className="fade">
      <Badge label="Step 3 of 5" /><h2 className="serif" style={{ fontSize: 30, color: "#F2EFE4", margin: "14px 0 6px" }}>What's your budget?</h2>
      <p style={{ color: TM, fontSize: 13, marginBottom: 28 }}>We'll focus our search in this range.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {BUDGETS_OB.map((b) => <button key={b} onClick={() => setBudget(b)} style={{ background: budget === b ? "rgba(201,168,76,.18)" : D4, border: `1px solid ${budget === b ? G : "rgba(255,255,255,.08)"}`, borderRadius: 5, padding: "14px 16px", cursor: "pointer", textAlign: "left", color: budget === b ? "#F2EFE4" : "#AAA", fontSize: 13 }}>{b}</button>)}
      </div>
    </div>,
    <div key={3} className="fade">
      <Badge label="Step 4 of 5" /><h2 className="serif" style={{ fontSize: 30, color: "#F2EFE4", margin: "14px 0 6px" }}>Your preferences</h2>
      <p style={{ color: TM, fontSize: 13, marginBottom: 24 }}>Select your favourite makes and car types.</p>
      <div style={{ marginBottom: 22 }}>
        <Lbl>Favourite makes</Lbl>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
          {MAKES_OB.map((m) => <button key={m} className={`chip${makes.includes(m) ? " on" : ""}`} onClick={() => toggle(makes, setMakes, m)}>{m}</button>)}
        </div>
      </div>
      <div>
        <Lbl>Car types (optional)</Lbl>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
          {CAR_TYPES.map((t) => <button key={t} className={`chip${types.includes(t) ? " on" : ""}`} onClick={() => toggle(types, setTypes, t)}>{t}</button>)}
        </div>
      </div>
    </div>,
    <div key={4} className="fade">
      <Badge label="Step 5 of 5" /><h2 className="serif" style={{ fontSize: 30, color: "#F2EFE4", margin: "14px 0 6px" }}>Choose your plan</h2>
      <p style={{ color: TM, fontSize: 13, marginBottom: 28 }}>No hidden fees. Cancel anytime.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {PLAN_OPTS.map((p) => (
          <button key={p.id} onClick={() => setPlan(p.id)} style={{ background: plan === p.id ? "rgba(201,168,76,.1)" : D4, border: `2px solid ${plan === p.id ? G : "rgba(255,255,255,.08)"}`, borderRadius: 6, padding: "20px 18px", cursor: "pointer", textAlign: "left", position: "relative" }}>
            {p.id === "Unlimited" && <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: G, color: D0, fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", padding: "3px 12px", borderRadius: 2 }}>Popular</div>}
            <div style={{ fontSize: 11, color: plan === p.id ? G : TD, letterSpacing: ".09em", textTransform: "uppercase", marginBottom: 8 }}>{p.id}</div>
            <div className="serif" style={{ fontSize: 28, color: "#F2EFE4", fontWeight: 600, marginBottom: 4 }}>{p.price}</div>
            <div style={{ fontSize: 11, color: TM, marginBottom: 14 }}>{p.sub}</div>
            {p.features.map((f) => <div key={f} style={{ display: "flex", gap: 8, marginBottom: 7, fontSize: 12, color: "#BBB" }}><span style={{ color: G }}>✓</span>{f}</div>)}
          </button>
        ))}
      </div>
    </div>,
    <div key={5} className="fade" style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ fontSize: 44, marginBottom: 20 }}>✦</div>
      <h2 className="serif" style={{ fontSize: 36, color: "#F2EFE4", marginBottom: 12 }}>Welcome to FindMySpec</h2>
      <p style={{ color: TM, maxWidth: 380, margin: "0 auto 32px", fontSize: 14, lineHeight: 1.7 }}>Your account is ready. Submit your first search and our concierge team will get to work.</p>
      <button className="btn-gold" style={{ padding: "14px 36px" }} onClick={next}>Enter Your Dashboard →</button>
    </div>,
  ];

  return (
    <div style={{ minHeight: "100vh", background: D0, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 560 }} className="fade">
        <div style={{ textAlign: "center", marginBottom: 32 }}><div className="serif" style={{ fontSize: 26, color: G, fontWeight: 600 }}>FindMySpec</div></div>
        {step < TOTAL - 1 && <div className="prog"><div className="prog-fill" style={{ width: `${((step + 1) / TOTAL) * 100}%` }} /></div>}
        {STEPS[step]}
        {err && <div className="ferr">{err}</div>}
        {step < TOTAL - 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
            {step > 0 ? <button className="btn-ghost" onClick={() => { setErr(""); setStep((s) => s - 1); }}>← Back</button> : <div />}
            <button className="btn-gold" onClick={next}>{step === TOTAL - 2 ? "Create Account →" : "Continue →"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CLIENT APP ───────────────────────────────────────────────────────────────
function ClientApp({ user, searches, setSearches, onLogout, notify, onSendMessage }) {
  const [page, setPage] = useState("home");
  const [expanded, setExpanded] = useState(null);
  const [activeMsgId, setActiveMsgId] = useState(null);
  const [faqOpen, setFaqOpen] = useState(null);
  const [chatLog, setChatLog] = useState([{ from: "bot", text: `Hello ${user.name.split(" ")[0]}! I'm your FindMySpec concierge. Ask me anything.` }]);
  const [chatMsg, setChatMsg] = useState(""); const [chatLoading, setChatLoading] = useState(false);
  const [sfStep, setSfStep] = useState(1); const [sfTags, setSfTags] = useState([]);
  const [sfMake, setSfMake] = useState("Any"); const [sfModel, setSfModel] = useState("");
  const [sfBudget, setSfBudget] = useState(""); const [sfYear, setSfYear] = useState("");
  const [sfMileage, setSfMileage] = useState(""); const [sfColour, setSfColour] = useState("");
  const [sfNotes, setSfNotes] = useState(""); const [sfDone, setSfDone] = useState(false);

  const mySearches = searches.filter((s) => s.clientId === user.id);
  const toggleTag = (t) => setSfTags((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t]);

  function submitSearch() {
    const ns = { id: Date.now(), clientId: user.id, client: user.name, email: user.email, plan: user.plan, submitted: nowDate(), status: "Incoming", spec: { make: sfMake, model: sfModel, budget: sfBudget, year: sfYear, mileage: sfMileage, colour: sfColour, notes: sfNotes, tags: sfTags }, cars: [], notes: [], messages: [] };
    setSearches((p) => [...p, ns]);
    setSfDone(true);
    notify("Search submitted — we'll be in touch within 24 hours.");
  }

  function resetForm() { setSfStep(1); setSfTags([]); setSfMake("Any"); setSfModel(""); setSfBudget(""); setSfYear(""); setSfMileage(""); setSfColour(""); setSfNotes(""); setSfDone(false); }

  async function sendChat() {
    if (!chatMsg.trim() || chatLoading) return;
    const msg = chatMsg.trim();
    const newLog = [...chatLog, { from: "user", text: msg }];
    setChatLog(newLog); setChatMsg(""); setChatLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: "You are a warm concierge for FindMySpec, a premium UK car sourcing service. Be concise (2-4 sentences). Explorer plan £100/10 searches, Unlimited £250/month with priority 24hr turnaround, dedicated account manager, purchase negotiation. No-Find No-Fee guarantee. Never invent facts.", messages: newLog.map((m) => ({ role: m.from === "user" ? "user" : "assistant", content: m.text })) }) });
      const data = await res.json();
      const reply = (data.content?.find((b) => b.type === "text") || { text: "Something went wrong." }).text;
      setChatLog((l) => [...l, { from: "bot", text: reply }]);
    } catch { setChatLog((l) => [...l, { from: "bot", text: "Connection issue — please try again." }]); }
    setChatLoading(false);
  }

  const NAV = [["home", "Home"], ["search", "New Search"], ["dashboard", "My Searches"], ["messages", "Messages"], ["pricing", "Pricing"], ["support", "Support"]];

  return (
    <div style={{ background: D0, minHeight: "100vh" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,10,.96)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${BR}`, padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer" }}><span className="serif" style={{ fontSize: 19, color: G, fontWeight: 600 }}>FindMySpec</span></button>
        <div style={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          {NAV.map(([k, l]) => <button key={k} className={`nb${page === k ? " on" : ""}`} onClick={() => setPage(k)}>{l}</button>)}
          <div style={{ width: 1, height: 14, background: BR, margin: "0 8px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avt text={user.avatar || mkInitials(user.name)} size={28} />
            <span style={{ fontSize: 12, color: TM }}>{user.name.split(" ")[0]}</span>
            <button className="btn-ghost" style={{ padding: "5px 11px", fontSize: 11 }} onClick={onLogout}>Sign out</button>
          </div>
        </div>
      </nav>

      {/* HOME */}
      {page === "home" && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "50px 24px" }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: TD, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Welcome back</div>
            <h1 className="serif" style={{ fontSize: "clamp(28px,4vw,44px)", color: "#F2EFE4", fontWeight: 600, marginBottom: 6 }}>Hello, {user.name.split(" ")[0]}.</h1>
            <p style={{ color: TM, fontSize: 14 }}>You're on the <span style={{ color: G }}>{user.plan}</span> plan.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 36 }}>
            {[[mySearches.length, "Searches"], [mySearches.filter((s) => s.status === "Shortlisted").length, "Shortlisted"], [mySearches.reduce((a, s) => a + s.cars.length, 0), "Cars Found"], [mySearches.filter((s) => s.status === "Complete").length, "Complete"]].map(([n, l]) => (
              <div key={l} style={{ background: D3, border: `1px solid ${BR}`, borderRadius: 6, padding: "18px 20px" }}>
                <div className="serif" style={{ fontSize: 28, color: G, fontWeight: 600 }}>{n}</div>
                <div style={{ fontSize: 11, color: TM, letterSpacing: ".06em", textTransform: "uppercase", marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
          {user.onboarding && (
            <div className="card" style={{ padding: "18px 22px", marginBottom: 28 }}>
              <div style={{ fontSize: 11, color: TD, letterSpacing: ".09em", textTransform: "uppercase", marginBottom: 14 }}>Your profile</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
                {[["Buyer type", user.onboarding.buyerType], ["Budget", user.onboarding.budget], ["Makes", (user.onboarding.makes || []).join(", ") || "—"], ["Types", (user.onboarding.types || []).join(", ") || "—"]].map(([l, v]) => (
                  <div key={l}><div style={{ fontSize: 11, color: TD, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>{l}</div><div style={{ fontSize: 13, color: "#DDD", fontWeight: 500 }}>{v || "—"}</div></div>
                ))}
              </div>
            </div>
          )}
          {mySearches.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: "center" }}>
              <div className="serif" style={{ fontSize: 22, color: "#F2EFE4", marginBottom: 10 }}>Ready to find your car?</div>
              <p style={{ color: TM, marginBottom: 24, fontSize: 13 }}>Submit your first search and our concierge team will get to work.</p>
              <button className="btn-gold" onClick={() => setPage("search")}>Start Your Search</button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 11, color: TD, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>Recent searches</div>
              {mySearches.slice(-2).reverse().map((s) => (
                <div key={s.id} className="card" style={{ padding: "14px 18px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, cursor: "pointer" }} onClick={() => setPage("dashboard")}>
                  <div><div style={{ fontWeight: 500, fontSize: 13, marginBottom: 3 }}>{s.spec.make}{s.spec.model ? ` ${s.spec.model}` : ""}</div><div style={{ fontSize: 12, color: TM }}>{s.spec.budget || "Budget TBC"} · {s.submitted}</div></div>
                  <StatusPill status={s.status} />
                </div>
              ))}
              <button className="btn-ghost" style={{ marginTop: 8, width: "100%" }} onClick={() => setPage("search")}>+ New Search</button>
            </div>
          )}
        </div>
      )}

      {/* SEARCH */}
      {page === "search" && (
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "50px 24px" }}>
          {!sfDone ? (
            <div>
              <Badge label="New Search" />
              <h2 className="serif" style={{ fontSize: 32, color: "#F2EFE4", margin: "14px 0 6px" }}>Find your perfect car</h2>
              <p style={{ color: TM, fontSize: 13, marginBottom: 10 }}>Step {sfStep} of 2</p>
              <div className="prog" style={{ marginBottom: 26 }}><div className="prog-fill" style={{ width: `${sfStep / 2 * 100}%` }} /></div>
              {sfStep === 1 && (
                <div className="fade">
                  <div style={{ marginBottom: 22 }}>
                    <Lbl>Quick-pick a spec</Lbl>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                      {QUICK_SPECS.map((t) => <button key={t} className={`chip${sfTags.includes(t) ? " on" : ""}`} onClick={() => toggleTag(t)}>{t}</button>)}
                    </div>
                  </div>
                  <div style={{ textAlign: "center", color: TD, fontSize: 12, margin: "18px 0" }}>— or describe your ideal car —</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><Lbl>Make</Lbl><select className="inp sel" value={sfMake} onChange={(e) => setSfMake(e.target.value)}>{MAKES_FORM.map((m) => <option key={m} style={{ background: D4 }}>{m}</option>)}</select></div>
                    <div><Lbl>Budget</Lbl><select className="inp sel" value={sfBudget} onChange={(e) => setSfBudget(e.target.value)}><option value="" style={{ background: D4 }}>Select</option>{BUDGETS_FORM.map((b) => <option key={b} style={{ background: D4 }}>{b}</option>)}</select></div>
                    <div style={{ gridColumn: "1/-1" }}><Lbl>Model / Variant</Lbl><input className="inp" value={sfModel} onChange={(e) => setSfModel(e.target.value)} placeholder="e.g. M4 Competition xDrive" /></div>
                  </div>
                  <button className="btn-gold" style={{ width: "100%", marginTop: 22 }} onClick={() => setSfStep(2)}>Continue →</button>
                </div>
              )}
              {sfStep === 2 && (
                <div className="fade">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><Lbl>Year</Lbl><select className="inp sel" value={sfYear} onChange={(e) => setSfYear(e.target.value)}><option value="" style={{ background: D4 }}>Select</option>{YEARS.map((y) => <option key={y} style={{ background: D4 }}>{y}</option>)}</select></div>
                    <div><Lbl>Mileage</Lbl><select className="inp sel" value={sfMileage} onChange={(e) => setSfMileage(e.target.value)}><option value="" style={{ background: D4 }}>Select</option>{MILEAGES.map((m) => <option key={m} style={{ background: D4 }}>{m}</option>)}</select></div>
                    <div><Lbl>Colour preference</Lbl><input className="inp" value={sfColour} onChange={(e) => setSfColour(e.target.value)} placeholder="e.g. Chalk White" /></div>
                    <div style={{ gridColumn: "1/-1" }}><Lbl>Additional notes</Lbl><textarea className="inp" rows={3} value={sfNotes} onChange={(e) => setSfNotes(e.target.value)} placeholder="Options, service history, transmission, extras…" style={{ resize: "vertical" }} /></div>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
                    <button className="btn-ghost" onClick={() => setSfStep(1)}>← Back</button>
                    <button className="btn-gold" style={{ flex: 1 }} onClick={submitSearch}>Submit Search</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="fade" style={{ textAlign: "center", padding: "50px 0" }}>
              <div style={{ fontSize: 42, color: G, marginBottom: 18 }}>✦</div>
              <h2 className="serif" style={{ fontSize: 34, color: "#F2EFE4", marginBottom: 10 }}>Search submitted</h2>
              <p style={{ color: TM, maxWidth: 400, margin: "0 auto 30px", fontSize: 14, lineHeight: 1.7 }}>We're on it. Your shortlist will be ready within 24–72 hours.</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button className="btn-gold" onClick={() => { setPage("dashboard"); resetForm(); }}>View Dashboard</button>
                <button className="btn-ghost" onClick={resetForm}>New Search</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DASHBOARD */}
      {page === "dashboard" && (
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "50px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, marginBottom: 30 }}>
            <div><Badge label="My Searches" /><h2 className="serif" style={{ fontSize: 32, color: "#F2EFE4", marginTop: 12 }}>Your searches</h2></div>
            <button className="btn-gold" onClick={() => setPage("search")}>+ New Search</button>
          </div>
          {mySearches.length === 0 && <div className="card" style={{ padding: 40, textAlign: "center" }}><p style={{ color: TM, marginBottom: 20 }}>No searches yet.</p><button className="btn-gold" onClick={() => setPage("search")}>Start Your Search</button></div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mySearches.map((s) => (
              <div key={s.id}>
                <div className="card" style={{ padding: "15px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, cursor: "pointer" }} onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 3 }}>{s.spec.make}{s.spec.model ? ` ${s.spec.model}` : ""}{s.spec.tags?.length > 0 ? ` · ${s.spec.tags[0]}` : ""}</div>
                    <div style={{ fontSize: 12, color: TM }}>{s.spec.budget || "Budget TBC"} · {s.submitted}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {s.cars.length > 0 && <span style={{ fontSize: 12, color: TM }}>{s.cars.length} match{s.cars.length !== 1 ? "es" : ""}</span>}
                    <StatusPill status={s.status} />
                    <span style={{ color: G, fontSize: 16 }}>{expanded === s.id ? "−" : "+"}</span>
                  </div>
                </div>
                {expanded === s.id && (
                  <div style={{ background: D3, border: `1px solid ${BR}`, borderTop: "none", borderRadius: "0 0 6px 6px", padding: 18 }} className="fade">
                    {s.cars.length === 0
                      ? <p style={{ fontSize: 13, color: TM, textAlign: "center", padding: "14px 0" }}>Our team is actively sourcing matches. You'll hear from us within 24–72 hours.</p>
                      : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 12 }}>
                        {s.cars.map((car) => <CarCard key={car.id} car={car} onRemove={() => {}} />)}
                      </div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MESSAGES */}
      {page === "messages" && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "50px 24px" }}>
          <Badge label="Messages" />
          <h2 className="serif" style={{ fontSize: 32, color: "#F2EFE4", margin: "14px 0 28px" }}>Your conversations</h2>
          {mySearches.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: "center" }}><p style={{ color: TM, fontSize: 13 }}>Submit a search to start a conversation with your concierge.</p></div>
          ) : (
            <div style={{ display: "flex", height: 520, border: `1px solid ${BR}`, borderRadius: 6, overflow: "hidden" }}>
              <div style={{ width: 240, flexShrink: 0, borderRight: `1px solid ${BR}`, overflowY: "auto", background: D3 }}>
                {mySearches.map((s) => {
                  const last = (s.messages || []).slice(-1)[0];
                  const active = activeMsgId === s.id;
                  return (
                    <div key={s.id} onClick={() => setActiveMsgId(s.id)} style={{ padding: "13px 15px", borderBottom: "1px solid rgba(255,255,255,.04)", cursor: "pointer", background: active ? "rgba(201,168,76,.07)" : "transparent", borderLeft: `2px solid ${active ? G : "transparent"}` }}>
                      <div style={{ fontWeight: 500, fontSize: 13, color: "#E0DDD5", marginBottom: 3 }}>{s.spec.make} {s.spec.model || ""}</div>
                      <div style={{ fontSize: 11, color: TD, marginBottom: 3 }}>{s.spec.budget || "TBC"}</div>
                      {last && <div style={{ fontSize: 12, color: TM, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{last.text}</div>}
                    </div>
                  );
                })}
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                {activeMsgId ? (
                  <MessageThread search={mySearches.find((s) => s.id === activeMsgId)} userId={user.id} isAdmin={false} onSend={onSendMessage} />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: TD, fontSize: 13 }}>Select a conversation</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PRICING */}
      {page === "pricing" && (
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "50px 24px", textAlign: "center" }}>
          <Badge label="Plans" /><h2 className="serif" style={{ fontSize: 32, color: "#F2EFE4", margin: "14px 0 10px" }}>Simple, upfront pricing</h2><Divider />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18, maxWidth: 720, margin: "0 auto" }}>
            {[{ id: "Explorer", price: "£100", sub: "10 searches · Pay once", features: ["10 search credits", "Nationwide sourcing", "48hr turnaround", "3 shortlisted matches", "Email support"] }, { id: "Unlimited", price: "£250/mo", sub: "Cancel anytime", features: ["Unlimited search credits", "Priority 24hr turnaround", "5+ shortlisted matches", "Dedicated account manager", "Purchase negotiation support", "Priority support"] }].map((p) => {
              const isCurrent = user.plan === p.id;
              return (
                <div key={p.id} className="card" style={{ padding: 28, textAlign: "left", border: isCurrent ? `2px solid ${G}` : undefined, position: "relative" }}>
                  {isCurrent && <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: G, color: D0, fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", padding: "3px 12px", borderRadius: 2 }}>Your Plan</div>}
                  <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: isCurrent ? G : TD, marginBottom: 12 }}>{p.id}</div>
                  <div className="serif" style={{ fontSize: 36, fontWeight: 600, color: "#F2EFE4", marginBottom: 4 }}>{p.price}</div>
                  <div style={{ fontSize: 12, color: TM, marginBottom: 20 }}>{p.sub}</div>
                  {p.features.map((f) => <div key={f} style={{ display: "flex", gap: 9, marginBottom: 9, fontSize: 13, color: "#CCC" }}><span style={{ color: G }}>✓</span>{f}</div>)}
                  {!isCurrent && <button className="btn-ghost" style={{ width: "100%", marginTop: 18 }}>Upgrade</button>}
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 11, color: TD, marginTop: 26 }}>All plans include our No-Find, No-Fee guarantee.</p>
        </div>
      )}

      {/* SUPPORT */}
      {page === "support" && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 24px" }}>
          <Badge label="Support" /><h2 className="serif" style={{ fontSize: 32, color: "#F2EFE4", margin: "14px 0 6px" }}>We're here to help</h2>
          <p style={{ color: TM, marginBottom: 40, fontSize: 13 }}>Browse our FAQ or chat with our AI concierge.</p>
          <div style={{ marginBottom: 44 }}>
            <div style={{ fontSize: 11, color: TD, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>FAQ</div>
            {FAQS.map((f, i) => (
              <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,.06)", padding: "14px 0" }}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ fontSize: 14, color: "#E0DDD5", fontWeight: 500 }}>{f.q}</span>
                  <span style={{ color: G, fontSize: 18, flexShrink: 0 }}>{faqOpen === i ? "−" : "+"}</span>
                </button>
                {faqOpen === i && <p style={{ fontSize: 13, color: TM, lineHeight: 1.7, marginTop: 10 }} className="fade">{f.a}</p>}
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, color: TD, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>AI Concierge Chat</div>
            <div style={{ minHeight: 160, marginBottom: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {chatLog.map((m, i) => (
                <div key={i} style={{ background: m.from === "user" ? "rgba(201,168,76,.12)" : D4, border: `1px solid ${m.from === "user" ? "rgba(201,168,76,.28)" : BR}`, borderRadius: m.from === "user" ? "10px 10px 2px 10px" : "10px 10px 10px 2px", padding: "10px 14px", fontSize: 13, color: "#DDD", maxWidth: "76%", alignSelf: m.from === "user" ? "flex-end" : "flex-start", lineHeight: 1.5 }}>{m.text}</div>
              ))}
              {chatLoading && <div style={{ background: D4, border: `1px solid ${BR}`, borderRadius: "10px 10px 10px 2px", padding: "10px 14px", fontSize: 13, color: TD, maxWidth: "76%", alignSelf: "flex-start" }}>Typing…</div>}
            </div>
            <div style={{ display: "flex", gap: 9 }}>
              <input className="inp" value={chatMsg} onChange={(e) => setChatMsg(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") sendChat(); }} placeholder="Ask anything…" disabled={chatLoading} style={{ flex: 1 }} />
              <button className="btn-gold" style={{ padding: "10px 16px" }} onClick={sendChat} disabled={chatLoading}>{chatLoading ? "…" : "Send"}</button>
            </div>
          </div>
        </div>
      )}

      <footer style={{ borderTop: `1px solid ${BR}`, padding: "24px", textAlign: "center", marginTop: 40 }}>
        <div className="serif" style={{ fontSize: 16, color: G, marginBottom: 4 }}>FindMySpec</div>
        <p style={{ fontSize: 11, color: TD }}>© 2026 FindMySpec Ltd · hello@findmyspec.co.uk</p>
      </footer>
    </div>
  );
}

// ─── ADMIN APP ────────────────────────────────────────────────────────────────
function AdminApp({ searches, setSearches, accounts, onLogout, notify, onSendMessage }) {
  const [tab, setTab] = useState("inbox");
  const [sel, setSel] = useState(null);
  const [pane, setPane] = useState("detail");
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [nc, setNc] = useState({ make: "", model: "", year: "", miles: "", price: "", colour: "", dealer: "" });

  const selS = searches.find((s) => s.id === sel);

  const updateStatus = (id, status) => { setSearches((s) => s.map((x) => x.id === id ? { ...x, status } : x)); notify(`Status updated to ${status}`); };
  const removeCar = (sid, cid) => setSearches((s) => s.map((x) => x.id === sid ? { ...x, cars: x.cars.filter((c) => c.id !== cid) } : x));

  function addCar() {
    if (!nc.make || !nc.model) return;
    const car = { ...nc, id: Date.now(), img: `https://picsum.photos/seed/${Math.random().toString(36).slice(2)}/400/260` };
    setSearches((s) => s.map((x) => x.id === sel ? { ...x, cars: [...x.cars, car] } : x));
    setNc({ make: "", model: "", year: "", miles: "", price: "", colour: "", dealer: "" });
    setAddModal(false); notify("Car added to shortlist");
  }

  function saveNote() {
    if (!noteText.trim()) return;
    const note = { text: noteText.trim(), date: nowTs() };
    setSearches((s) => s.map((x) => x.id === sel ? { ...x, notes: [...x.notes, note] } : x));
    setNoteText(""); setNoteModal(false); notify("Note saved");
  }

  const filtered = searches.filter((s) => (filter === "All" || s.status === filter) && (s.client.toLowerCase().includes(q.toLowerCase()) || s.spec.make.toLowerCase().includes(q.toLowerCase()) || (s.spec.model || "").toLowerCase().includes(q.toLowerCase())));
  const stats = { total: searches.length, incoming: searches.filter((s) => s.status === "Incoming").length, searching: searches.filter((s) => s.status === "Searching").length, shortlisted: searches.filter((s) => s.status === "Shortlisted").length, complete: searches.filter((s) => s.status === "Complete").length };

  return (
    <div style={{ background: D0, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ background: D2, borderBottom: `1px solid ${BR}`, padding: "0 20px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="serif" style={{ fontSize: 18, color: G, fontWeight: 600 }}>FindMySpec</span>
          <span style={{ fontSize: 10, color: TD, letterSpacing: ".13em", textTransform: "uppercase" }}>Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#5DCAA5" }} />
          <span style={{ fontSize: 12, color: TM }}>{searches.length} searches</span>
          <button className="btn-ghost" style={{ padding: "5px 12px", fontSize: 11 }} onClick={onLogout}>Sign out</button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{ width: 185, background: D2, borderRight: `1px solid ${BR}`, padding: "14px 10px", flexShrink: 0, display: "flex", flexDirection: "column", gap: 3 }}>
          {[["inbox", "◈", "Inbox"], ["clients", "◉", "Clients"], ["stats", "◇", "Overview"]].map(([id, ic, lb]) => (
            <button key={id} className={`sdb${tab === id ? " on" : ""}`} onClick={() => { setTab(id); setSel(null); }}><span style={{ fontSize: 13 }}>{ic}</span>{lb}</button>
          ))}
          <div style={{ marginTop: "auto", paddingTop: 14, borderTop: `1px solid ${BR}` }}>
            <div style={{ fontSize: 10, color: TD, letterSpacing: ".08em", textTransform: "uppercase", padding: "0 12px", marginBottom: 7 }}>Live counts</div>
            {[["Incoming", stats.incoming, "#E8C97A"], ["Searching", stats.searching, "#7BC8F6"], ["Shortlisted", stats.shortlisted, "#5DCAA5"]].map(([l, n, c]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "4px 12px", fontSize: 12 }}><span style={{ color: TM }}>{l}</span><span style={{ color: c, fontWeight: 600 }}>{n}</span></div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", display: "flex", minWidth: 0 }}>

          {/* INBOX */}
          {tab === "inbox" && (
            <div style={{ display: "flex", flex: 1, minWidth: 0 }}>
              {/* List */}
              <div style={{ width: selS ? 300 : "100%", flexShrink: 0, borderRight: selS ? `1px solid ${BR}` : "none", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "11px 12px", borderBottom: `1px solid ${BR}`, flexShrink: 0, display: "flex", flexDirection: "column", gap: 7 }}>
                  <input className="inp" placeholder="Search client or car…" value={q} onChange={(e) => setQ(e.target.value)} />
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {["All", ...STATUSES].map((s) => (
                      <button key={s} onClick={() => setFilter(s)} style={{ background: filter === s ? "rgba(201,168,76,.14)" : "transparent", color: filter === s ? G : TM, border: `1px solid ${filter === s ? G : "rgba(255,255,255,.07)"}`, borderRadius: 3, padding: "3px 8px", fontSize: 11, cursor: "pointer" }}>{s}</button>
                    ))}
                  </div>
                </div>
                <div style={{ overflowY: "auto", flex: 1 }}>
                  {filtered.map((s) => (
                    <div key={s.id} className={`irow${sel === s.id ? " on" : ""}`} onClick={() => { setSel(s.id); setPane("detail"); }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                        <span style={{ fontWeight: 500, fontSize: 13, color: "#E0DDD5" }}>{s.client}</span>
                        <StatusPill status={s.status} />
                      </div>
                      <div style={{ fontSize: 12, color: TM, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.spec.make} {s.spec.model || ""} · {s.spec.budget || "TBC"}</div>
                      <div style={{ fontSize: 11, color: TD, marginTop: 2 }}>{s.submitted} · {s.plan}</div>
                    </div>
                  ))}
                  {filtered.length === 0 && <div style={{ padding: 28, textAlign: "center", color: TM, fontSize: 13 }}>No results.</div>}
                </div>
              </div>

              {/* Detail */}
              {selS && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                  {/* Pane tabs */}
                  <div style={{ display: "flex", borderBottom: `1px solid ${BR}`, flexShrink: 0 }}>
                    {[["detail", "Details"], ["thread", `Messages${selS.messages?.length ? ` (${selS.messages.length})` : ""}`]].map(([id, lb]) => (
                      <button key={id} onClick={() => setPane(id)} style={{ background: "none", border: "none", padding: "12px 20px", fontSize: 13, cursor: "pointer", color: pane === id ? G : TM, borderBottom: `2px solid ${pane === id ? G : "transparent"}`, fontFamily: "'Inter',sans-serif" }}>{lb}</button>
                    ))}
                  </div>

                  {pane === "detail" && (
                    <div style={{ flex: 1, overflowY: "auto", padding: 20 }} className="fade">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                        <div>
                          <div style={{ fontSize: 10, color: TD, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 5 }}>Search #{selS.id}</div>
                          <h2 className="serif" style={{ fontSize: 22, color: "#F2EFE4", marginBottom: 3 }}>{selS.client}</h2>
                          <div style={{ fontSize: 13, color: G }}>{selS.email}</div>
                          <div style={{ fontSize: 12, color: TM, marginTop: 2 }}>{selS.plan} · {selS.submitted}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                          <select className="inp sel" value={selS.status} onChange={(e) => updateStatus(selS.id, e.target.value)} style={{ width: "auto", fontSize: 12, padding: "8px 28px 8px 10px" }}>
                            {STATUSES.map((s) => <option key={s} style={{ background: D4 }}>{s}</option>)}
                          </select>
                          <button className="btn-ghost" style={{ padding: "7px 13px", fontSize: 12 }} onClick={() => setNoteModal(true)}>+ Note</button>
                        </div>
                      </div>

                      {/* Spec */}
                      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
                        <div style={{ fontSize: 10, color: TD, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 11 }}>Client spec</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 10, marginBottom: 12 }}>
                          {[["Make", selS.spec.make], ["Model", selS.spec.model], ["Budget", selS.spec.budget], ["Year", selS.spec.year], ["Mileage", selS.spec.mileage], ["Colour", selS.spec.colour]].map(([l, v]) => (
                            <div key={l}><div style={{ fontSize: 10, color: TD, marginBottom: 2, letterSpacing: ".06em", textTransform: "uppercase" }}>{l}</div><div style={{ fontSize: 13, color: "#DDD", fontWeight: 500 }}>{v || "—"}</div></div>
                          ))}
                        </div>
                        {selS.spec.notes && <div style={{ fontSize: 12, color: TM, fontStyle: "italic", borderTop: "1px solid rgba(255,255,255,.05)", paddingTop: 10 }}>"{selS.spec.notes}"</div>}
                      </div>

                      {/* Notes */}
                      {selS.notes?.length > 0 && (
                        <div className="card" style={{ padding: 14, marginBottom: 16 }}>
                          <div style={{ fontSize: 10, color: TD, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>Internal notes</div>
                          {selS.notes.map((n, i) => <div key={i} style={{ fontSize: 13, color: TM, padding: "8px 0", borderBottom: i < selS.notes.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none" }}><span style={{ color: TD, fontSize: 11, marginRight: 8 }}>{n.date}</span>{n.text}</div>)}
                        </div>
                      )}

                      {/* Cars */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div style={{ fontSize: 10, color: TD, letterSpacing: ".1em", textTransform: "uppercase" }}>Shortlisted ({selS.cars.length})</div>
                        <button className="btn-gold" style={{ padding: "7px 14px", fontSize: 12 }} onClick={() => setAddModal(true)}>+ Add Car</button>
                      </div>
                      {selS.cars.length === 0
                        ? <div className="card" style={{ padding: 24, textAlign: "center" }}><p style={{ fontSize: 13, color: TM, marginBottom: 12 }}>No cars added yet.</p><button className="btn-ghost" onClick={() => setAddModal(true)}>+ Add first car</button></div>
                        : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 12 }}>{selS.cars.map((car) => <CarCard key={car.id} car={car} onRemove={() => removeCar(selS.id, car.id)} />)}</div>}

                      {selS.cars.length > 0 && (
                        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${BR}`, display: "flex", gap: 9, flexWrap: "wrap" }}>
                          <button className="btn-gold" onClick={() => updateStatus(selS.id, "Shortlisted")}>Mark Shortlisted</button>
                          <button className="btn-ghost" onClick={() => updateStatus(selS.id, "Complete")}>Mark Complete</button>
                        </div>
                      )}
                    </div>
                  )}

                  {pane === "thread" && (
                    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                      <MessageThread search={selS} userId="admin" isAdmin={true} onSend={onSendMessage} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* CLIENTS */}
          {tab === "clients" && (
            <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
              <h2 className="serif" style={{ fontSize: 26, color: "#F2EFE4", marginBottom: 18 }}>All Clients</h2>
              <div style={{ display: "grid", gap: 10 }}>
                {accounts.filter((a) => a.role === "client").map((a) => {
                  const cs = searches.filter((s) => s.clientId === a.id);
                  return (
                    <div key={a.id} className="card" style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <Avt text={a.avatar || mkInitials(a.name)} size={36} />
                          <div>
                            <div style={{ fontWeight: 500, fontSize: 13 }}>{a.name}</div>
                            <div style={{ fontSize: 12, color: TM }}>{a.email}</div>
                            <div style={{ fontSize: 11, color: TD, marginTop: 2 }}>Joined {a.joined || "Recently"} · {a.plan} plan</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
                          <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: TD, textTransform: "uppercase", letterSpacing: ".06em" }}>Searches</div><div className="serif" style={{ fontSize: 16, color: G, fontWeight: 600, marginTop: 2 }}>{cs.length}</div></div>
                          <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: TD, textTransform: "uppercase", letterSpacing: ".06em" }}>Cars</div><div className="serif" style={{ fontSize: 16, color: "#DDD", marginTop: 2 }}>{cs.reduce((x, s) => x + s.cars.length, 0)}</div></div>
                          <button className="btn-ghost" style={{ fontSize: 12, padding: "6px 14px" }} onClick={() => { setTab("inbox"); setSel(cs[0]?.id); }}>Open →</button>
                        </div>
                      </div>
                      {a.onboarding && (
                        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,.05)", display: "flex", gap: 20, flexWrap: "wrap" }}>
                          {[["Buyer type", a.onboarding.buyerType], ["Budget", a.onboarding.budget], ["Makes", (a.onboarding.makes || []).join(", ") || "—"]].map(([l, v]) => (
                            <div key={l}><div style={{ fontSize: 10, color: TD, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2 }}>{l}</div><div style={{ fontSize: 12, color: "#CCC" }}>{v}</div></div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STATS */}
          {tab === "stats" && (
            <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
              <h2 className="serif" style={{ fontSize: 26, color: "#F2EFE4", marginBottom: 18 }}>Overview</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 12, marginBottom: 26 }}>
                {[["Total", stats.total, G], ["Incoming", stats.incoming, "#E8C97A"], ["Searching", stats.searching, "#7BC8F6"], ["Shortlisted", stats.shortlisted, "#5DCAA5"], ["Complete", stats.complete, "#888"]].map(([l, n, c]) => (
                  <div key={l} style={{ background: D3, border: `1px solid ${BR}`, borderRadius: 6, padding: "16px 18px" }}>
                    <div className="serif" style={{ fontSize: 28, color: c, fontWeight: 600 }}>{n}</div>
                    <div style={{ fontSize: 10, color: TM, letterSpacing: ".07em", textTransform: "uppercase", marginTop: 3 }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 10, color: TD, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 11 }}>All searches</div>
              <div className="card" style={{ overflow: "hidden" }}>
                {searches.slice().reverse().map((s, i) => (
                  <div key={s.id} style={{ padding: "12px 16px", borderBottom: i < searches.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", cursor: "pointer" }} onClick={() => { setTab("inbox"); setSel(s.id); }}>
                    <div><span style={{ fontWeight: 500, fontSize: 13 }}>{s.client}</span><span style={{ fontSize: 12, color: TM, marginLeft: 10 }}>{s.spec.make} {s.spec.model || ""}</span></div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ fontSize: 11, color: TD }}>{s.submitted}</span><StatusPill status={s.status} /></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Car Modal */}
      {addModal && (
        <div className="overlay" onClick={() => setAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "17px 20px", borderBottom: `1px solid ${BR}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 className="serif" style={{ fontSize: 20, color: "#F2EFE4" }}>Add car to shortlist</h3>
              <button onClick={() => setAddModal(false)} style={{ background: "none", border: "none", color: TM, fontSize: 22, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
              {[["Make", "make", "e.g. Porsche"], ["Model", "model", "e.g. 911 GTS"], ["Year", "year", "e.g. 2021"], ["Mileage", "miles", "e.g. 18,400"], ["Price", "price", "e.g. £98,500"], ["Colour", "colour", "e.g. Chalk White"], ["Dealer / Source", "dealer", "e.g. Porsche Centre Leeds"]].map(([l, k, ph]) => (
                <div key={k} style={{ gridColumn: k === "dealer" ? "1/-1" : "auto" }}>
                  <Lbl>{l}</Lbl>
                  <input className="inp" placeholder={ph} value={nc[k]} onChange={(e) => { const v = e.target.value; setNc((p) => ({ ...p, [k]: v })); }} />
                </div>
              ))}
            </div>
            <div style={{ padding: "13px 20px", borderTop: `1px solid ${BR}`, display: "flex", gap: 9, justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setAddModal(false)}>Cancel</button>
              <button className="btn-gold" onClick={addCar}>Add to Shortlist</button>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {noteModal && (
        <div className="overlay" onClick={() => setNoteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "17px 20px", borderBottom: `1px solid ${BR}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 className="serif" style={{ fontSize: 20, color: "#F2EFE4" }}>Internal note</h3>
              <button onClick={() => setNoteModal(false)} style={{ background: "none", border: "none", color: TM, fontSize: 22, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: 20 }}>
              <textarea className="inp" rows={4} placeholder="Visible to admin only…" value={noteText} onChange={(e) => setNoteText(e.target.value)} style={{ resize: "vertical" }} />
            </div>
            <div style={{ padding: "13px 20px", borderTop: `1px solid ${BR}`, display: "flex", gap: 9, justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setNoteModal(false)}>Cancel</button>
              <button className="btn-gold" onClick={saveNote}>Save Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState(SEED_ACCOUNTS);
  const [searches, setSearches] = useState(SEED_SEARCHES);
  const [toast, setToast] = useState(null);

  const notify = (msg) => setToast(msg);
  const sendMessage = (searchId, message) => setSearches((p) => p.map((s) => s.id === searchId ? { ...s, messages: [...(s.messages || []), message] } : s));

  return (
    <div>
      <style>{css}</style>
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      {screen === "landing"    && <Landing onLogin={() => setScreen("login")} onSignup={() => setScreen("onboarding")} />}
      {screen === "login"      && <LoginPage accounts={accounts} onLogin={(u) => { setUser(u); setScreen("app"); }} onBack={() => setScreen("landing")} onSignup={() => setScreen("onboarding")} />}
      {screen === "onboarding" && <Onboarding onComplete={(u) => { setAccounts((p) => [...p, u]); setUser(u); setScreen("app"); notify(`Welcome, ${u.name.split(" ")[0]}!`); }} />}
      {screen === "app" && user?.role === "admin"  && <AdminApp  searches={searches} setSearches={setSearches} accounts={accounts} onLogout={() => { setUser(null); setScreen("landing"); }} notify={notify} onSendMessage={sendMessage} />}
      {screen === "app" && user?.role === "client" && <ClientApp user={user} searches={searches} setSearches={setSearches} onLogout={() => { setUser(null); setScreen("landing"); }} notify={notify} onSendMessage={sendMessage} />}
    </div>
  );
}
