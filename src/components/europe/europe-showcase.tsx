"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { type Messages } from "@/lib/i18n/locales";
import {
  ArrowRight, Shield, Scale, Clock, AlertTriangle, FileText,
  MessageSquare, CheckCircle, XCircle, Globe, Lock, TrendingUp,
  Users, Briefcase, Gavel, MapPin, Building2,
} from "lucide-react";

interface EuropeShowcaseProps {
  t: Messages["europe"];
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};
const stagger = (delay: number) => ({ ...fadeUp, transition: { duration: 0.6, delay } });

/* ================================================================ */
const challengeIcons = [FileText, AlertTriangle, Scale, Clock];
const moduleIcons = [MessageSquare, Scale, FileText, CheckCircle, Building2];
const moduleColors = ["from-blue-500 to-blue-600", "from-indigo-500 to-indigo-600", "from-violet-500 to-violet-600", "from-emerald-500 to-emerald-600", "from-amber-500 to-amber-600"];
const pillarIcons = [Globe, Lock, TrendingUp, Building2];
const useCaseIcons = [Gavel, AlertTriangle, Users, Briefcase];
const useCaseColors = ["from-blue-500 to-blue-600", "from-red-500 to-red-600", "from-emerald-500 to-emerald-600", "from-violet-500 to-violet-600"];

/* ================================================================ */

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        animate(count, value, { duration: 2, ease: "easeOut" });
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [count, value]);
  return (
    <span ref={ref} className="text-4xl font-bold text-slate-900 sm:text-5xl">
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
}

/* ================================================================ */

