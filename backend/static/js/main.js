/**
 * main.js
 * =======
 * Client-side script for Flask Langihan Bus Terminal frontend.
 * Handles dynamic rotating ergonomics tips, theme toggle, and live clocks.
 */

document.addEventListener('DOMContentLoaded', () => {
    initLiveClock();
    initErgonomicsSlider();
    initThemeToggle();
    initSidebarToggle();
});

// 1. Live Terminal Digital Clock
function initLiveClock() {
    const digitsEl = document.getElementById('liveClockDigits');
    const ampmEl = document.getElementById('liveClockAmPm');
    const dateEl = document.getElementById('liveDateStr');

    function update() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;

        if (digitsEl) digitsEl.textContent = `${hours}:${minutesStr}`;
        if (ampmEl) ampmEl.textContent = ampm;

        if (dateEl) {
            const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
            dateEl.textContent = now.toLocaleDateString('en-PH', options);
        }
    }

    update();
    setInterval(update, 1000);
}

// 2. Dynamic Rotating Ergonomics Tips Engine
function initErgonomicsSlider() {
    const textEl = document.getElementById('dynamicErgoText');
    const counterEl = document.getElementById('ergoCounter');
    const prevBtn = document.getElementById('prevErgoBtn');
    const nextBtn = document.getElementById('nextErgoBtn');
    const sliderContainer = document.getElementById('ergoSlider');

    // Default tips if not passed from template
    const tips = window.ERGONOMIC_TIPS || [
        { text: "Pleasant evening transit with sunset views along the coastal highway." },
        { text: "Air-conditioned cabins cause rapid moisture loss; drink 200ml water every 2 hours to prevent fatigue." },
        { text: "Keep knees at roughly 90 degrees and support the lower back to alleviate disc compression on routes over 3 hours." },
        { text: "Perform gentle ankle pumps and seated calf raises every 45 minutes to stimulate deep leg blood circulation." },
        { text: "Bend at the knees and keep heavy luggage close to your chest when loading into bus undercarriage bays." }
    ];

    let currentIndex = 0;
    let autoRotateTimer = null;
    let isPaused = false;

    function renderTip(index) {
        if (!textEl) return;

        textEl.classList.remove('fading-in');
        textEl.classList.add('fading-out');

        setTimeout(() => {
            const tip = tips[index];
            textEl.textContent = tip.text || tip;
            textEl.classList.remove('fading-out');
            textEl.classList.add('fading-in');

            if (counterEl) {
                counterEl.textContent = `${index + 1} / ${tips.length}`;
            }

            setTimeout(() => {
                textEl.classList.remove('fading-in');
            }, 300);
        }, 200);
    }

    function nextTip() {
        currentIndex = (currentIndex + 1) % tips.length;
        renderTip(currentIndex);
    }

    function prevTip() {
        currentIndex = (currentIndex - 1 + tips.length) % tips.length;
        renderTip(currentIndex);
    }

    function startTimer() {
        clearInterval(autoRotateTimer);
        autoRotateTimer = setInterval(() => {
            if (!isPaused) {
                nextTip();
            }
        }, 6000); // Rotates every 6 seconds
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextTip(); startTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevTip(); startTimer(); });

    // Pause rotation when passenger hovers over tip to read
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => { isPaused = true; });
        sliderContainer.addEventListener('mouseleave', () => { isPaused = false; });
    }

    // Initialize
    if (tips.length > 0) {
        renderTip(0);
        startTimer();
    }
}

// 3. Theme Toggle (Light & Dark Mode)
function initThemeToggle() {
    const html = document.documentElement;
    const themeBtn = document.getElementById('themeToggleBtn');
    const topThemeBtn = document.getElementById('topThemeBtn');
    const themeIcon = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');

    // Retrieve saved or default
    const savedTheme = localStorage.getItem('libt_theme_mode') || 'dark';
    setTheme(savedTheme);

    function setTheme(mode) {
        html.setAttribute('data-theme', mode);
        localStorage.setItem('libt_theme_mode', mode);

        const isLight = mode === 'light';
        if (themeIcon) themeIcon.textContent = isLight ? '🌙' : '☀️';
        if (themeLabel) themeLabel.textContent = isLight ? 'Dark Mode' : 'Light Mode';

        if (topThemeBtn) {
            const icon = topThemeBtn.querySelector('.theme-icon');
            const txt = topThemeBtn.querySelector('.theme-text');
            if (icon) icon.textContent = isLight ? '🌙' : '☀️';
            if (txt) txt.textContent = isLight ? 'Dark Mode' : 'Light Mode';
        }
    }

    function toggle() {
        const current = html.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
    }

    if (themeBtn) themeBtn.addEventListener('click', toggle);
    if (topThemeBtn) topThemeBtn.addEventListener('click', toggle);
}

// 4. Mobile Sidebar Drawer Open/Close
function initSidebarToggle() {
    const sidebar = document.getElementById('appSidebar');
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    const closeBtn = document.getElementById('sidebarCloseBtn');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    if (closeBtn && sidebar) {
        closeBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }
}
