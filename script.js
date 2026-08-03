document.addEventListener("DOMContentLoaded", () => {
    
    // --- KARŞILAMA EKRANI ---
    const preloader = document.getElementById("preloader");
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add("slide-up");
            setTimeout(() => {
                preloader.style.display = "none";
            }, 1000); 
        }, 1200); 
    }

    // --- DİNAMİK BUHAR EFEKTİ ---
    const steamZone = document.getElementById("steam-zone");
    function createSteamParticle() {
        if (!steamZone) return;
        const particle = document.createElement("div");
        particle.classList.add("steam-particle");
        const randomX = Math.random() * 120 + 40; 
        particle.style.left = `${randomX}px`;
        const size = Math.random() * 25 + 15; 
        particle.style.width = `${size}px`;
        particle.style.height = `${size * 1.5}px`;
        const duration = Math.random() * 2 + 2; 
        particle.style.animationDuration = `${duration}s`;
        steamZone.appendChild(particle);
        setTimeout(() => { particle.remove(); }, duration * 1000);
    }
    setInterval(createSteamParticle, 300);

    // --- MOUSE PARALAKS (DERİNLİK) EFEKTİ ---
    const scene = document.getElementById("parallax-scene");
    if (scene) {
        window.addEventListener("mousemove", (e) => {
            const mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            const mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
            const items = scene.querySelectorAll(".main-dish-wrapper, .floating-item");
            
            items.forEach(item => {
                const depth = item.getAttribute("data-depth") || 0.2;
                const moveX = mouseX * (depth * 40); 
                const moveY = mouseY * (depth * 40);
                if(item.classList.contains('main-dish-wrapper')) {
                    item.style.transform = `translate(${moveX}px, ${moveY}px)`;
                } else {
                    item.style.transform = `translate(${moveX}px, ${moveY}px) translateY(-5px)`;
                }
            });
        });
    }

    // ---  KATEGORİ FİLTRELEME MOTORU (Menü Sayfası) ---
    const filterButtons = document.querySelectorAll(".filter-btn");
    const filterItems = document.querySelectorAll(".filter-item");
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
                const filterValue = button.getAttribute("data-filter");
                filterItems.forEach(item => {
                    const itemCategory = item.getAttribute("data-category");
                    if (filterValue === "all" || filterValue === itemCategory) {
                        item.classList.remove("hidden");
                    } else {
                        item.classList.add("hidden");
                    }
                });
            });
        });
    }

    // --- SCROLL REVEAL (Ekrana Girince Belirme) EFEKTİ ---
    const revealElements = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ---  AKILLI GÜN VURGUSU (Çalışma Saatleri) ---
    const currentDay = new Date().getDay(); 
    const dayRow = document.querySelector(`.day-row[data-day="${currentDay}"]`);
    if (dayRow) {
        dayRow.classList.add("current-day");
    }
});

// ---  İMLEÇ SPOTLIGHT VE KALE REVEAL EFEKTİ ---
window.addEventListener("mousemove", (e) => {
    document.body.style.setProperty("--mouse-x", `${e.clientX}px`);
    document.body.style.setProperty("--mouse-y", `${e.clientY}px`);
});