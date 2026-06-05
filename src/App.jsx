/**
 * Asliya Recruitment — Single-File Landing Page
 * Stack: React (Vite) + Inline Styles (no Tailwind required)
 * Fonts: Syne + DM Sans via Google Fonts (add to index.html or import below)
 *
 * Usage:
 *   1. Copy this file into src/
 *   2. In index.html <head>, add:
 *      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap" rel="stylesheet">
 *   3. In src/main.jsx: import App from './AsliyaRecruitment'
 *   4. Place your logo image at: public/logo.png  (or update logoSrc below)
 */

import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser"; // npm install @emailjs/browser

// ─── EMAILJS CONFIG — replace with your actual keys from emailjs.com ──────────
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || "service_xxxxxxx";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_xxxxxxx";
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || "xxxxxxxxxxxxxxx";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  blue:       "#154895",
  blueDeep:   "#0d2d5e",
  blueDark:   "#081A35",
  blueLight:  "#1e5dbc",
  red:        "#e62224",
  redDark:    "#bf1a1c",
  light:      "#F8FAFC",
  white:      "#ffffff",
  textDark:   "#0a1628",
  textMid:    "#1e3a5f",
  textGray:   "#64748B",
  textLight:  "rgba(255,255,255,0.75)",
  border:     "rgba(21,72,149,0.12)",
  glassBg:    "rgba(255,255,255,0.07)",
  glassBorder:"rgba(255,255,255,0.13)",
};

const font = {
  heading: "'Syne', Georgia, serif",
  body:    "'DM Sans', 'Helvetica Neue', sans-serif",
};

// ─── UPDATE THIS PATH to your actual logo ─────────────────────────────────────
const logoSrc = "/logo.png"; // e.g. public/logo.png → "/logo.png"

