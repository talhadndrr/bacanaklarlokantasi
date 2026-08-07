document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- MOBİL NAVİGASYON ---
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
            navToggle.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
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
            setTimeout(() => {
                preloader.style.display = "none";
            }, reduceMotion ? 0 : 800);
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
    let steamTimer = null;

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

    if (steamZone && !reduceMotion) {
        steamTimer = setInterval(createSteamParticle, window.innerWidth <= 768 ? 650 : 450);
    }

    // --- ARKA PLAN KIVILCIMLARI ---
    const sparksZone = document.getElementById("sparks-zone");
    let sparkTimer = null;

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

    if (sparksZone && !reduceMotion) {
        sparkTimer = setInterval(createSpark, window.innerWidth <= 768 ? 900 : 600);
    }

    // --- MOUSE PARALAKS ---
    const scene = document.getElementById("parallax-scene");
    if (scene && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("mousemove", (e) => {
            const mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            const mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
            const items = scene.querySelectorAll(".main-dish-wrapper, .floating-item");

            items.forEach(item => {
                const depth = Number(item.getAttribute("data-depth")) || 0.2;
                const moveX = mouseX * (depth * 40);
                const moveY = mouseY * (depth * 40);
                item.style.transform = item.classList.contains("main-dish-wrapper")
                    ? `translate(${moveX}px, ${moveY}px)`
                    : `translate(${moveX}px, ${moveY}px) translateY(-5px)`;
            });
        }, { passive: true });
    }

    // --- KATEGORİ FİLTRELEME ---
    const filterButtons = document.querySelectorAll(".filter-btn");
    const filterItems = document.querySelectorAll(".filter-item");
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            const filterValue = button.getAttribute("data-filter");
            filterItems.forEach(item => {
                const itemCategory = item.getAttribute("data-category");
                item.classList.toggle("hidden", filterValue !== "all" && filterValue !== itemCategory);
            });
        });
    });

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

    // --- AKILLI GÜN VURGUSU ---
    const currentDay = new Date().getDay();
    const dayRow = document.querySelector(`.day-row[data-day="${currentDay}"]`);
    if (dayRow) dayRow.classList.add("current-day");

    // --- İLETİŞİM FORMU: SAHTE BAŞARI YERİNE E-POSTA UYGULAMASI ---
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();
            const subject = encodeURIComponent(`Web sitesi mesajı - ${name}`);
            const body = encodeURIComponent(`Ad Soyad: ${name}\nE-posta: ${email}\n\nMesaj:\n${message}`);
            window.location.href = `mailto:info@bacanaklarlokantasi.com?subject=${subject}&body=${body}`;
        });
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            document.querySelectorAll(".steam-particle, .spark").forEach(el => el.remove());
        }
    });
});
