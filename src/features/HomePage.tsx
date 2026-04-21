import { useState, useEffect, useRef } from "react";
import scorecard_logo from "../assets/scorecard logo.png";
import rns_logo from "../assets/rns_green.png";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase.ts";
import { useQuery } from "@tanstack/react-query";

const fetchCustomerLogos = async (): Promise<{ courseId: string; logoUrl: string }[]> => {
    const rootRef = ref(storage);
    const root = await listAll(rootRef);
    const results = await Promise.all(
        root.prefixes.map(async (folderRef) => {
            const contents = await listAll(folderRef);
            const logoItem = contents.items.find((item) => item.name.split(".")[0] === "logo");
            if (!logoItem) return null;
            const logoUrl = await getDownloadURL(logoItem);
            return { courseId: folderRef.name, logoUrl };
        })
    );
    return results.filter(Boolean) as { courseId: string; logoUrl: string }[];
};

const useFadeIn = (threshold = 0.15) => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, visible };
};

const FadeIn = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
    const { ref, visible } = useFadeIn();
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
};

const ReferencesSection = ({ title }: { title: string }) => {    const { data: customers = [] } = useQuery({
        queryKey: ["customerLogos"],
        queryFn: fetchCustomerLogos,
        staleTime: Infinity,
        retry: false,
    });

    if (customers.length === 0) return null;

    return (
        <section className="px-6 py-14 bg-gray-50 border-y border-gray-100">
            <div className="max-w-2xl mx-auto text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">{title}</p>
                <div className="flex flex-wrap items-center justify-center gap-10">
                    {customers.map((c) => (
                        <img
                            key={c.courseId}
                            src={c.logoUrl}
                            alt={c.courseId}
                            className="h-12 object-contain opacity-60 hover:grayscale-0 hover:opacity-100 transition"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const content = {
    da: {
        nav: { features: "Funktioner", pricing: "Priser", contact: "Kontakt", lang: "English" },
        hero: {
            badge: "Til fodboldgolf, minigolf & mere",
            title: "Det digitale scorekort til din bane",
            subtitle:
                "Scorecard giver dine gæster et moderne, mobilveneligt scorekort – uden app-download. Resultater samles automatisk i en rangliste.",
        },
        painPoints: [
            "Slut med at printe scorekort",
            "Slut med at tjekke resultater manuelt",
            "Slut med at finde månedens bedste med lommeregner",
            "Slut med tabte sedler og ulæselig håndskrift",
        ],
        features: {
            title: "Alt hvad din bane behøver",
            subtitle: "Enkelt for spillerne. Kraftfuldt for dig som baneoperatør.",
            items: [
                {
                    icon: "📱",
                    title: "Mobilveneligt scorekort",
                    desc: "Spillerne scanner en QR-kode og er i gang på sekunder.",
                },
                {
                    icon: "🏆",
                    title: "Automatisk rangliste",
                    desc: "Scores publiceres direkte til banens rangliste. Alt opgøres automatisk.",
                },
                {
                    icon: "🎯",
                    title: "Dynamisk par",
                    desc: "Vælg dynamisk par, og lad Scorecard udregne par automatisk baseret på de indberettede resultater – perfekt hvis du ikke vil definere par manuelt for hvert hul.",
                },
                {
                    icon: "🎨",
                    title: "Tilpasset til din bane",
                    desc: "Dit logo, dine regler og din baneinformation – alt samlet ét sted.",
                },
            ],
        },
        howItWorks: {
            title: "Sådan virker det",
            steps: [
                { num: "1", title: "Vi opsætter din bane", desc: "Vi indtaster baneinfo, huller og par. Det tager typisk under en dag." },
                { num: "2", title: "Spillerne scanner QR", desc: "Placer QR-koder ved starthullet. Spillerne scanner og er i gang." },
                { num: "3", title: "Scores indberettes live", desc: "Hvert hul registreres undervejs og samles til et endeligt resultat." },
                { num: "4", title: "Ranglisten opdateres", desc: "Resultater publiceres direkte til din banes rangliste." },
            ],
        },
        pricing: {
            title: "Én pris. Alt inkluderet.",
            subtitle: "Ingen skjulte gebyrer. Ingen moduler at betale for. Bare ét simpelt abonnement.",
            yearlyNote: "Eks. moms | Faktureres årligt",
            everythingTitle: "Alt hvad du får:",
            customNote: "🎨 Vi tilpasser applikationen til din bane – dit logo, dine farver, dine regler. Du kommer med input, vi sørger for resten.",
            plans: [
                {
                    name: "Fuld adgang",
                    price: "2.000 kr.",
                    period: "/ år",
                    desc: "Alt er inkluderet fra dag ét – ingen ekstra moduler, ingen overraskelser.",
                    features: [
                        "Mobilvenligt scorekort via QR-kode",
                        "Automatisk rangliste",
                        "Dynamisk par – udregnes automatisk",
                        "Admin dashboard med overblik",
                        "Live TV-visning til events",
                        "Realtidsopdatering af scores",
                        "Opsætning og onboarding",
                        "Løbende support",
                    ],
                    cta: "Kontakt os og kom i gang",
                    highlight: true,
                },
            ],
        },
        references: {
            title: "De bruger allerede Scorecard",
        },
        contact: {
            title: "Interesseret?",
            subtitle: "Skriv til os – vi vender tilbage inden for 24 timer.",
            email: "luu@rnsapps.dk",
            cta: "Send en mail",
        },
        footer: "© 2026 Scorecard. Alle rettigheder forbeholdes.",
    },
    en: {
        nav: { features: "Features", pricing: "Pricing", contact: "Contact", lang: "Dansk" },
        hero: {
            badge: "For footgolf, disc golf & more",
            title: "The digital scorecard for your course",
            subtitle:
                "Scorecard gives your guests a modern, mobile-friendly scorecard – no app download required. Results are collected automatically in a leaderboard.",
        },
        painPoints: [
            "No more printing scorecards",
            "No more checking results manually",
            "No more finding the best score of the month with a calculator",
            "No more lost slips and illegible handwriting",
        ],
        features: {
            title: "Everything your course needs",
            subtitle: "Simple for players. Powerful for you as a course operator.",
            items: [
                {
                    icon: "📱",
                    title: "Mobile-friendly scorecard",
                    desc: "Players scan a QR code and are up and running in seconds. No app. No account.",
                },
                {
                    icon: "🏆",
                    title: "Automatic leaderboard",
                    desc: "Scores are published directly to the course leaderboard. Everything is calculated automatically.",
                },
                {
                    icon: "🎯",
                    title: "Dynamic par",
                    desc: "Choose dynamic par and let Scorecard calculate par automatically based on reported results – ideal if you'd rather not define par manually for each hole.",
                },
                {
                    icon: "🎨",
                    title: "Tailored to your course",
                    desc: "Your logo, your rules, your course info – all in one place.",
                },
            ],
        },
        howItWorks: {
            title: "How it works",
            steps: [
                { num: "1", title: "We set up your course", desc: "We enter course info, holes and par. It typically takes less than a day." },
                { num: "2", title: "Players scan the QR", desc: "Place QR codes at the starting hole. Players scan and start playing." },
                { num: "3", title: "Scores tracked live", desc: "Each hole is registered along the way and compiled into a final result." },
                { num: "4", title: "Leaderboard updated", desc: "Results are published directly to your course leaderboard." },
            ],
        },
        pricing: {
            title: "One price. Everything included.",
            subtitle: "No hidden fees. No extra modules. Just one simple subscription.",
            yearlyNote: "Billed annually",
            everythingTitle: "Everything you get:",
            customNote: "🎨 We tailor the app to your course – your logo, your colours, your rules. You provide input, we take care of the rest.",
            plans: [
                {
                    name: "Full access",
                    price: "DKK 2000",
                    period: "/ year",
                    desc: "Everything included from day one – no extra modules, no surprises.",
                    features: [
                        "Mobile-friendly scorecard via QR code",
                        "Automatic leaderboard",
                        "Dynamic par – calculated automatically",
                        "Admin dashboard",
                        "Live TV display for events",
                        "Real-time score updates",
                        "Setup and onboarding",
                        "Ongoing support",
                    ],
                    cta: "Contact us to get started",
                    highlight: true,
                },
            ],
        },
        contact: {
            title: "Interested?",
            subtitle: "Write to us – we'll get back to you within 24 hours.",
            email: "luu@rnsapps.dk",
            cta: "Send an email",
        },
        references: {
            title: "Already trusted by",
        },
        footer: "© 2026 Scorecard. All rights reserved.",
    },
};

type Lang = "da" | "en";

const HomePage = () => {
    const [lang, setLang] = useState<Lang>("da");
    const t = content[lang];

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans">

            {/* NAV */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center">
                    <img src={rns_logo} alt="Scorecard" className="h-8 object-contain" />
                    <img src={scorecard_logo} alt="Scorecard" className="h-8 object-contain" />
                </div>

                <div className="flex items-center gap-5 text-sm font-medium">
                    <button onClick={() => scrollTo("features")} className="text-gray-600 hover:text-green-700 transition hidden sm:block">{t.nav.features}</button>
                    <button onClick={() => scrollTo("pricing")} className="text-gray-600 hover:text-green-700 transition hidden sm:block">{t.nav.pricing}</button>
                    <button onClick={() => scrollTo("contact")} className="text-gray-600 hover:text-green-700 transition hidden sm:block">{t.nav.contact}</button>
                    <button
                        onClick={() => setLang(lang === "da" ? "en" : "da")}
                        className="text-xs border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-50 transition"
                    >
                        🌐 {t.nav.lang}
                    </button>
                </div>
            </nav>

            {/* HERO */}
            <section className="relative bg-linear-to-br from-green-800 via-green-700 to-emerald-600 text-white px-6 py-24 text-center overflow-hidden">
                {/* decorative blobs */}
                <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

                <span className="inline-block bg-white/15 border border-white/20 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide">
                    {t.hero.badge}
                </span>
                <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight max-w-3xl mx-auto mb-6 drop-shadow-sm">
                    {t.hero.title}
                </h1>
                <p className="text-green-100 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                    {t.hero.subtitle}
                </p>
                <button
                    onClick={() => scrollTo("pricing")}
                    className="inline-block bg-white text-green-800 font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-base"
                >
                    {t.pricing.plans[0].cta} →
                </button>
            </section>

            {/* PAIN POINTS */}
            <FadeIn>
            <section className="px-6 py-10 bg-gray-950 text-white">
                <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {t.painPoints.map((point, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3">
                            <span className="text-emerald-400 font-bold text-xl shrink-0">✓</span>
                            <span className="text-sm font-medium text-gray-200">{point}</span>
                        </div>
                    ))}
                </div>
            </section>
            </FadeIn>

            {/* FEATURES */}
            <section id="features" className="px-6 py-20 max-w-4xl mx-auto">
                <FadeIn>
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">{t.features.title}</h2>
                    <p className="text-gray-500 text-lg">{t.features.subtitle}</p>
                </div>
                </FadeIn>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {t.features.items.map((f, i) => (
                        <FadeIn key={i} delay={i * 80}>
                        <div className="group relative h-full bg-white border border-gray-100 rounded-3xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-2xl mb-4 group-hover:bg-green-100 transition">
                                {f.icon}
                            </div>
                            <h3 className="font-bold text-xl mb-2">{f.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{f.desc}</p>
                        </div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-linear-to-br from-green-50 to-emerald-50 px-6 py-20">
                <FadeIn>
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-extrabold">{t.howItWorks.title}</h2>
                </div>
                </FadeIn>
                <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {t.howItWorks.steps.map((s, i) => (
                        <FadeIn key={i} delay={i * 80}>
                        <div className="bg-white rounded-3xl p-6 shadow-sm flex gap-4 border border-green-100">
                            <span className="w-11 h-11 bg-linear-to-br from-green-600 to-emerald-500 text-white rounded-2xl flex items-center justify-center font-extrabold text-lg shrink-0 shadow-md">
                                {s.num}
                            </span>
                            <div>
                                <h3 className="font-bold text-base mb-1">{s.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        </div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* PRICING */}
            <section id="pricing" className="px-6 py-20 max-w-2xl mx-auto">
                <FadeIn>
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">{t.pricing.title}</h2>
                    <p className="text-gray-500 text-lg">{t.pricing.subtitle}</p>
                </div>
                </FadeIn>
                {t.pricing.plans.map((plan, i) => (
                    <FadeIn key={i}>
                    <div className="relative bg-linear-to-br from-green-700 to-emerald-600 text-white rounded-3xl p-8 shadow-2xl overflow-hidden">
                        {/* decorative circle */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <div>
                                <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-1">{plan.name}</p>
                                <div className="flex items-end gap-1.5">
                                    <span className="text-5xl font-extrabold">{plan.price}</span>
                                    <span className="text-green-200 text-xl mb-1">{plan.period}</span>
                                </div>
                                <p className="text-emerald-300 text-xs mt-1">{t.pricing.yearlyNote}</p>
                            </div>
                            <button
                                onClick={() => scrollTo("contact")}
                                className="bg-white text-green-800 font-bold px-6 py-3 rounded-2xl hover:bg-green-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all self-start sm:self-auto"
                            >
                                {plan.cta}
                            </button>
                        </div>

                        <div className="h-px bg-white/15 mb-6" />

                        <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-4">{t.pricing.everythingTitle}</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm mb-6">
                            {plan.features.map((feat, j) => (
                                <li key={j} className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-white/15 rounded-full flex items-center justify-center text-emerald-300 text-xs font-bold shrink-0">✓</span>
                                    {feat}
                                </li>
                            ))}
                        </ul>
                    </div>
                    </FadeIn>
                ))}
            </section>

            {/* REFERENCES */}
            <ReferencesSection title={t.references.title} />

            {/* CONTACT */}
            <FadeIn>
            <section id="contact" className="relative bg-gray-950 text-white px-6 py-20 text-center overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-green-900/40 to-transparent pointer-events-none" />
                <div className="relative z-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">{t.contact.title}</h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">{t.contact.subtitle}</p>
                    <a
                        href={`mailto:${t.contact.email}`}
                        className="inline-block bg-linear-to-r from-green-500 to-emerald-500 text-white font-bold px-10 py-4 rounded-2xl shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all text-base"
                    >
                        ✉️ {t.contact.cta}
                    </a>
                    <p className="mt-5 text-gray-500 text-sm">{t.contact.email}</p>
                </div>

                <div className="flex max-sm:flex-col justify-center items-center mt-10">
                    <img src={rns_logo} onClick={() => window.open("https://www.rns-apps.dk", '_blank')?.focus()} alt="Scorecard"
                         className="h-52 object-contain hover:scale-110 transition-transform cursor-pointer" />
                    <img src={scorecard_logo} alt="Scorecard" className="h-52 object-contain hover:scale-110 transition-transform" />
                </div>
            </section>
            </FadeIn>

            {/* FOOTER */}
            <footer className="text-center text-xs text-gray-400 py-6 bg-gray-950 border-t border-gray-800">
                {t.footer}
            </footer>
        </div>
    );
};

export default HomePage;