// ─── GLOBAL KEYFRAMES (injected once) ─────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: ${font.body}; background: #fff; color: ${T.textDark}; overflow-x: hidden; }
    ::selection { background: ${T.blue}; color: #fff; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: ${T.blueDark}; }
    ::-webkit-scrollbar-thumb { background: ${T.blue}; border-radius: 3px; }
    input, textarea { font-family: ${font.body}; }

    @keyframes floatA { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-28px) scale(1.06)} }
    @keyframes floatB { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(6deg)} }
    @keyframes floatC { 0%,100%{transform:translate(0,0)} 50%{transform:translate(16px,-22px)} }
    @keyframes pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.5)} }
    @keyframes gradMove {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes slideUp   { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideLeft { from{opacity:0;transform:translateX(-36px)} to{opacity:1;transform:translateX(0)} }
    @keyframes slideRight{ from{opacity:0;transform:translateX(36px)}  to{opacity:1;transform:translateX(0)} }
    @keyframes countUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spin      { to{transform:rotate(360deg)} }

    .anim-up    { opacity:0; }
    .anim-left  { opacity:0; }
    .anim-right { opacity:0; }
    .anim-up.visible    { animation: slideUp    0.65s cubic-bezier(.22,.68,0,1.2) forwards; }
    .anim-left.visible  { animation: slideLeft  0.65s cubic-bezier(.22,.68,0,1.2) forwards; }
    .anim-right.visible { animation: slideRight 0.65s cubic-bezier(.22,.68,0,1.2) forwards; }

    .d1{animation-delay:.08s} .d2{animation-delay:.18s}
    .d3{animation-delay:.28s} .d4{animation-delay:.38s}

    /* Nav link underline */
    .nav-link { position:relative; color:rgba(255,255,255,0.82); text-decoration:none;
                font-size:.92rem; font-weight:500; padding-bottom:2px; transition:color .2s; }
    .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0;
                       height:2px; background:${T.red}; transition:width .25s; }
    .nav-link:hover  { color:#fff; }
    .nav-link:hover::after { width:100%; }

    /* Service card hover */
    .svc-card { transition: transform .3s, box-shadow .3s, border-color .3s; cursor:default; }
    .svc-card:hover { transform:translateY(-8px);
                      box-shadow: 0 24px 60px rgba(21,72,149,.18);
                      border-color: ${T.blue} !important; }
    .svc-card:hover .svc-icon { background: ${T.blue} !important; color:#fff !important; }
    .svc-card:hover .svc-arrow { opacity:1 !important; transform:translateX(0) !important; }

    /* Why card hover */
    .why-card { transition: transform .3s, background .3s, border-color .3s; }
    .why-card:hover { transform:translateY(-6px);
                      background: rgba(255,255,255,0.13) !important;
                      border-color: rgba(255,255,255,.28) !important; }

    /* Contact detail hover */
    .cdet { transition: transform .2s, box-shadow .2s; }
    .cdet:hover { transform:translateY(-2px);
                  box-shadow: 0 8px 24px rgba(21,72,149,.12); }

    /* Social icon */
    .soc-btn { transition: background .2s, color .2s, transform .2s, border-color .2s; }
    .soc-btn:hover { background:${T.red} !important; color:#fff !important;
                     border-color:${T.red} !important; transform:translateY(-3px); }

    /* Footer link */
    .foot-link { color:rgba(255,255,255,.65); text-decoration:none;
                 font-size:.9rem; transition:color .2s; }
    .foot-link:hover { color:#fff; }

    /* Button micro */
    .btn-red  { transition: background .2s, transform .2s, box-shadow .2s; }
    .btn-red:hover  { background:${T.redDark} !important;
                      transform:translateY(-2px);
                      box-shadow:0 10px 30px rgba(230,34,36,.4) !important; }
    .btn-out  { transition: background .2s, border-color .2s, transform .2s; }
    .btn-out:hover  { background:rgba(255,255,255,.12) !important;
                      border-color:#fff !important; transform:translateY(-2px); }
    .btn-blue { transition: background .2s, transform .2s, box-shadow .2s; }
    .btn-blue:hover { background:${T.blueDeep} !important; transform:translateY(-2px);
                      box-shadow:0 10px 30px rgba(21,72,149,.4) !important; }
    .submit-btn { transition:transform .2s, box-shadow .2s; }
    .submit-btn:hover { transform:translateY(-2px);
                        box-shadow:0 10px 30px rgba(21,72,149,.35) !important; }

    /* Form inputs */
    .form-inp { transition: border-color .2s, box-shadow .2s; }
    .form-inp:focus { outline:none;
                      border-color:${T.blue} !important;
                      box-shadow:0 0 0 4px rgba(21,72,149,.1) !important; }
    .form-inp::placeholder { color:#9ca3af; }

    @media(max-width:768px){
      .hide-mobile { display:none !important; }
      .mob-col { flex-direction:column !important; }
    }
    @media(max-width:900px){
      .two-col  { grid-template-columns:1fr !important; }
      .four-col { grid-template-columns:1fr 1fr !important; }
    }
    @media(max-width:560px){
      .four-col { grid-template-columns:1fr !important; }
      .stat-row { flex-wrap:wrap; gap:1.5rem !important; }
      .hero-btns{ flex-direction:column !important; }
      .hero-btns a { width:100% !important; justify-content:center; }
    }
  `}</style>
);

// ─── HOOK: scroll animation ───────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".anim-up, .anim-left, .anim-right");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ─── HOOK: navbar scroll ──────────────────────────────────────────────────────
function useNavScroll() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return scrolled;
}

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 22, stroke = "currentColor", sw = 1.8, fill = "none", viewBox = "0 0 24 24", style }) => (
  <svg width={size} height={size} viewBox={viewBox} fill={fill} stroke={stroke} strokeWidth={sw}
       strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d} />
  </svg>
);

const ArrowRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const ChevDown = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
const SectionLabel = ({ children, dark }) => (
  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
    <div style={{ width:28, height:2.5, background:T.red, borderRadius:2 }} />
    <span style={{
      fontFamily: font.body,
      fontSize: ".75rem",
      fontWeight: 700,
      letterSpacing: "2.5px",
      textTransform: "uppercase",
      color: dark ? "#ff7577" : T.red,
    }}>{children}</span>
  </div>
);

const SectionTitle = ({ children, dark, center }) => (
  <h2 style={{
    fontFamily: font.heading,
    fontSize: "clamp(1.9rem,4vw,2.9rem)",
    fontWeight: 800,
    color: dark ? "#fff" : T.textDark,
    lineHeight: 1.12,
    letterSpacing: "-0.02em",
    textAlign: center ? "center" : "left",
  }}>{children}</h2>
);

const SectionSub = ({ children, dark, center }) => (
  <p style={{
    fontFamily: font.body,
    fontSize: "1rem",
    color: dark ? "rgba(255,255,255,.65)" : T.textGray,
    lineHeight: 1.75,
    marginTop: 14,
    maxWidth: 600,
    textAlign: center ? "center" : "left",
  }}>{children}</p>
);

// ═══════════════════════════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════════════════════════
function Navbar() {
  const scrolled = useNavScroll();
  const [open, setOpen] = useState(false);

  const navStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 200,
    padding: "0 5%",
    transition: "background .4s, box-shadow .4s, backdrop-filter .4s",
    background: scrolled ? "rgba(8,26,53,0.94)" : "transparent",
    backdropFilter: scrolled ? "blur(20px)" : "none",
    boxShadow: scrolled ? "0 2px 40px rgba(0,0,0,.3)" : "none",
  };

  const links = ["Home","About","Services","Contact"];

  return (
    <nav style={navStyle}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", height:72 }}>

        {/* LOGO AREA */}
       <a
  href="#home"
  style={{
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  }}
>
  <div
    style={{
      width: 90,
      height: 90,
      overflow: "hidden",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <img
      src={logoSrc}
      alt="Asliya Recruitment Logo"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
  </div>
</a>

        {/* Desktop Links */}
        <ul className="hide-mobile" style={{ display:"flex", alignItems:"center", gap:"2.2rem", listStyle:"none" }}>
          {links.map(l => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a href="#contact" className="btn-red hide-mobile" style={{
          background: T.red,
          color: "#fff",
          padding: ".55rem 1.4rem",
          borderRadius: 8,
          fontFamily: font.body,
          fontWeight: 600,
          fontSize: ".9rem",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
        }}>
          Get In Touch <ArrowRight />
        </a>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            display: "none",
            background: "none",
            border: "1.5px solid rgba(255,255,255,0.25)",
            borderRadius: 8,
            padding: "6px 10px",
            cursor: "pointer",
            flexDirection: "column",
            gap: 5,
          }}
          className="ham-btn"
          aria-label="Toggle menu"
        >
          {[0,1,2].map(i => (
            <span key={i} style={{ display:"block", width:22, height:2, background:"#fff", borderRadius:2,
              transition:"all .3s",
              transform: open && i===0 ? "rotate(45deg) translateY(7px)"
                       : open && i===2 ? "rotate(-45deg) translateY(-7px)"
                       : "none",
              opacity: open && i===1 ? 0 : 1,
            }}/>
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      <div style={{
        maxHeight: open ? 400 : 0,
        overflow: "hidden",
        transition: "max-height .4s ease",
        background: "rgba(8,26,53,0.98)",
        borderTop: open ? "1px solid rgba(255,255,255,.08)" : "none",
      }}>
        <div style={{ padding: "1.2rem 0", display:"flex", flexDirection:"column", gap:"1rem" }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
               style={{ color:"rgba(255,255,255,.85)", textDecoration:"none", fontFamily:font.body,
                        fontWeight:500, fontSize:"1rem", padding:"0 0 0 4px" }}>
              {l}
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="btn-red" style={{
            background:T.red, color:"#fff", padding:".65rem 1.4rem", borderRadius:8,
            fontFamily:font.body, fontWeight:600, fontSize:".95rem", textDecoration:"none",
            display:"inline-flex", alignItems:"center", gap:8, width:"fit-content",
          }}>
            Get In Touch <ArrowRight />
          </a>
        </div>
      </div>

      {/* ham-btn show on mobile via inline media doesn't work in JSX — use a style tag */}
      <style>{`
        @media(max-width:768px){ .ham-btn{ display:flex !important; } }
      `}</style>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════════════════════
function Hero() {
  return (
    <section id="home" style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${T.blueDark} 0%, ${T.blueDeep} 38%, ${T.blue} 72%, #1a3e7a 100%)`,
      backgroundSize: "300% 300%",
      animation: "gradMove 12s ease infinite",
      position: "relative",
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
    }}>
      {/* Grid overlay */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px)," +
          "linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
        backgroundSize: "64px 64px",
      }}/>

      {/* Blobs */}
      {[
        { w:520, h:520, top:"-140px", right:"-120px", anim:"floatA 9s ease-in-out infinite",
          bg:"radial-gradient(circle,rgba(21,72,149,0.55) 0%,transparent 68%)" },
        { w:400, h:400, bottom:"-80px", left:"5%", anim:"floatB 11s ease-in-out infinite",
          bg:"radial-gradient(circle,rgba(230,34,36,0.18) 0%,transparent 68%)" },
        { w:280, h:280, top:"38%", right:"22%", anim:"floatC 14s ease-in-out infinite",
          bg:"radial-gradient(circle,rgba(255,255,255,0.06) 0%,transparent 68%)" },
        { w:200, h:200, top:"12%", left:"32%", anim:"floatA 7s ease-in-out infinite reverse",
          bg:"radial-gradient(circle,rgba(230,34,36,0.10) 0%,transparent 68%)" },
      ].map((b,i) => (
        <div key={i} style={{ position:"absolute", width:b.w, height:b.h, top:b.top, bottom:b.bottom,
                              left:b.left, right:b.right, background:b.bg, animation:b.anim,
                              pointerEvents:"none" }}/>
      ))}

      {/* Decorative ring */}
      <div style={{
        position:"absolute", right:"8%", top:"50%", transform:"translateY(-50%)",
        width:340, height:340,
        border:"1.5px solid rgba(255,255,255,0.06)",
        borderRadius:"50%",
        pointerEvents:"none",
      }}>
        <div style={{
          position:"absolute", inset:40,
          border:"1.5px solid rgba(255,255,255,0.06)",
          borderRadius:"50%",
        }}/>
        <div style={{
          position:"absolute", inset:80,
          border:"1.5px solid rgba(255,255,255,0.06)",
          borderRadius:"50%",
        }}/>
      </div>

      {/* Content */}
      <div style={{
        position:"relative", zIndex:2,
        maxWidth:1200, margin:"0 auto",
        padding:"110px 5% 6rem",
        width:"100%",
      }}>
        {/* Badge */}
        <div style={{
          display:"inline-flex", alignItems:"center", gap:9,
          background:"rgba(255,255,255,0.09)",
          border:"1px solid rgba(255,255,255,0.18)",
          padding:".38rem 1rem",
          borderRadius:50,
          marginBottom:"1.8rem",
          backdropFilter:"blur(10px)",
          animation:"slideUp .6s ease both",
        }}>
          <span style={{ width:7, height:7, background:T.red, borderRadius:"50%",
                         animation:"pulse 2s ease-in-out infinite", flexShrink:0 }}/>
          <span style={{ color:"rgba(255,255,255,.88)", fontSize:".8rem", fontFamily:font.body, fontWeight:500 }}>
            Trusted Global Recruitment Partner · Kathmandu, Nepal
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: font.heading,
          fontSize: "clamp(2.6rem,6.5vw,5rem)",
          fontWeight: 800,
          color: "#fff",
          lineHeight: 1.06,
          letterSpacing: "-0.025em",
          marginBottom: "1.4rem",
          animation: "slideUp .65s .1s ease both",
          maxWidth: 780,
        }}>
          Connecting Global<br />
          Talent With{" "}
          <span style={{
            color: T.red,
            display: "inline-block",
            textShadow: "0 0 60px rgba(230,34,36,.4)",
          }}>
            Opportunity
          </span>
        </h1>

        {/* Sub */}
        <p style={{
          fontFamily: font.body,
          fontSize: "clamp(1rem,2vw,1.15rem)",
          color: "rgba(255,255,255,0.72)",
          lineHeight: 1.78,
          maxWidth: 620,
          marginBottom: "2.4rem",
          animation: "slideUp .65s .2s ease both",
          fontWeight: 400,
        }}>
          Asliya Recruitment provides trusted manpower solutions for domestic
          and international hiring across multiple industries — with speed,
          reliability, and professionalism.
        </p>

        {/* CTA Buttons */}
        <div className="hero-btns" style={{ display:"flex", gap:"1rem", flexWrap:"wrap",
                                           animation:"slideUp .65s .3s ease both" }}>
          <a href="#contact" className="btn-red" style={{
            background:T.red, color:"#fff",
            padding:".9rem 2rem", borderRadius:10,
            fontFamily:font.body, fontWeight:600, fontSize:"1rem",
            textDecoration:"none", display:"inline-flex", alignItems:"center", gap:9,
            boxShadow:"0 4px 20px rgba(230,34,36,.35)",
          }}>
            Contact Us <ArrowRight />
          </a>
          <a href="#services" className="btn-out" style={{
            background:"transparent", color:"#fff",
            padding:".9rem 2rem", borderRadius:10,
            fontFamily:font.body, fontWeight:600, fontSize:"1rem",
            textDecoration:"none", display:"inline-flex", alignItems:"center", gap:9,
            border:"2px solid rgba(255,255,255,.32)",
          }}>
            Explore Services <ChevDown />
          </a>
        </div>

        {/* Stats Row */}
        <div className="stat-row" style={{
          display:"flex", gap:"2.8rem", marginTop:"4rem",
          paddingTop:"2.8rem",
          borderTop:"1px solid rgba(255,255,255,0.10)",
          animation:"slideUp .65s .45s ease both",
          flexWrap:"wrap",
        }}>
          {[
            { num:"5,000+", label:"Candidates Placed" },
            { num:"200+",   label:"Partner Companies" },
            { num:"15+",    label:"Countries Served" },
            { num:"98%",    label:"Client Satisfaction" },
          ].map((s, i, arr) => (
            <div key={s.label} style={{ display:"flex", alignItems:"stretch", gap:"2.8rem" }}>
              <div>
                <div style={{
                  fontFamily:font.heading, fontSize:"clamp(1.6rem,3vw,2.2rem)",
                  fontWeight:800, color:"#fff", lineHeight:1,
                }}>
                  {s.num}
                </div>
                <div style={{
                  fontFamily:font.body, fontSize:".83rem",
                  color:"rgba(255,255,255,0.58)", marginTop:5, fontWeight:400,
                }}>
                  {s.label}
                </div>
              </div>
              {i < arr.length - 1 && (
                <div style={{
                  width:1, background:"rgba(255,255,255,0.15)",
                  alignSelf:"stretch", flexShrink:0,
                }} className="hide-mobile"/>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ABOUT
// ═══════════════════════════════════════════════════════════════════════════════
function About() {
  return (
    <section id="about" style={{ padding:"7rem 5%", background:"#fff" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div className="two-col" style={{
          display:"grid",
          gridTemplateColumns:"1fr 1fr",
          gap:"5rem",
          alignItems:"center",
        }}>

          {/* Visual */}
          <div className="anim-left" style={{ position:"relative" }}>
            {/* Main card */}
            <div style={{
              background:`linear-gradient(135deg, #e8f0fd 0%, #cdddf8 60%, #b8ccf5 100%)`,
              borderRadius:24,
              aspectRatio:"4/3",
              display:"flex", alignItems:"center", justifyContent:"center",
              overflow:"hidden", position:"relative",
              border:`1.5px solid rgba(21,72,149,0.12)`,
            }}>
              {/* LOGO DISPLAY in About illustration */}
              <div style={{ textAlign:"center" }}>
                <div style={{
                  width:100, height:100, margin:"0 auto 16px",
                  background:"rgba(255,255,255,0.7)",
                  borderRadius:20,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:"0 8px 32px rgba(21,72,149,0.15)",
                  overflow:"hidden",
                }}>
                  <img src={logoSrc} alt="Logo" style={{ width:"80%", objectFit:"contain" }}
                    onError={e => {
                      e.target.style.display="none";
                      e.target.parentNode.innerHTML=
                        `<span style="font-family:${font.heading};font-weight:800;font-size:1.4rem;color:${T.blue}">AR</span>`;
                    }}
                  />
                </div>
                <div style={{ fontFamily:font.heading, fontWeight:800, fontSize:"1.1rem", color:T.blue }}>
                  Asliya Recruitment
                </div>
                <div style={{ fontFamily:font.body, fontSize:".82rem", color:T.textGray, marginTop:4 }}>
                  Global Talent Solutions
                </div>
              </div>

              {/* Decorative dots */}
              {[...Array(12)].map((_,i) => (
                <div key={i} style={{
                  position:"absolute",
                  width:5, height:5,
                  background:`rgba(21,72,149,${0.1 + (i%4)*0.06})`,
                  borderRadius:"50%",
                  top:`${15+Math.floor(i/4)*30}%`,
                  left:`${8+(i%4)*25}%`,
                }}/>
              ))}
            </div>

            {/* Float card — Years */}
            <div style={{
              position:"absolute", bottom:-22, right:-22,
              background:"#fff",
              borderRadius:18,
              padding:"1.1rem 1.5rem",
              boxShadow:"0 20px 60px rgba(0,0,0,.13)",
              border:`1px solid rgba(21,72,149,0.1)`,
              minWidth:140,
            }}>
              <div style={{ fontFamily:font.heading, fontWeight:800, fontSize:"2rem", color:T.blue, lineHeight:1 }}>10+</div>
              <div style={{ fontFamily:font.body, fontSize:".78rem", color:T.textGray, marginTop:4 }}>Years of Excellence</div>
            </div>

            {/* Float card — Verified */}
            <div style={{
              position:"absolute", top:-20, left:-20,
              background:T.red,
              borderRadius:14,
              padding:".8rem 1.2rem",
              boxShadow:"0 10px 30px rgba(230,34,36,.3)",
            }}>
              <div style={{ fontFamily:font.heading, fontWeight:800, fontSize:"1.3rem", color:"#fff", lineHeight:1 }}>5K+</div>
              <div style={{ fontFamily:font.body, fontSize:".72rem", color:"rgba(255,255,255,.8)", marginTop:3 }}>Verified Hires</div>
            </div>
          </div>

          {/* Text */}
          <div className="anim-right">
            <SectionLabel>About Us</SectionLabel>
            <SectionTitle>
              Trusted Recruitment,{" "}
              <span style={{ color:T.blue }}>Global Reach</span>
            </SectionTitle>
            <SectionSub>
              We are a professional recruitment and manpower agency dedicated
              to connecting skilled professionals with global employers. We
              specialize in ethical, efficient, and reliable hiring solutions
              for companies worldwide.
            </SectionSub>

            <div style={{ display:"flex", flexDirection:"column", gap:"1rem", marginTop:"2rem" }}>
              {[
                {
                  icon:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                  title:"Ethical Recruitment Practices",
                  desc:"Full transparency and integrity across every hiring process, domestic and international.",
                },
                {
                  icon:"M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
                  title:"Global Network & Reach",
                  desc:"Spanning Asia, Middle East, and Europe — connecting talent with top employers worldwide.",
                },
                {
                  icon:"M13 10V3L4 14h7v7l9-11h-7z",
                  title:"Fast & Reliable Hiring",
                  desc:"Qualified candidates delivered quickly without compromising quality or legal compliance.",
                },
              ].map(f => (
                <div key={f.title} style={{
                  display:"flex", alignItems:"flex-start", gap:"1rem",
                  padding:"1rem 1.2rem",
                  background:T.light,
                  borderRadius:14,
                  border:`1px solid ${T.border}`,
                }}>
                  <div style={{
                    width:44, height:44, minWidth:44,
                    background:`linear-gradient(135deg,rgba(21,72,149,0.14),rgba(21,72,149,0.06))`,
                    borderRadius:11,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:T.blue,
                  }}>
                    <Icon d={f.icon} size={20} />
                  </div>
                  <div>
                    <div style={{ fontFamily:font.heading, fontWeight:700, fontSize:".95rem", color:T.textDark }}>{f.title}</div>
                    <div style={{ fontFamily:font.body, fontSize:".86rem", color:T.textGray, marginTop:3, lineHeight:1.65 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════════════════════════════════
function Services() {
  const cards = [
    {
      icon:"M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      title:"Domestic Recruitment",
      desc:"Connecting skilled local talent with top-tier employers across Nepal's banking, hospitality, IT, and manufacturing sectors.",
      accent:T.blue,
    },
    {
      icon:"M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      title:"Overseas Recruitment",
      desc:"Legal and ethical international placements across Qatar, UAE, Saudi Arabia, Malaysia, Japan, and other key global markets.",
      accent:T.red,
    },
    {
      icon:"M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      title:"Executive Search",
      desc:"Identifying senior leadership and C-suite executives for organizations that demand strategic talent at the highest level.",
      accent:T.blue,
    },
    {
      icon:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
      title:"Mass Hiring Solutions",
      desc:"Scalable bulk recruitment for large-scale projects, seasonal demands, and rapid workforce expansion programs.",
      accent:T.red,
    },
  ];

  return (
    <section id="services" style={{ padding:"7rem 5%", background:T.light }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div className="anim-up" style={{ textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", marginBottom:"4rem" }}>
          <SectionLabel>What We Offer</SectionLabel>
          <SectionTitle center>
            Our <span style={{ color:T.blue }}>Services</span>
          </SectionTitle>
          <SectionSub center>
            Comprehensive recruitment solutions tailored to meet the demands
            of businesses across every sector and geography.
          </SectionSub>
        </div>

        <div className="four-col" style={{
          display:"grid",
          gridTemplateColumns:"repeat(4,1fr)",
          gap:"1.4rem",
        }}>
          {cards.map((c,i) => (
            <div key={c.title} className={`svc-card anim-up d${i+1}`} style={{
              background:"#fff",
              borderRadius:20,
              padding:"2rem 1.8rem",
              border:`1.5px solid ${T.border}`,
              position:"relative",
              overflow:"hidden",
            }}>
              {/* Top accent line */}
              <div style={{
                position:"absolute", top:0, left:0, right:0, height:3,
                background:`linear-gradient(90deg,${c.accent},transparent)`,
                borderRadius:"20px 20px 0 0",
              }}/>

              <div className="svc-icon" style={{
                width:50, height:50,
                background:`linear-gradient(135deg,rgba(21,72,149,0.12),rgba(21,72,149,0.06))`,
                borderRadius:13,
                display:"flex", alignItems:"center", justifyContent:"center",
                marginBottom:"1.3rem",
                color:T.blue,
                transition:"background .3s, color .3s",
              }}>
                <Icon d={c.icon} size={22} />
              </div>

              <h3 style={{
                fontFamily:font.heading,
                fontSize:"1.05rem",
                fontWeight:700,
                color:T.textDark,
                marginBottom:".6rem",
              }}>{c.title}</h3>

              <p style={{
                fontFamily:font.body,
                fontSize:".87rem",
                color:T.textGray,
                lineHeight:1.68,
              }}>{c.desc}</p>

              <div className="svc-arrow" style={{
                display:"inline-flex", alignItems:"center", gap:5,
                color:T.blue,
                fontFamily:font.body, fontWeight:600, fontSize:".84rem",
                marginTop:"1.1rem",
                opacity:0,
                transform:"translateX(-6px)",
                transition:"opacity .3s, transform .3s",
              }}>
                Learn More <ArrowRight size={14}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WHY CHOOSE US
// ═══════════════════════════════════════════════════════════════════════════════
function WhyChooseUs() {
  const stats = [
    {
      num:"5,000", unit:"+",
      icon:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      title:"Verified Candidates",
      desc:"Thoroughly screened and background-verified professionals ready for immediate deployment.",
    },
    {
      num:"72", unit:"hrs",
      icon:"M13 10V3L4 14h7v7l9-11h-7z",
      title:"Fast Turnaround",
      desc:"From job posting to shortlisting — our streamlined process delivers results in record time.",
    },
    {
      num:"10", unit:"+",
      icon:"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      title:"Years of Expertise",
      desc:"Deep sector knowledge spanning construction, hospitality, healthcare, IT, and manufacturing.",
    },
    {
      num:"15", unit:"+",
      icon:"M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
      title:"Countries Served",
      desc:"Active partnerships across Asia, Middle East, and Europe with full legal compliance.",
    },
  ];

  return (
    <section id="why" style={{
      padding:"7rem 5%",
      background:`linear-gradient(135deg,${T.blueDark} 0%,${T.blueDeep} 45%,${T.blue} 100%)`,
      position:"relative",
      overflow:"hidden",
    }}>
      {/* Decorative blobs */}
      <div style={{ position:"absolute",width:480,height:480,top:"-120px",right:"-80px",
        background:"radial-gradient(circle,rgba(230,34,36,0.12) 0%,transparent 68%)",pointerEvents:"none" }}/>
      <div style={{ position:"absolute",width:360,height:360,bottom:"-80px",left:"5%",
        background:"radial-gradient(circle,rgba(21,72,149,0.35) 0%,transparent 68%)",pointerEvents:"none" }}/>

      <div style={{ maxWidth:1200, margin:"0 auto", position:"relative", zIndex:1 }}>
        <div className="anim-up" style={{ textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", marginBottom:"4rem" }}>
          <SectionLabel dark>Why Choose Us</SectionLabel>
          <SectionTitle dark center>
            Numbers That Speak{" "}
            <span style={{ color:T.red }}>For Themselves</span>
          </SectionTitle>
          <SectionSub dark center>
            Our track record of excellence drives trust, speed, and results
            across every engagement with clients worldwide.
          </SectionSub>
        </div>

        <div className="four-col" style={{
          display:"grid",
          gridTemplateColumns:"repeat(4,1fr)",
          gap:"1.4rem",
        }}>
          {stats.map((s,i) => (
            <div key={s.title} className={`why-card anim-up d${i+1}`} style={{
              background:T.glassBg,
              backdropFilter:"blur(20px)",
              border:`1px solid ${T.glassBorder}`,
              borderRadius:20,
              padding:"2rem 1.8rem",
            }}>
              <div style={{
                width:42, height:42,
                background:"rgba(230,34,36,0.18)",
                borderRadius:11,
                display:"flex", alignItems:"center", justifyContent:"center",
                marginBottom:"1.2rem",
                color:"#ff7577",
              }}>
                <Icon d={s.icon} size={20}/>
              </div>
              <div style={{
                fontFamily:font.heading,
                fontWeight:800,
                fontSize:"clamp(2rem,4vw,2.8rem)",
                color:"#fff",
                lineHeight:1,
                marginBottom:".6rem",
              }}>
                {s.num}
                <span style={{ color:T.red, fontSize:"1.3rem" }}>{s.unit}</span>
              </div>
              <h3 style={{
                fontFamily:font.heading,
                fontSize:"1rem",
                fontWeight:700,
                color:"#fff",
                marginBottom:".5rem",
              }}>{s.title}</h3>
              <p style={{
                fontFamily:font.body,
                fontSize:".85rem",
                color:"rgba(255,255,255,0.6)",
                lineHeight:1.65,
              }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT
// ═══════════════════════════════════════════════════════════════════════════════
function Contact() {
  const [form, setForm]       = useState({ fname:"", lname:"", email:"", subject:"", message:"" });
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError]     = useState("");
  const formRef               = useRef();

  const handle = e => {
    setError("");
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const submit = () => {
    // Basic validation
    if (!form.fname.trim()) { setError("Please enter your first name."); return; }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) { setError("Please enter a valid email address."); return; }
    if (!form.message.trim()) { setError("Please enter a message."); return; }

    setSending(true);
    setError("");

    // EmailJS sends the form data to your email
    emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_name:  `${form.fname.trim()} ${form.lname.trim()}`,
        from_email: form.email.trim(),
        subject:    form.subject.trim() || "(No subject)",
        message:    form.message.trim(),
        reply_to:   form.email.trim(),
      },
      EMAILJS_PUBLIC_KEY
    )
    .then(() => {
      setSending(false);
      setSent(true);
      setForm({ fname:"", lname:"", email:"", subject:"", message:"" });
      setTimeout(() => setSent(false), 6000);
    })
    .catch((err) => {
      setSending(false);
      console.error("EmailJS error:", err);
      setError("Something went wrong. Please try again or email us directly.");
    });
  };

  const inputStyle = {
    width:"100%",
    background:"#fff",
    border:`1.5px solid ${T.border}`,
    borderRadius:10,
    padding:".78rem 1rem",
    fontFamily:font.body,
    fontSize:".94rem",
    color:T.textDark,
    outline:"none",
  };

  const details = [
    {
      icon:"M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
      label:"Phone", value:"+977-XXXXXXXXX",
    },
    {
      icon:"M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      label:"Email", value:"info@asliyarecruitment.com",
    },
    {
      icon:"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
      label:"Location", value:"Kathmandu, Nepal",
    },
  ];

  return (
    <section id="contact" style={{ padding:"7rem 5%", background:"#fff" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div className="anim-up" style={{ textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", marginBottom:"4.5rem" }}>
          <SectionLabel>Get In Touch</SectionLabel>
          <SectionTitle center>
            Let's Start <span style={{ color:T.blue }}>Hiring Together</span>
          </SectionTitle>
          <SectionSub center>
            Ready to find the right talent? Our team will get back to you
            within 24 hours.
          </SectionSub>
        </div>

        <div className="two-col" style={{
          display:"grid",
          gridTemplateColumns:"1fr 1.45fr",
          gap:"4.5rem",
          alignItems:"start",
        }}>

          {/* Info panel */}
          <div className="anim-left">
            <div style={{
              background:`linear-gradient(160deg,${T.blueDark} 0%,${T.blue} 100%)`,
              borderRadius:24,
              padding:"2.5rem 2rem",
              position:"relative",
              overflow:"hidden",
            }}>
              {/* Logo in contact card */}
              <div style={{
                display:"flex", alignItems:"center", gap:10, marginBottom:"1.6rem",
                paddingBottom:"1.4rem",
                borderBottom:"1px solid rgba(255,255,255,0.12)",
              }}>
                <div style={{
                  width:40, height:40,
                  background:"rgba(255,255,255,0.12)",
                  borderRadius:10,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  overflow:"hidden",
                }}>
                  <img src={logoSrc} alt="" style={{ width:"80%", objectFit:"contain" }}
                    onError={e => {
                      e.target.style.display="none";
                      e.target.parentNode.innerHTML=
                        `<span style="font-family:${font.heading};font-weight:800;font-size:.85rem;color:#fff">AR</span>`;
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontFamily:font.heading, fontWeight:800, fontSize:"1rem", color:"#fff" }}>Asliya Recruitment</div>
                  <div style={{ fontFamily:font.body, fontSize:".75rem", color:"rgba(255,255,255,.55)" }}>Kathmandu, Nepal</div>
                </div>
              </div>

              <h3 style={{
                fontFamily:font.heading, fontWeight:800,
                fontSize:"1.3rem", color:"#fff", marginBottom:".7rem",
              }}>We'd Love to Hear From You</h3>
              <p style={{
                fontFamily:font.body, fontSize:".88rem",
                color:"rgba(255,255,255,.65)", lineHeight:1.72, marginBottom:"1.8rem",
              }}>
                Whether you're a company looking for talent or a professional
                seeking opportunity — we're here to help every step of the way.
              </p>

              <div style={{ display:"flex", flexDirection:"column", gap:".9rem" }}>
                {details.map(d => (
                  <div key={d.label} className="cdet" style={{
                    display:"flex", alignItems:"flex-start", gap:"1rem",
                    background:"rgba(255,255,255,0.08)",
                    borderRadius:14,
                    padding:"1rem 1.1rem",
                    border:"1px solid rgba(255,255,255,0.1)",
                  }}>
                    <div style={{
                      width:40, height:40, minWidth:40,
                      background:T.red,
                      borderRadius:9,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color:"#fff",
                    }}>
                      <Icon d={d.icon} size={18}/>
                    </div>
                    <div>
                      <div style={{
                        fontFamily:font.body, fontSize:".73rem", fontWeight:700,
                        color:"rgba(255,255,255,.5)", textTransform:"uppercase",
                        letterSpacing:"1.2px", marginBottom:3,
                      }}>{d.label}</div>
                      <div style={{ fontFamily:font.body, fontSize:".92rem", fontWeight:500, color:"#fff" }}>
                        {d.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decorative blob */}
              <div style={{
                position:"absolute", bottom:-60, right:-60,
                width:200, height:200,
                background:"radial-gradient(circle,rgba(230,34,36,0.2) 0%,transparent 70%)",
                pointerEvents:"none",
              }}/>
            </div>
          </div>

          {/* Form */}
          <div className="anim-right" style={{
            background:T.light,
            borderRadius:24,
            padding:"2.5rem",
            border:`1.5px solid ${T.border}`,
          }}>
            <h3 style={{ fontFamily:font.heading, fontWeight:800, fontSize:"1.25rem", color:T.textDark, marginBottom:"1.6rem" }}>
              Send Us a Message
            </h3>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1.1rem" }}>
              {[{n:"fname",p:"First Name",label:"First Name"},{n:"lname",p:"Last Name",label:"Last Name"}].map(f=>(
                <div key={f.n}>
                  <label style={{ fontFamily:font.body, fontSize:".83rem", fontWeight:600, color:T.textDark, display:"block", marginBottom:6 }}>{f.label}</label>
                  <input name={f.n} value={form[f.n]} onChange={handle}
                    placeholder={f.p} className="form-inp" style={inputStyle}/>
                </div>
              ))}
            </div>

            {[
              {n:"email", label:"Email Address", type:"email", p:"you@company.com"},
              {n:"subject", label:"Subject", type:"text", p:"How can we help?"},
            ].map(f => (
              <div key={f.n} style={{ marginBottom:"1.1rem" }}>
                <label style={{ fontFamily:font.body, fontSize:".83rem", fontWeight:600, color:T.textDark, display:"block", marginBottom:6 }}>{f.label}</label>
                <input name={f.n} value={form[f.n]} onChange={handle} type={f.type}
                  placeholder={f.p} className="form-inp" style={inputStyle}/>
              </div>
            ))}

            <div style={{ marginBottom:"1.4rem" }}>
              <label style={{ fontFamily:font.body, fontSize:".83rem", fontWeight:600, color:T.textDark, display:"block", marginBottom:6 }}>Message</label>
              <textarea name="message" value={form.message} onChange={handle}
                placeholder="Tell us about your hiring needs..."
                className="form-inp"
                style={{ ...inputStyle, minHeight:120, resize:"vertical" }}
              />
            </div>

            {error && (
              <div style={{
                background:"#fef2f2", border:"1.5px solid #fca5a5",
                borderRadius:10, padding:".9rem 1rem",
                fontFamily:font.body, fontWeight:500, fontSize:".88rem",
                color:"#991b1b", marginBottom:"1rem",
                display:"flex", alignItems:"flex-start", gap:9,
              }}>
                <span style={{ fontSize:"1rem", flexShrink:0 }}>⚠</span>
                {error}
              </div>
            )}

            {sent && (
              <div style={{
                background:"#f0fdf4", border:"1.5px solid #86efac",
                borderRadius:10, padding:".9rem 1rem",
                fontFamily:font.body, fontWeight:500, fontSize:".9rem",
                color:"#166534", marginBottom:"1rem",
                display:"flex", alignItems:"center", gap:9,
              }}>
                <span style={{ fontSize:"1.1rem" }}>✓</span>
                Message sent! We'll respond within 24 hours.
              </div>
            )}

            <button onClick={submit} disabled={sending} className="submit-btn" style={{
              width:"100%",
              background:`linear-gradient(135deg,${T.blue},${T.blueLight})`,
              color:"#fff",
              border:"none",
              padding:"1rem",
              borderRadius:11,
              fontFamily:font.body,
              fontWeight:600,
              fontSize:"1rem",
              cursor:sending?"wait":"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:9,
              opacity:sending?0.75:1,
            }}>
              {sending ? (
                <>
                  <span style={{ width:18,height:18,border:"2px solid rgba(255,255,255,.3)",
                    borderTop:"2px solid #fff",borderRadius:"50%",
                    animation:"spin .7s linear infinite",display:"inline-block" }}/>
                  Sending…
                </>
              ) : (
                <> Send Message <ArrowRight /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════════
function Footer() {
  const quickLinks = ["Home","About","Services","Contact"];
  const services   = ["Domestic Recruitment","Overseas Recruitment","Executive Search","Mass Hiring"];

  const socials = [
    { label:"LinkedIn",
      svg:<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg> },
    { label:"Facebook",
      svg:<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg> },
    { label:"X / Twitter",
      svg:<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
    { label:"Instagram",
      svg:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
  ];

  return (
   <footer style={{ background:T.blueDark, paddingTop:"5rem" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 5%" }}>
        <div style={{
          display:"grid",
          gridTemplateColumns:"2fr 1fr 1fr",
          gap:"3rem",
          marginBottom:"3rem",
          flexWrap:"wrap",
        }} className="three-col">
          {/* Brand */}
          <div>
            {/* Logo in footer */}
            <div
  style={{
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
  }}
>
  <img
    src={logoSrc}
    alt="Asliya Recruitment Logo"
    style={{
      width: 130,
      height: 130,
      objectFit: "contain",
    }}
  />
</div>

            <p style={{
              fontFamily:font.body, fontSize:".88rem",
              color:"rgba(255,255,255,.5)", lineHeight:1.75, maxWidth:300, marginBottom:"1.5rem",
            }}>
              Connecting skilled professionals with global employers through
              ethical, efficient, and reliable recruitment since 2014.
            </p>

            <div style={{ display:"flex", gap:".7rem" }}>
              {socials.map(s => (
                <a key={s.label} href="#" title={s.label} className="soc-btn" style={{
                  width:36, height:36,
                  background:"rgba(255,255,255,0.07)",
                  border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:9,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:"rgba(255,255,255,0.6)",
                  textDecoration:"none",
                }}>
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{
              fontFamily:font.body, fontSize:".78rem", fontWeight:700,
              color:"rgba(255,255,255,.38)", textTransform:"uppercase",
              letterSpacing:"2px", marginBottom:"1.2rem",
            }}>Quick Links</div>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:".7rem" }}>
              {quickLinks.map(l => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`} className="foot-link">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <div style={{
              fontFamily:font.body, fontSize:".78rem", fontWeight:700,
              color:"rgba(255,255,255,.38)", textTransform:"uppercase",
              letterSpacing:"2px", marginBottom:"1.2rem",
            }}>Services</div>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:".7rem" }}>
              {services.map(s => (
                <li key={s}>
                  <a href="#services" className="foot-link">{s}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop:"1px solid rgba(255,255,255,.07)",
          padding:"1.6rem 0",
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between",
          flexWrap:"wrap",
          gap:"1rem",
        }}>
          <p style={{ fontFamily:font.body, fontSize:".82rem", color:"rgba(255,255,255,.35)" }}>
            © {new Date().getFullYear()} Asliya Recruitment. All rights reserved.
          </p>
          <p style={{ fontFamily:font.body, fontSize:".78rem", color:"rgba(255,255,255,.25)" }}>
            Full website coming soon · Kathmandu, Nepal
          </p>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .three-col{ grid-template-columns:1fr !important; gap:2rem !important; }
        }
      `}</style>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP (Main Export)
// ═══════════════════════════════════════════════════════════════════════════════
export default function AsliyaRecruitment() {
  useReveal();

  return (
    <>
      <GlobalStyles />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <WhyChooseUs />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