export function EuropeShowcase({ t }: EuropeShowcaseProps) {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-violet-50/30">
        <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(99,102,241,0.15) 1px, transparent 0)", backgroundSize: "48px 48px" }} />
        <div className="pointer-events-none absolute inset-0">
          <div className="hero-glow-1 absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-200/40 blur-3xl" />
          <div className="hero-glow-2 absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-violet-200/30 blur-3xl" />
        </div>
        <div className="relative mx-auto flex min-h-[90vh] max-w-5xl flex-col items-center justify-center px-6 py-32 text-center">
          <motion.div {...stagger(0)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-5 py-2 text-sm font-medium text-blue-700 shadow-sm backdrop-blur-sm">
              <Globe className="h-4 w-4" />{t.heroBadge}
            </span>
          </motion.div>
          <motion.h1 {...stagger(0.15)} className="mt-10 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            {t.heroTitle}
          </motion.h1>
          <motion.p {...stagger(0.25)} className="mt-4 text-lg font-medium tracking-wide text-slate-500 sm:text-xl">
            {t.heroSubtitle}
          </motion.p>
          <div className="mt-12 flex flex-col gap-4">
            {t.visionLines.map((line, i) => (
              <motion.p key={i} {...stagger(0.4 + i * 0.15)} className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">{line}</motion.p>
            ))}
          </div>
          <motion.div {...stagger(0.9)} className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
            <a href="#problem" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]">
              {t.heroCta}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.98]">
              {t.heroCtaSecondary}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <motion.div {...stagger(0)} className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-red-500">{t.problemLabel}</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t.problemTitle}</h2>
          </motion.div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.challenges.map((c, i) => { const Icon = challengeIcons[i]; return (
              <motion.div key={i} {...stagger(0.1 + i * 0.1)} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{c.desc}</p>
              </motion.div>
            ); })}
          </div>
          <motion.div {...stagger(0.6)} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {t.consequences.map((c) => (
              <span key={c} className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                <XCircle className="h-3 w-3" />{c}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="bg-gradient-to-b from-slate-50/80 to-white px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <motion.div {...stagger(0)} className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">{t.solutionLabel}</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t.solutionTitle}</h2>
          </motion.div>
          <motion.div {...stagger(0.2)} className="mx-auto mt-16 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-xl shadow-blue-500/20">
            <Shield className="h-10 w-10 text-white" />
          </motion.div>
          <motion.p {...stagger(0.3)} className="mt-3 text-center text-sm font-bold text-slate-900">FID Copilot</motion.p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {t.solutionModules.map((label, i) => { const Icon = moduleIcons[i]; return (
              <motion.div key={i} {...stagger(0.3 + i * 0.08)} className="flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${moduleColors[i]} text-white`}><Icon className="h-5 w-5" /></div>
                <span className="text-center text-xs font-semibold text-slate-700">{label}</span>
              </motion.div>
            ); })}
          </div>
          <motion.div {...stagger(0.7)} className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-400">
            {t.solutionFlow.map((step, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="font-medium text-slate-600">{step}</span>
                {i < t.solutionFlow.length - 1 && <ArrowRight className="h-3 w-3" />}
              </span>
            ))}
          </motion.div>
          <motion.p {...stagger(0.8)} className="mt-6 text-center text-base text-slate-500">{t.solutionPhrase}</motion.p>
        </div>
      </section>

      {/* INNOVATION (dark) */}
      <section className="relative overflow-hidden bg-slate-900 px-6 py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-blue-600/8 blur-3xl" />
          <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-violet-600/8 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl">
          <motion.div {...stagger(0)} className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-400">{t.innovationLabel}</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{t.innovationTitle}</h2>
          </motion.div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            <motion.div {...stagger(0.15)} className="rounded-2xl border border-slate-800 bg-slate-800/30 p-6">
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-500">{t.genericLabel}</h3>
              <div className="flex flex-col gap-3">
                {t.comparisons.map((c) => (
                  <div key={c.generic} className="flex items-start gap-2.5">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />
                    <span className="text-sm text-slate-500">{c.generic}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div {...stagger(0.3)} className="rounded-2xl border border-blue-500/30 bg-blue-950/30 p-6 ring-1 ring-blue-500/10">
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-blue-400">{t.copilotLabel}</h3>
              <div className="flex flex-col gap-3">
                {t.comparisons.map((c) => (
                  <div key={c.copilot} className="flex items-start gap-2.5">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                    <span className="text-sm text-blue-100">{c.copilot}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ALIGNMENT */}
      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <motion.div {...stagger(0)} className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">{t.alignmentLabel}</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t.alignmentTitle}</h2>
          </motion.div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.pillars.map((p, i) => { const Icon = pillarIcons[i]; return (
              <motion.div key={i} {...stagger(0.1 + i * 0.1)} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{p.desc}</p>
              </motion.div>
            ); })}
          </div>
          <motion.p {...stagger(0.6)} className="mt-10 text-center text-base italic text-slate-500">{t.alignmentPhrase}</motion.p>
        </div>
      </section>

      {/* IMPACT */}
      <section className="bg-slate-50 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <motion.div {...stagger(0)} className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">{t.impactLabel}</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t.impactTitle}</h2>
          </motion.div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.impacts.map((kpi, i) => (
              <motion.div key={i} {...stagger(0.1 + i * 0.1)} className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm">
                <div className="flex items-baseline gap-0.5">
                  {kpi.prefix && <span className="text-lg font-medium text-slate-400">{kpi.prefix}</span>}
                  <AnimatedCounter value={kpi.value} suffix={kpi.suffix} />
                </div>
                <p className="mt-3 text-sm text-slate-500">{kpi.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <motion.div {...stagger(0)} className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">{t.useCasesLabel}</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t.useCasesTitle}</h2>
          </motion.div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {t.useCases.map((uc, i) => { const Icon = useCaseIcons[i]; return (
              <motion.div key={i} {...stagger(0.1 + i * 0.1)} whileHover={{ y: -3 }} className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${useCaseColors[i]} text-white`}><Icon className="h-5 w-5" /></div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{uc.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">{uc.desc}</p>
                </div>
              </motion.div>
            ); })}
          </div>
          <motion.p {...stagger(0.6)} className="mt-8 text-center text-base text-slate-500">{t.useCasesPhrase}</motion.p>
        </div>
      </section>

      {/* DEPLOYMENT (dark) */}
      <section className="relative overflow-hidden bg-slate-900 px-6 py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-0 h-[300px] w-[300px] rounded-full bg-blue-600/8 blur-3xl" />
          <div className="absolute -right-40 bottom-0 h-[300px] w-[300px] rounded-full bg-violet-600/8 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl">
          <motion.div {...stagger(0)} className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-400">{t.deployLabel}</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{t.deployTitle}</h2>
          </motion.div>
          <div className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-0">
            {t.deployCountries.map((step, i) => (
              <motion.div key={i} {...stagger(0.2 + i * 0.2)} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 ${step.status === "active" ? "border-blue-400 bg-blue-500/20 text-blue-400" : "border-slate-700 bg-slate-800/50 text-slate-500"}`}>
                    <MapPin className="h-6 w-6" />
                  </div>
                  <span className={`mt-3 text-sm font-semibold ${step.status === "active" ? "text-white" : "text-slate-500"}`}>{step.country}</span>
                  <span className={`mt-1 text-xs ${step.status === "active" ? "text-blue-400" : "text-slate-600"}`}>{step.statusLabel}</span>
                </div>
                {i < t.deployCountries.length - 1 && <div className="mx-4 hidden h-0.5 w-12 bg-gradient-to-r from-slate-700 to-slate-800 sm:block" />}
              </motion.div>
            ))}
          </div>
          <motion.p {...stagger(0.9)} className="mt-12 text-center text-base text-slate-400">{t.deployPhrase}</motion.p>
        </div>
      </section>

      {/* VISION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 px-6 py-28 sm:py-36">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-violet-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div {...stagger(0)}>
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-200">{t.visionLabel}</span>
          </motion.div>
          <motion.h2 {...stagger(0.15)} className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">{t.visionTitle}</motion.h2>
          <motion.p {...stagger(0.3)} className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-blue-100">{t.visionText}</motion.p>
          <motion.div {...stagger(0.5)} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="mailto:info@conceptus.be?subject=FID Copilot — Partnership" className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-700 shadow-lg transition-all hover:scale-[1.02] hover:bg-blue-50 hover:shadow-xl active:scale-[0.98]">
              {t.visionCta}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.98]">
              {t.visionCtaSecondary}
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
