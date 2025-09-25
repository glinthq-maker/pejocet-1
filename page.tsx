"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, PhoneCall, MessageSquare, Cpu, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

// Motion helpers
const springSoft = { type: "spring", stiffness: 120, damping: 18, mass: 0.6 } as const;
const fadeInUp = (delay = 0) => ({ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { ...springSoft, delay } } });
const containerStagger = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };

// A11y: Skip link
const SkipToContent: React.FC = () => (
  <a href="#home" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 bg-white text-black rounded-md px-3 py-2 z-[100]">
    Skip to content
  </a>
);

// Scroll progress bar (top)
const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div style={{ scaleX }} className="fixed left-0 right-0 top-0 h-0.5 origin-left z-[60]">
      <div className="h-full w-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
    </motion.div>
  );
};

// Section wrapper
const Section: React.FC<{ id: string; className?: string; children: React.ReactNode }> = ({ id, children, className = "" }) => (
  <section id={id} className={`w-full max-w-6xl mx-auto px-6 scroll-mt-20 ${className}`}>{children}</section>
);

// Logo
const Logo: React.FC = () => (
  <div
    className="flex items-center gap-2 cursor-pointer"
    onClick={() => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })}
    aria-label="Glint AI: go to top"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
    }}
  >
    <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
    <span className="font-semibold tracking-wide text-white">
      Glint <span className="text-cyan-400">AI</span>
    </span>
  </div>
);

