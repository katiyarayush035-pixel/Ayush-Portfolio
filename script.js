const $ = (s, c = document) => c.querySelector(s),
  $$ = (s, c = document) => [...c.querySelectorAll(s)];

// Scroll reveal (+ animate skill bars)
$$(".skill-tag").forEach((t) =>
  t.style.setProperty("--lvl", t.dataset.level + "%"),
);
const io =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("active");
              io.unobserve(e.target);
            }
          }),
        { threshold: 0.15 },
      )
    : null;
$$(".reveal").forEach((el) =>
  io ? io.observe(el) : el.classList.add("active"),
);

// Reading progress and the active section link.
const bar = $("#progress");
const links = $$(".nav-links a"),
  secs = links.map((a) => $(a.getAttribute("href")));
addEventListener(
  "scroll",
  () => {
    const y = scrollY,
      max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    let cur = 0;
    secs.forEach((section, i) => {
      if (section && section.getBoundingClientRect().top < innerHeight * 0.4)
        cur = i;
    });
    links.forEach((a, i) =>
      a.classList.toggle("current", i === cur && y > 100),
    );
  },
  { passive: true },
);

// Mobile menu
const toggle = $(".menu-toggle"),
  menu = $(".nav-links");
function closeMenu() {
  menu.classList.remove("active");
  toggle.classList.remove("active");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open navigation");
}
toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("active");
  toggle.classList.toggle("active", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
});
links.forEach((a) => a.addEventListener("click", closeMenu));

// Theme toggle. The warm paper palette is the default; the dark palette is optional.
const root = document.documentElement;
try {
  const savedTheme = localStorage.getItem("theme");
  root.dataset.theme = savedTheme === "dark" ? "dark" : "light";
} catch (e) {
  root.dataset.theme = "light";
}
const themeButton = $("#theme");
function updateThemeButton() {
  const dark = root.dataset.theme === "dark";
  themeButton.textContent = dark ? "☼" : "◐";
  themeButton.setAttribute(
    "aria-label",
    dark ? "Switch to light theme" : "Switch to dark theme",
  );
}
updateThemeButton();
themeButton.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("theme", root.dataset.theme);
  } catch (e) {}
  updateThemeButton();
});

// Rotating multilingual welcome greeting
const greetingWord = $("#greeting-word");
if (greetingWord) {
  const greetings = [
    { text: "नमस्ते", lang: "hi" }, // Hindi
    { text: "Hello", lang: "en" }, // English
    { text: "Hola", lang: "es" }, // Spanish
    { text: "Bonjour", lang: "fr" }, // French
    { text: "こんにちは", lang: "ja" }, // Japanese
    { text: "안녕하세요", lang: "ko" }, // Korean
    { text: "你好", lang: "zh" }, // Chinese
    { text: "مرحبا", lang: "ar" }, // Arabic
    { text: "নমস্কার", lang: "bn" }, // Bengali
    { text: "வணக்கம்", lang: "ta" }, // Tamil
    { text: "నమస్కారం", lang: "te" }, // Telugu
    { text: "ನಮಸ್ಕಾರ", lang: "kn" }, // Kannada
    { text: "Hallo", lang: "de" }, // German
  ];
  let greetingIndex = 0;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reducedMotion) {
    setInterval(() => {
      greetingIndex = (greetingIndex + 1) % greetings.length;
      const next = greetings[greetingIndex];
      greetingWord.classList.remove("greeting-change");
      // Restart the CSS transition/animation cleanly.
      void greetingWord.offsetWidth;
      greetingWord.textContent = next.text;
      greetingWord.lang = next.lang;
      greetingWord.classList.add("greeting-change");
    }, 3200);
  }
}

// Skill filters
$$(".skill-filter").forEach((btn) =>
  btn.addEventListener("click", () => {
    $$(".skill-filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    $$(".skill-group").forEach((g) =>
      g.classList.toggle("hide", f !== "all" && g.dataset.category !== f),
    );
  }),
);
