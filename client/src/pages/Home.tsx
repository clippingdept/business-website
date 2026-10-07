import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleCheck,
  Clock3,
  Eye,
  Instagram,
  Layers3,
  Loader2,
  Menu,
  MessageCircle,
  Play,
  ScanLine,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  X,
  Zap,
} from "lucide-react";

const navItems = [
  { label: "Why it works", href: "#why" },
  { label: "How it works", href: "#system" },
  { label: "Trial campaign", href: "#trial" },
  { label: "FAQ", href: "#faq" },
];

const processSteps = [
  {
    number: "01",
    title: "Send the source",
    description:
      "Send us a podcast, interview, livestream, or other approved content you want to put to work.",
    accent: "blue",
    icon: Layers3,
  },
  {
    number: "02",
    title: "Choose the moments",
    description:
      "We review the source and choose moments that can stand on their own as short clips.",
    accent: "cream",
    icon: ScanLine,
  },
  {
    number: "03",
    title: "Prepare and publish",
    description:
      "We shape the selected moments into clips, send them to selected accounts, and coordinate their publishing.",
    accent: "blue",
    icon: Send,
  },
  {
    number: "04",
    title: "Review what happened",
    description:
      "We record where the clips were published, review their views, and give you a report on what to test next.",
    accent: "ink",
    icon: BarChart3,
  },
];

const faqs = [
  {
    question: "What kind of content can you work with?",
    answer:
      "We can work with podcasts, interviews, livestreams, educational videos, founder conversations, entertainment footage, and other approved content you have the right to use. The best source material contains several distinct moments that can work as short clips.",
  },
  {
    question: "Can you guarantee a certain number of views?",
    answer:
      "No. Views depend on the content, audience fit, timing, platform recommendations, account history, and competition. We do commit to the agreed campaign work, including clip preparation, approved publishing, tracking, view review, and reporting.",
  },
  {
    question: "How does the 14-day trial work?",
    answer:
      "You provide approved source content and a campaign goal. We prepare up to 15 clips, coordinate publishing through selected accounts for 14 days, review the available view data, and provide a mid-campaign update and final campaign report. There is no automatic long-term commitment.",
  },
  {
    question: "How do you review and report views?",
    answer:
      "We record where each clip was published, including the account, post link, platform, and date. We use the view data reported by the platform when it is available. Posts or activity that need more support are flagged for review rather than treated as confirmed results.",
  },
  {
    question: "What do we need to provide?",
    answer:
      "You provide the approved source content, confirmation that you have the necessary rights, your campaign goal and target audience, any brand guidelines or links you want included, and one person who can review clips and campaign updates.",
  },
  {
    question: "What happens after the trial?",
    answer:
      "We review what was published, the available view data, the strongest creative patterns, and any issues that came up. You can then continue with a larger campaign, change the scope, pause, or stop.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
};

const sectionReveal = {
  hidden: { opacity: 0.45, y: 22, scale: 0.7 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: "easeOut" as const } },
};

const sectionViewport = { once: true, amount: 0.16 };