// Animated Graph (lazy render)
const AnimatedGraph: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { margin: "-100px" });
  return (
    <div ref={ref} className="aspect-square flex items-center justify-center">
      {isInView && (
        <motion.svg viewBox="0 0 200 200" className="w-72 h-72" aria-hidden>
          <motion.path
            d="M40 140 L40 60 L90 60 L90 140 L140 140"
            stroke="white" strokeOpacity="0.25" strokeWidth="6" fill="none" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeInOut" }}
          />
          {[{ cx: 140, cy: 60, r: 16 }, { cx: 160, cy: 140, r: 10 }, { cx: 100, cy: 170, r: 10 }].map((n, i) => (
            <motion.circle
              key={i} cx={n.cx} cy={n.cy} r={n.r}
              fill={i === 0 ? "#67e8f9" : "transparent"}
              stroke="#67e8f9" strokeWidth={i === 0 ? 0 : 6}
              animate={{ scale: [0.95, 1, 0.95] }}
              transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          {[{ x: 26, y: 46 }, { x: 26, y: 126 }].map((b, i) => (
            <motion.rect
              key={i} x={b.x} y={b.y} width="28" height="28" rx="6"
              stroke="#67e8f9" strokeWidth="6" fill="transparent"
              initial={{ rotate: 0 }} animate={{ rotate: [0, 2, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            />
          ))}
        </motion.svg>
      )}
    </div>
  );
};

// Parallax Glow
const ParallaxGlow: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.25, 0.45]);
  return <motion.div ref={ref} style={{ y, opacity }} className="absolute -inset-8 rounded-full bg-cyan-500/20 blur-3xl" aria-hidden />;
};

// Magnetic Button
const MagneticButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }> = ({ children, className = "", ...props }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 150, damping: 12 });
  const ySpring = useSpring(y, { stiffness: 150, damping: 12 });
  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.2); y.set(dy * 0.2);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.button
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={onMove} onMouseLeave={onLeave}
      className={`rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 shadow hover:shadow-[0_0_24px_rgba(34,211,238,0.35)] transition-shadow focus:outline-none focus:ring-2 focus:ring-cyan-400/60 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

function SolutionCard({ icon, title, subtitle, desc }: { icon: React.ReactNode; title: string; subtitle: string; desc: string }) {
  return (
    <Card className="bg-white/[0.03] border-white/10 rounded-3xl">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3 text-cyan-300">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/20" aria-hidden>
            {icon}
          </span>
          <CardTitle className="text-white/90">{title}</CardTitle>
        </div>
        <p className="text-white/50 text-sm mt-1">{subtitle}</p>
      </CardHeader>
      <CardContent>
        <p className="text-white/70">{desc}</p>
      </CardContent>
    </Card>
  );
}
function Testimonial({ name, role, quote }: { name: string; role: string; quote: string }) {
  return (
    <Card className="bg-white/[0.03] border-white/10 rounded-3xl">
      <CardContent className="p-6">
        <p className="text-white/80">“{quote}”</p>
        <div className="mt-3" aria-label="rating" role="img">⭐⭐⭐⭐⭐</div>
        <div className="mt-3 text-sm text-white/60">{name} — {role}</div>
      </CardContent>
    </Card>
  );
}

// EmailJS (env vars with safe fallback for preview)
function readPublicEnv(key: string): string | undefined {
  if (typeof process !== "undefined" && (process as any).env && (process as any).env[key]) {
    return (process as any).env[key] as string;
  }
  if (typeof window !== "undefined" && (window as any).__env && (window as any).__env[key]) {
    return (window as any).__env[key] as string;
  }
  return undefined;
}
const SERVICE_ID = readPublicEnv("NEXT_PUBLIC_EMAILJS_SERVICE_ID") || "service_sufzstg";
const TEMPLATE_ID = readPublicEnv("NEXT_PUBLIC_EMAILJS_TEMPLATE_ID") || "template_nyc79cx";
const PUBLIC_KEY = readPublicEnv("NEXT_PUBLIC_EMAILJS_PUBLIC_KEY") || "RdrHaEFcbjo__nb-q";

// Consultation Form
const ConsultationForm: React.FC = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const statusHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus("loading");
    try {
      const fd = new FormData(formRef.current);
      const payload = {
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id: PUBLIC_KEY,
        template_params: {
          name: String(fd.get("name") || ""),
          email: String(fd.get("email") || ""),
          company: String(fd.get("company") || ""),
          phone: String(fd.get("phone") || ""),
          message: String(fd.get("message") || ""),
          reply_to: String(fd.get("email") || ""),
        },
      };
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(res.ok ? "success" : "error");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  useEffect(() => {
    if (status !== "idle" && statusHeadingRef.current) {
      statusHeadingRef.current.focus();
    }
  }, [status]);

  if (status === "success") {
    return (
      <Card className="bg-white/[0.05] border-white/10 max-w-2xl mx-auto" aria-live="polite">
        <CardContent className="p-8 text-center">
          <h3 ref={statusHeadingRef} tabIndex={-1} className="text-2xl font-semibold mb-2 text-white">Thank you! ✅</h3>
          <p className="text-white/70">Your consultation request was sent successfully. We’ll reply to you at the email you provided.</p>
        </CardContent>
      </Card>
    );
  }
  if (status === "error") {
    return (
      <Card className="bg-white/[0.05] border-white/10 max-w-2xl mx-auto" aria-live="assertive">
        <CardContent className="p-8 text-center">
          <h3 ref={statusHeadingRef} tabIndex={-1} className="text-2xl font-semibold mb-2 text-white">Error ❌</h3>
          <p className="text-white/70">
            We couldn’t send your request right now. Please try again, or email us directly at <a href="mailto:glinthq@gmail.com" className="underline">glinthq@gmail.com</a>.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/[0.05] border-white/10 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-white">Book a Consultation</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form ref={formRef} onSubmit={handleSubmit} className="grid gap-6" aria-label="Consultation form">
          <label className="sr-only" htmlFor="name">Name</label>
          <input id="name" name="name" autoComplete="name" type="text" required placeholder="Name" className="w-full rounded-xl bg-[#11161c] border border-white/20 p-3 text-white" />

          <label className="sr-only" htmlFor="email">Email</label>
          <input id="email" name="email" autoComplete="email" type="email" required placeholder="Email" className="w-full rounded-xl bg-[#11161c] border border-white/20 p-3 text-white" />

          <label className="sr-only" htmlFor="company">Company</label>
          <input id="company" name="company" autoComplete="organization" type="text" placeholder="Company" className="w-full rounded-xl bg-[#11161c] border border-white/20 p-3 text-white" />

          <label className="sr-only" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" autoComplete="tel" inputMode="tel" type="text" placeholder="Phone" className="w-full rounded-xl bg-[#11161c] border border-white/20 p-3 text-white" />

          <label className="sr-only" htmlFor="message">Message</label>
          <textarea id="message" name="message" placeholder="Message" rows={4} className="w-full rounded-xl bg-[#11161c] border border-white/20 p-3 text-white" />

          <MagneticButton className="text-black" type="submit" aria-label="Submit consultation request">
            {status === "loading" ? "Sending..." : "Submit"}
          </MagneticButton>
        </form>
        <p className="text-white/40 text-xs mt-3">By submitting, you agree we can contact you about your request.</p>
      </CardContent>
    </Card>
  );
};

// Main Page
const GlintAIWebsite: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const headerOffset = 64; // h-16 header
    const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerOffset);
    window.scrollTo({ top: y, behavior: prefersReduced ? "auto" : "smooth" });
  };

  // Scroll spy (center-of-viewport)
  const [active, setActive] = useState<string>("home");
  useEffect(() => {
    const SECTION_IDS = ["home", "about", "solutions", "results", "contact"] as const;
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    let ticking = false;
    const updateActive = () => {
      const viewportCenter = window.scrollY + window.innerHeight / 2;
      let current: string = SECTION_IDS[0];
      for (const sec of sections) {
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        if (viewportCenter >= top && viewportCenter < bottom) {
          current = sec.id;
          break;
        }
        if (viewportCenter >= bottom) current = sec.id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActive();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateActive();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white">
      <ScrollProgress />
      <SkipToContent />
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0b0f14]/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <nav role="navigation" aria-label="Primary" className="hidden md:flex items-center gap-8 text-sm">
            {["home", "about", "solutions", "results", "contact"].map((id) => (
              <button
                key={id}
                aria-current={active === id ? "page" : undefined}
                onClick={() => scrollTo(id)}
                className={`relative transition-colors ${active === id ? "text-white" : "text-white/70 hover:text-white"}`}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
                {active === id && (
                  <motion.span layoutId="active-underline" className="absolute -bottom-1 left-0 right-0 mx-auto h-[2px] w-full bg-cyan-400 rounded-full" transition={{ type: "spring", stiffness: 320, damping: 28 }} />
                )}
              </button>
            ))}
          </nav>
          <MagneticButton onClick={() => scrollTo("contact")}>Book a Consultation</MagneticButton>
        </div>
      </header>

      {/* Hero */}
      <Section id="home" className="pt-20 pb-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div variants={containerStagger} initial="hidden" animate="show">
            <motion.h1 variants={fadeInUp(0)} className="text-4xl md:text-5xl font-semibold leading-tight">
              We help businesses <span className="text-cyan-400">shine</span> through their workflows.
            </motion.h1>
            <motion.p variants={fadeInUp(0.05)} className="mt-5 text-white/70 text-lg">
              AI receptionists and automation assistants that answer calls, handle messages, and capture leads — helping you scale with confidence.
            </motion.p>
            <motion.div variants={fadeInUp(0.1)} className="mt-8 flex gap-4">
              <MagneticButton onClick={() => scrollTo("contact")} aria-label="Scroll to consultation form">
                Book a Consultation <ArrowRight className="ml-2 h-4 w-4" />
              </MagneticButton>
              <Button
                variant="outline"
                className="rounded-2xl border-white/20 bg-white text-black transition-all duration-300 hover:bg-black hover:text-white hover:border-white"
                onClick={() => scrollTo("solutions")}
                aria-label="Discover our solutions"
              >
                Discover Our Solutions
              </Button>
            </motion.div>
            <motion.div variants={fadeInUp(0.15)} className="mt-8 flex items-center gap-6 text-white/60">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cyan-400" aria-hidden />Secure</div>
              <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-cyan-400" aria-hidden />Fast Setup</div>
              <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-cyan-400" aria-hidden />Premium Experience</div>
            </motion.div>
          </motion.div>

          <div className="relative">
            <ParallaxGlow />
            <Card className="relative border-white/10 bg-white/[0.02] rounded-3xl" aria-labelledby="auto-graph-title">
              <CardHeader>
                <CardTitle id="auto-graph-title" className="text-white/90">Automation Graph</CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatedGraph />
                <p className="text-white/60 text-sm mt-2">Elegant, reliable workflows — engineered to convert.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* About */}
      <Section id="about" className="py-20">
        <h2 className="text-3xl font-semibold">About Glint AI</h2>
        <p className="mt-4 text-white/70">
          We empower teams with premium automation that saves time and elevates customer experiences. Our mission is simple: deliver innovation, trust, and reliability so your business can scale with confidence.
        </p>
      </Section>

      {/* Solutions */}
      <Section id="solutions" className="py-20">
        <h2 className="text-3xl font-semibold mb-10">Solutions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: <MessageSquare className="h-5 w-5" />, title: "AI Receptionists", subtitle: "Instagram, WhatsApp, and website assistants", desc: "Human-level chat that answers questions, captures leads, and hands off to your team when needed." },
            { icon: <PhoneCall className="h-5 w-5" />, title: "Voice AI", subtitle: "Natural, callable receptionists", desc: "Book appointments, qualify callers, and route conversations with lifelike voice automation." },
            { icon: <Cpu className="h-5 w-5" />, title: "Lead Engines", subtitle: "Find, chase, and convert", desc: "Outbound AI that identifies prospects, personalizes outreach, and follows up automatically." },
            { icon: <Zap className="h-5 w-5" />, title: "Workflow Automation", subtitle: "Tailored integrations", desc: "Connect your stack end-to-end for seamless operations and premium brand experiences." },
          ].map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} transition={{ ...springSoft, delay: i * 0.05 }} viewport={{ once: true }}>
              <SolutionCard {...s} />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Results */}
      <Section id="results" className="py-20">
        <h2 className="text-3xl font-semibold mb-10">Results</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Aurora Dental Group", role: "Clinic Director", quote: "Our WhatsApp receptionist books after-hours appointments automatically. Revenue is up 23%." },
            { name: "Vela Fitness", role: "Owner", quote: "Voice AI answers calls during peak hours and routes VIPs to staff. Member satisfaction improved." },
            { name: "Northway Motors", role: "GM", quote: "Glint’s lead engine doubled our test-drive bookings in 6 weeks." },
          ].map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} transition={{ ...springSoft, delay: i * 0.05 }} viewport={{ once: true }}>
              <Testimonial {...t} />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" className="py-24">
        <ConsultationForm />
      </Section>

      {/* Floating CTA on mobile */}
      <div className="md:hidden fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none">
        <MagneticButton className="pointer-events-auto shadow-lg" onClick={() => scrollTo("contact")} aria-label="Open consultation form">
          Book a Consultation
        </MagneticButton>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6 items-center">
          <Logo />
          <p className="text-white/60 text-sm">Glint AI empowers businesses to shine through premium AI receptionists and automation assistants.</p>
          <a className="underline-offset-2 hover:underline" href="mailto:glinthq@gmail.com">glinthq@gmail.com</a>
        </div>
      </footer>
    </div>
  );
};

export default GlintAIWebsite;
