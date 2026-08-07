document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- MOBİL NAVİGASYON ---
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
            navToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
        });
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
                navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }

    // --- KARŞILAMA EKRANI: TEK MOTOR ---
    const preloader = document.getElementById("preloader");
    if (preloader) {
        const alreadyVisited = sessionStorage.getItem("bacanaklar-intro-seen") === "1";
        const delay = (alreadyVisited || reduceMotion) ? 100 : 850;
        setTimeout(() => {
            preloader.classList.add("fade-out-zoom");
            setTimeout(() => { preloader.style.display = "none"; }, reduceMotion ? 0 : 800);
            sessionStorage.setItem("bacanaklar-intro-seen", "1");
        }, delay);
    }

    // --- DAKTİLO EFEKTİ ---
    const typedTarget = document.getElementById("daktilo-yazi");
    if (typedTarget && window.Typed) {
        if (reduceMotion) {
            typedTarget.innerHTML = 'Ruhu Isıtan <br><span class="anim-text-flow">Geleneksel</span> Lezzetler';
        } else {
            new Typed("#daktilo-yazi", {
                strings: [
                    'Ruhu Isıtan <br> <span class="anim-text-flow">Geleneksel</span> Lezzetler',
                    'Her Sabah <br> <span class="anim-text-flow">Sıcacık</span> Çorbalar',
                    'Anne Eli Değmiş <br> <span class="anim-text-flow">Nefis</span> Yemekler'
                ],
                typeSpeed: 60,
                backSpeed: 40,
                backDelay: 3000,
                loop: true,
                showCursor: true,
                cursorChar: "|"
            });
        }
    }

    // --- DİNAMİK BUHAR EFEKTİ ---
    const steamZone = document.getElementById("steam-zone");
    function createSteamParticle() {
        if (!steamZone || document.hidden || reduceMotion) return;
        const particle = document.createElement("div");
        particle.classList.add("steam-particle");
        particle.style.left = `${Math.random() * 120 + 40}px`;
        const size = Math.random() * 25 + 15;
        particle.style.width = `${size}px`;
        particle.style.height = `${size * 1.5}px`;
        const duration = Math.random() * 2 + 2;
        particle.style.animationDuration = `${duration}s`;
        steamZone.appendChild(particle);
        setTimeout(() => particle.remove(), duration * 1000);
    }
    if (steamZone && !reduceMotion) setInterval(createSteamParticle, window.innerWidth <= 768 ? 650 : 450);

    // --- ARKA PLAN KIVILCIMLARI ---
    const sparksZone = document.getElementById("sparks-zone");
    function createSpark() {
        if (!sparksZone || document.hidden || reduceMotion) return;
        const spark = document.createElement("div");
        spark.classList.add("spark");
        const size = Math.random() * 4 + 2;
        spark.style.width = `${size}px`;
        spark.style.height = `${size}px`;
        spark.style.left = `${Math.random() * 100}%`;
        const duration = Math.random() * 3 + 3;
        spark.style.animationDuration = `${duration}s`;
        sparksZone.appendChild(spark);
        setTimeout(() => spark.remove(), duration * 1000);
    }
    if (sparksZone && !reduceMotion) setInterval(createSpark, window.innerWidth <= 768 ? 900 : 600);

    // --- MOUSE PARALAKS ---
    const scene = document.getElementById("parallax-scene");
    if (scene && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("mousemove", (e) => {
            const mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            const mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
            scene.querySelectorAll(".main-dish-wrapper, .floating-item").forEach(item => {
                const depth = Number(item.getAttribute("data-depth")) || 0.2;
                const moveX = mouseX * (depth * 40);
                const moveY = mouseY * (depth * 40);
                item.style.transform = item.classList.contains("main-dish-wrapper")
                    ? `translate(${moveX}px, ${moveY}px)`
                    : `translate(${moveX}px, ${moveY}px) translateY(-5px)`;
            });
        }, { passive: true });
    }

    // --- MENÜ KATEGORİ + METİN ARAMA ---
    const filterButtons = [...document.querySelectorAll(".filter-btn")];
    const filterItems = [...document.querySelectorAll(".filter-item")];
    const menuSearch = document.getElementById("menu-search");
    const menuSearchClear = document.getElementById("menu-search-clear");
    const resultCount = document.getElementById("menu-result-count");
    const noResults = document.getElementById("menu-no-results");
    let activeFilter = "all";

    const normalizeText = (value) => (value || "")
        .toLocaleLowerCase("tr-TR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    function applyMenuFilters() {
        const query = normalizeText(menuSearch?.value || "");
        let visible = 0;
        filterItems.forEach(item => {
            const categoryMatch = activeFilter === "all" || item.dataset.category === activeFilter;
            const textMatch = !query || normalizeText(item.textContent).includes(query);
            const show = categoryMatch && textMatch;
            item.classList.toggle("hidden", !show);
            if (show) visible += 1;
        });
        if (resultCount) resultCount.textContent = String(visible);
        if (noResults) noResults.hidden = visible !== 0;
        if (menuSearchClear) menuSearchClear.hidden = !(menuSearch && menuSearch.value.length > 0);
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            activeFilter = button.getAttribute("data-filter") || "all";
            applyMenuFilters();
        });
    });
    if (menuSearch) menuSearch.addEventListener("input", applyMenuFilters);
    if (menuSearchClear) {
        menuSearchClear.addEventListener("click", () => {
            menuSearch.value = "";
            menuSearch.focus();
            applyMenuFilters();
        });
    }
    if (filterItems.length) applyMenuFilters();

    // --- SCROLL REVEAL ---
    const revealElements = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach(element => element.classList.add("active"));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealElements.forEach(element => revealObserver.observe(element));
    }

    // --- TÜRKİYE SAATİNE GÖRE AÇIK / KAPALI ---
    // Site sahibinin verdiği çalışma saatleri: Pzt-Cts 08:00-04:00, Pazar 19:00-03:00.
    const schedule = {
        0: { start: 19 * 60, end: 3 * 60, startLabel: "19:00", endLabel: "03:00" },
        1: { start: 8 * 60, end: 4 * 60, startLabel: "08:00", endLabel: "04:00" },
        2: { start: 8 * 60, end: 4 * 60, startLabel: "08:00", endLabel: "04:00" },
        3: { start: 8 * 60, end: 4 * 60, startLabel: "08:00", endLabel: "04:00" },
        4: { start: 8 * 60, end: 4 * 60, startLabel: "08:00", endLabel: "04:00" },
        5: { start: 8 * 60, end: 4 * 60, startLabel: "08:00", endLabel: "04:00" },
        6: { start: 8 * 60, end: 4 * 60, startLabel: "08:00", endLabel: "04:00" }
    };
    const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

    function getIstanbulNowParts() {
        const parts = new Intl.DateTimeFormat("en-US", {
            timeZone: "Europe/Istanbul",
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23"
        }).formatToParts(new Date());
        const pick = type => parts.find(part => part.type === type)?.value;
        return {
            day: dayMap[pick("weekday")],
            minutes: Number(pick("hour")) * 60 + Number(pick("minute"))
        };
    }

    function getRestaurantState() {
        const { day, minutes } = getIstanbulNowParts();
        const today = schedule[day];
        const prevDay = (day + 6) % 7;
        const previous = schedule[prevDay];

        // Önce bir önceki günün gece yarısını aşan vardiyasını kontrol et.
        if (previous.end <= previous.start && minutes < previous.end) {
            return { open: true, text: `Şu anda açığız • ${previous.endLabel}'e kadar` };
        }
        // Sonra bugünkü vardiya başlangıcı.
        if (today.end <= today.start) {
            if (minutes >= today.start) return { open: true, text: `Şu anda açığız • ${today.endLabel}'e kadar` };
        } else if (minutes >= today.start && minutes < today.end) {
            return { open: true, text: `Şu anda açığız • ${today.endLabel}'e kadar` };
        }

        // Kapalıysa en yakın açılış bugünün ilerleyen saati veya yarının açılışıdır.
        if (minutes < today.start) return { open: false, text: `Şu anda kapalıyız • ${today.startLabel}'de açılıyor` };
        const next = schedule[(day + 1) % 7];
        return { open: false, text: `Şu anda kapalıyız • Yarın ${next.startLabel}'de açılıyor` };
    }

    function updateRestaurantStatus() {
        const state = getRestaurantState();
        document.querySelectorAll("[data-restaurant-status]").forEach(el => {
            el.classList.toggle("is-open", state.open);
            el.classList.toggle("is-closed", !state.open);
            const text = el.querySelector(".status-text");
            if (text) text.textContent = state.text;
        });
        const { day } = getIstanbulNowParts();
        document.querySelectorAll(".day-row").forEach(row => row.classList.toggle("current-day", Number(row.dataset.day) === day));
    }
    if (document.querySelector("[data-restaurant-status]") || document.querySelector(".day-row")) {
        updateRestaurantStatus();
        setInterval(updateRestaurantStatus, 60 * 1000);
    }

    // FormSubmit kullanan iletişim formunu JavaScript ile engellemiyoruz.

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) document.querySelectorAll(".steam-particle, .spark").forEach(el => el.remove());
    });
});