export default function Home() {
  const heroRef = useRef<HTMLElement | null>(null);
  const flowRef = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle");
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress: pageProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroVisualY = useTransform(heroProgress, [0, 1], [0, 110]);
  const heroVisualOpacity = useTransform(heroProgress, [0, 0.8], [1, 0.18]);
  const { scrollYProgress: storyProgress } = useScroll({ target: flowRef, offset: ["start start", "end end"] });
  const storyScale = useTransform(storyProgress, [0, 0.22, 0.5, 0.76, 1], [1, 1.08, 1, 1, 0.96]);
  const storyMediaWidth = useTransform(storyProgress, [0, 0.2, 0.42], [520, 500, 210]);
  const storyMediaHeight = useTransform(storyProgress, [0, 0.2, 0.42], [292, 280, 373]);
  const storyMediaRadius = useTransform(storyProgress, [0, 0.42], [3, 18]);
  const storyMediaX = useTransform(storyProgress, [0, 0.42, 0.7, 1], [0, 0, -8, 0]);
  const storyMediaY = useTransform(storyProgress, [0, 0.42, 0.7, 1], [0, 0, -6, 8]);
  const contentOpacity = useTransform(storyProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const clipOpacity = useTransform(storyProgress, [0.18, 0.3, 0.46, 0.56], [0, 1, 1, 0]);
  const distributeOpacity = useTransform(storyProgress, [0.44, 0.56, 0.7, 0.8], [0, 1, 1, 0]);
  const reachOpacity = useTransform(storyProgress, [0.68, 0.82, 1], [0, 1, 1]);
  const duplicateOneX = useTransform(storyProgress, [0.52, 0.76], [0, -235]);
  const duplicateTwoX = useTransform(storyProgress, [0.52, 0.76], [0, 235]);
  const duplicateOneY = useTransform(storyProgress, [0.52, 0.76], [0, -34]);
  const duplicateTwoY = useTransform(storyProgress, [0.52, 0.76], [0, 34]);
  const duplicateScale = useTransform(storyProgress, [0.52, 0.76], [0.7, 0.82]);
  const [activeStory, setActiveStory] = useState(0);
  const sectionInitial = shouldReduceMotion ? false : "hidden";

  useMotionValueEvent(storyProgress, "change", (latest) => {
    setActiveStory(latest < 0.28 ? 0 : latest < 0.52 ? 1 : latest < 0.78 ? 2 : 3);
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formState === "submitting") return;
    setFormState("submitting");
    window.setTimeout(() => setFormState("success"), 700);
  };

  return (
    <div className="site-shell">
      <motion.div className="scroll-progress" style={{ scaleX: pageProgress }} aria-hidden="true" />
      <header className={`site-header ${scrolled ? "is-scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}>
        <a className="brand" href="#top" aria-label="Clipping Department home">
          <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
          <span className="brand-name">Clipping<br />Department</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <a className="header-cta" href="#contact">Start a campaign <ArrowUpRight size={15} /></a>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav id="mobile-navigation" className="mobile-nav" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} aria-label="Mobile navigation">
            {navItems.map((item) => <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}<ArrowUpRight size={16} /></a>)}
            <a className="mobile-cta" href="#contact" onClick={closeMenu}>Start a campaign <ArrowUpRight size={16} /></a>
          </motion.nav>
        )}
      </AnimatePresence>

      <main id="top">
        <section className="hero-section" ref={heroRef}>
          <div className="hero-grid-lines" aria-hidden="true" />
          <div className="hero-copy">
            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.08 }}>
              Give your existing content more ways to be <em>found.</em>
            </motion.h1>
            <motion.p className="hero-lede" variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.16 }}>
              We turn podcasts, interviews, livestreams, and other approved content into short clips, then coordinate distribution through selected social accounts.
            </motion.p>
            <motion.div className="hero-actions" variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.24 }}>
              <a className="button button-cobalt" href="#contact">Start a campaign <ArrowRight size={17} /></a>
              <a className="text-link light-link" href="#system">See how it works <ArrowRight size={16} /></a>
            </motion.div>
            <motion.div className="hero-note" variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.34 }}>
              <CircleCheck size={15} /> 14-day trial · up to 15 clips · no long-term commitment
            </motion.div>
          </div>
          <motion.div className="hero-visual" style={{ y: heroVisualY, opacity: heroVisualOpacity }} aria-label="Illustration of a content distribution campaign">
            <motion.div className="orbit orbit-one" animate={shouldReduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 32, repeat: Infinity, ease: "linear" }} />
            <motion.div className="orbit orbit-two" animate={shouldReduceMotion ? undefined : { rotate: -360 }} transition={{ duration: 42, repeat: Infinity, ease: "linear" }} />
            <motion.div className="hero-card hero-card-main" initial={{ opacity: 0, scale: 0.94, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: -4 }} transition={{ duration: 0.8, delay: 0.25 }}>
              <div className="card-topline"><span className="live-dot" /> LIVE CAMPAIGN VIEW</div>
              <div className="video-frame">
                <div className="video-gradient" />
                <span className="frame-kicker">FROM THE ORIGINAL</span>
                <span className="frame-title">One piece of content.<br /><i>Many ways to reach people.</i></span>
                <span className="play-button"><Play size={17} fill="currentColor" /></span>
                <span className="frame-caption">SHORT-FORM CLIP / 00:18</span>
              </div>
              <div className="card-bottomline"><span>Approved content</span><span className="arrow-circle"><ArrowUpRight size={14} /></span></div>
            </motion.div>
            <motion.div className="floating-tag tag-top" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 0.5 }}><span className="tag-icon"><Zap size={14} /></span> CLIP / SHARE / REPEAT</motion.div>
            <motion.div className="floating-tag tag-bottom" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.85, duration: 0.5 }}><span className="tag-icon"><Eye size={14} /></span> TRACK EVERY PLACEMENT</motion.div>
          </motion.div>
          <div className="hero-scroll"><span>Scroll to explore</span><span className="scroll-line" /></div>
        </section>

        <motion.section className="signal-strip section-reveal" aria-label="Service signals" variants={sectionReveal} initial={sectionInitial} whileInView="visible" viewport={sectionViewport}>
          <div className="wrap signal-inner">
            <span>BUILT FOR CONTENT THAT ALREADY EXISTS</span>
            <span className="signal-dot" /><span>SHORT-FORM NATIVE</span>
            <span className="signal-dot" /><span>EVIDENCE-BASED</span>
            <span className="signal-dot" /><span>MANAGED DISTRIBUTION</span>
          </div>
        </motion.section>

        <motion.section className="problem-section section-reveal" id="why" variants={sectionReveal} initial={sectionInitial} whileInView="visible" viewport={sectionViewport}>
          <div className="wrap problem-grid">
            <motion.div className="problem-head" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2>Creating content is only <em>half</em> the game.</h2>
            </motion.div>
            <motion.div className="problem-body" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <p>One episode can contain ten moments worth sharing. One interview can hold a month of ideas. But when it is published once, on one account, it only gets one chance to be seen.</p>
              <p className="muted-copy">We select the strongest moments, turn them into short clips, work with approved accounts to publish them, review the available view data, and report what happened.</p>
              <a className="text-link" href="#trial">See the 14-day trial <ArrowRight size={16} /></a>
            </motion.div>
          </div>
        </motion.section>

        <section className="story-section" ref={flowRef} aria-label="How Clipping Department turns long-form content into distributed short-form clips">
          <div className="story-sticky">
            <div className="wrap story-shell">
              <div className="story-topline"><span>Scroll to follow the campaign</span></div>
              <div className="story-progress" aria-label="Story progress">
                {["CONTENT", "CLIP", "DISTRIBUTE", "REACH"].map((label, index) => <span className={activeStory === index ? "active" : ""} key={label}>{label}</span>)}
              </div>
              <motion.div className="story-stage" style={{ scale: shouldReduceMotion ? 1 : storyScale }}>
                <div className="story-copy" aria-live="polite">
                  <motion.div className="story-state state-content" style={{ opacity: shouldReduceMotion ? 1 : contentOpacity }}><h2>One source.<br /><em>More moments.</em></h2><p>We start with the long-form content you already have—podcasts, interviews, livestreams, and video libraries.</p></motion.div>
                  <motion.div className="story-state state-clip" style={{ opacity: shouldReduceMotion ? 1 : clipOpacity }}><h2>Shape the best<br />moments for the <em>feed.</em></h2><p>We turn the strongest parts of your source into short-form clips with the pacing, captions, and format social viewers expect.</p></motion.div>
                  <motion.div className="story-state state-distribute" style={{ opacity: shouldReduceMotion ? 1 : distributeOpacity }}><h2>One clip.<br /><em>More relevant accounts.</em></h2><p>We coordinate with selected accounts to publish the clips for their own audiences.</p></motion.div>
                  <motion.div className="story-state state-reach" style={{ opacity: shouldReduceMotion ? 1 : reachOpacity }}><h2>See what happened<br />after <em>publishing.</em></h2><p>We track the views from each account and show you which clips performed best and what to test next.</p></motion.div>
                </div>
                <div className="story-media-wrap">
                  <motion.div className="story-media landscape-media" style={{ width: shouldReduceMotion ? 520 : storyMediaWidth, height: shouldReduceMotion ? 292 : storyMediaHeight, borderRadius: shouldReduceMotion ? 3 : storyMediaRadius, x: shouldReduceMotion ? 0 : storyMediaX, y: shouldReduceMotion ? 0 : storyMediaY }}>
                    <div className="story-media-gradient" /><span className="story-media-kicker">APPROVED SOURCE / LONG-FORM</span><span className="story-media-title">One idea.<br /><i>More ways to share.</i></span><span className="story-play"><Play size={16} fill="currentColor" /></span>
                  </motion.div>
                  <motion.div className="story-media duplicate-media duplicate-one" style={{ opacity: shouldReduceMotion ? 1 : distributeOpacity, x: shouldReduceMotion ? -150 : duplicateOneX, y: shouldReduceMotion ? -28 : duplicateOneY, scale: shouldReduceMotion ? .8 : duplicateScale }}><span>CLIP 01</span><b>FEED</b></motion.div>
                  <motion.div className="story-media duplicate-media duplicate-two" style={{ opacity: shouldReduceMotion ? 1 : distributeOpacity, x: shouldReduceMotion ? 150 : duplicateTwoX, y: shouldReduceMotion ? 28 : duplicateTwoY, scale: shouldReduceMotion ? .8 : duplicateScale }}><span>CLIP 02</span><b>FEED</b></motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <motion.section className="system-section section-reveal" id="system" variants={sectionReveal} initial={sectionInitial} whileInView="visible" viewport={sectionViewport}>
          <div className="wrap">
            <div className="section-intro split-intro">
              <div><h2>From your content<br />to a <em>successful</em><br /><em>campaign.</em></h2></div>
            </div>
            <div className="system-layout">
              <div className="step-list" role="tablist" aria-label="Campaign system steps">
                {processSteps.map((step, index) => {
                  const Icon = step.icon;
                  return <button key={step.number} className={`step-button ${activeStep === index ? "active" : ""}`} onClick={() => setActiveStep(index)} role="tab" aria-selected={activeStep === index}>
                    <span className="step-title">{step.title}</span><Icon size={17} /><ArrowUpRight className="step-arrow" size={16} />
                  </button>;
                })}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={activeStep} className={`step-detail ${processSteps[activeStep].accent}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}>
                  <div className="detail-icon">{(() => { const Icon = processSteps[activeStep].icon; return <Icon size={42} strokeWidth={1.5} />; })()}</div>
                  <h3>{["Start with what you already have.", "Find the parts worth sharing.", "Turn those moments into a campaign.", "See what the campaign produced."][activeStep]}</h3>
                  <p>{processSteps[activeStep].description}</p>
                  <div className="detail-rule" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        <motion.section className="trial-section section-reveal" id="trial" variants={sectionReveal} initial={sectionInitial} whileInView="visible" viewport={sectionViewport}>
          <div className="wrap trial-grid">
            <div className="trial-copy"><h2>Start with a <em>14-day trial.</em></h2><p>Start with a defined 14-day campaign before committing to ongoing work. You provide the approved source content and campaign goal; we handle the clipping, publishing coordination, tracking, and reporting. At the end, you can review what happened and decide whether continuing makes sense for you.</p><a className="button button-light" href="#contact">Discuss my trial <ArrowRight size={17} /></a></div>
            <div className="trial-package">
              <div className="package-top"><span>14-DAY TRIAL</span><span>FIXED SCOPE</span></div>
              <div className="package-price">NPR <strong>50,000</strong></div>
              <p className="package-note">Indicative starting price. Final scope and price are confirmed after we review your source content and campaign goal.</p>
              <ul>{["Up to 15 short-form clips", "Selected accounts prepared to publish the clips", "Clip editing, publishing coordination, tracking, and quality checks", "View checks using available platform data", "Mid-campaign update and final campaign report"].map((item) => <li key={item}><Check size={16} /> {item}</li>)}</ul>
              <div className="package-footer"><span>Content rights and takedown support included</span><ArrowUpRight size={18} /></div>
            </div>
          </div>
        </motion.section>

        <motion.section className="proof-section section-reveal" variants={sectionReveal} initial={sectionInitial} whileInView="visible" viewport={sectionViewport}>
          <div className="wrap proof-grid">
            <div className="proof-copy"><h2>Know what went live. <em>See what worked.</em></h2><p>We report which clips were approved, where they were published, and how they performed using the view data available from each platform. We also flag issues and recommend what to test next.</p><div className="proof-points"><div><ShieldCheck size={21} /><span><b>Published and tracked</b> Every approved clip is connected to its live post and publishing account.</span></div><div><Eye size={21} /><span><b>Views reviewed</b> We use platform-reported data and separate confirmed views from posts that need review.</span></div><div><Target size={21} /><span><b>Next steps included</b> The report highlights the strongest patterns and what to test in the next campaign.</span></div></div></div>
            <div className="report-preview"><div className="report-header"><span>TRIAL REPORT / SAMPLE</span><span className="report-status"><span /> PLATFORM DATA REVIEW</span></div><div className="report-total"><span>Verified platform-reported views</span><strong>—</strong><small>No campaign results are invented or estimated.</small></div><div className="report-rows"><div><span>Clips approved</span><b>15</b><i>of 17 submitted</i></div><div><span>Accounts participating</span><b>18</b><i>approved cohort</i></div><div><span>Posts published</span><b>14</b><i>live links recorded</i></div><div><span>Posts held for review</span><b>03</b><i>evidence requested</i></div><div><span>Rights / policy incidents</span><b>00</b><i>no confirmed incidents</i></div></div><div className="report-footer"><span>Next recommendation</span><b>Test new openings and caption styles <ArrowRight size={15} /></b></div></div>
          </div>
        </motion.section>

        <motion.section className="fit-section section-reveal" variants={sectionReveal} initial={sectionInitial} whileInView="visible" viewport={sectionViewport}>
          <div className="wrap fit-grid"><div><h2>For clients ready to <em>learn from their content.</em></h2></div><div className="fit-columns"><div><h3>You are a good fit if</h3><ul>{["You already have long-form content to work from", "You have the rights and approvals needed to share it", "You know which audience or market you want to reach", "You know what you want the campaign to help you learn or achieve", "Someone on your team can review clips and campaign updates"].map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul></div><div><h3>This may not be right if</h3><ul className="not-fit">{["You need guaranteed views or viral results", "You are not sure whether you have permission to use the content", "You are not prepared to approve clips before they are published", "No one on your team can review the clips or campaign updates", "You only want a view number without reviewing what caused it"].map((item) => <li key={item}><X size={15} />{item}</li>)}</ul></div></div></div>
        </motion.section>

        <motion.section className="faq-section section-reveal" id="faq" variants={sectionReveal} initial={sectionInitial} whileInView="visible" viewport={sectionViewport}>
          <div className="wrap faq-grid"><div><h2>Before we <em>talk.</em></h2><p className="muted-copy">Here are the answers to the questions clients usually ask before starting a campaign.</p><a className="text-link" href="#contact">Start a conversation <ArrowRight size={16} /></a></div><div className="faq-list">{faqs.map((faq, index) => <div className={`faq-item ${activeFaq === index ? "open" : ""}`} key={faq.question}><button onClick={() => setActiveFaq(activeFaq === index ? null : index)} aria-expanded={activeFaq === index}><span>{faq.question}</span><ChevronDown size={19} /></button><AnimatePresence initial={false}>{activeFaq === index && <motion.div className="faq-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}><p>{faq.answer}</p></motion.div>}</AnimatePresence></div>)}</div></div>
        </motion.section>

        <motion.section className="contact-section section-reveal" id="contact" variants={sectionReveal} initial={sectionInitial} whileInView="visible" viewport={sectionViewport}>
          <div className="wrap contact-grid"><div className="contact-copy"><h2>Tell us what you want to <em>share.</em></h2><p>Tell us about your content, audience, and goal. We will review the fit, recommend a practical first campaign, and explain what we would measure.</p><div className="contact-links"><a href="#contact"><MessageCircle size={18} /> WhatsApp conversation <ArrowUpRight size={15} /></a><a href="#contact"><Instagram size={18} /> Instagram conversation <ArrowUpRight size={15} /></a></div></div><div className="contact-form-wrap"><form className="contact-form" onSubmit={handleSubmit}><div className="form-kicker"><span>CAMPAIGN INQUIRY</span><span>ABOUT 3 MIN</span></div><div className="form-row"><label>Your name<input name="name" placeholder="Your name" required /></label><label>How should we contact you?<input name="contact" placeholder="Email, WhatsApp, or Instagram" required /></label></div><label>What content do you want to share?<select name="content" defaultValue=""><option value="" disabled>Select your content type</option><option>Podcast / interview</option><option>YouTube video / livestream</option><option>Education / coaching</option><option>Founder / brand content</option><option>Entertainment / event content</option><option>Something else</option></select></label><label>What would you like this campaign to do?<textarea name="details" placeholder="Tell us about your audience, goal, and what you want to learn." rows={4} required /></label><button className="button button-cobalt form-submit" type="submit" disabled={formState === "submitting"} aria-busy={formState === "submitting"}>{formState === "submitting" ? "Sending inquiry…" : formState === "success" ? "Thanks — we received your inquiry." : "Request a recommendation"} {formState === "submitting" ? <Loader2 className="form-spinner" size={17} aria-hidden="true" /> : formState === "success" ? <Check size={17} /> : <ArrowRight size={17} />}</button>{formState === "success" && <p className="form-success"><CircleCheck size={15} /> We’ll review your content and follow up with the next step.</p>}<p className="form-privacy">We’ll only use these details to respond to your campaign inquiry. We do not collect passwords or payment details here.</p></form></div></div>
        </motion.section>
      </main>

      <motion.footer className="site-footer section-reveal" variants={sectionReveal} initial={sectionInitial} whileInView="visible" viewport={sectionViewport}><div className="wrap footer-top"><a className="brand footer-brand" href="#top"><span className="brand-mark" aria-hidden="true"><span /><span /><span /></span><span className="brand-name">Clipping<br />Department</span></a><p>We turn existing content into tracked short-form campaigns for brands, creators, and businesses.</p><a className="footer-back" href="#top">Back to top <ArrowUpRight size={16} /></a></div><div className="wrap footer-bottom"><span>© 2026 Clipping Department.</span></div></motion.footer>
    </div>
  );
}
