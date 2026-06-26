document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // Mobile Navigation Toggle
    // ==========================================================================
    const navToggle = document.getElementById('nav-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navLinksContainer.classList.toggle('open');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navLinksContainer.classList.remove('open');
            });
        });
    }

    // ==========================================================================
    // Sticky Header scroll effect & Active Link Highlighting
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active Section Link Highlighting using Intersection Observer
    const sections = document.querySelectorAll('section[id]');
    const navObsOptions = {
        root: null,
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '-80px 0px 0px 0px' // Adjust for sticky navbar height
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObsOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // ==========================================================================
    // Fade-in on Scroll Reveal Animation
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserverOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: '0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve once revealed
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Special fade-in delay for Hero items on load
    const heroFadeItems = document.querySelectorAll('.hero-content .fade-in-up');
    heroFadeItems.forEach((item, index) => {
        item.style.animation = `fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards`;
        item.style.animationDelay = `${index * 0.2 + 0.3}s`;
    });

    // ==========================================================================
    // Exploration Cards Filtering
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const exploreCards = document.querySelectorAll('.explore-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active state on buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            exploreCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Add fade-out animation
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9) translateY(10px)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                        // Re-trigger layout reflow to allow transition
                        card.offsetHeight;
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1) translateY(0)';
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // ==========================================================================
    // Stats Progress Bars Counter & Fill Animation
    // ==========================================================================
    const skillsSection = document.getElementById('skills');
    const skillBars = document.querySelectorAll('.skill-fill');
    const skillValues = document.querySelectorAll('.skill-val');
    let animatedSkills = false;

    const animateSkills = () => {
        skillBars.forEach((bar, index) => {
            const valEl = skillValues[index];
            const targetWidth = valEl.getAttribute('data-target');
            
            // Fill width
            bar.style.width = `${targetWidth}%`;

            // Counter animation
            let currentVal = 0;
            const stepTime = Math.abs(Math.floor(1500 / targetWidth));
            const timer = setInterval(() => {
                currentVal++;
                valEl.textContent = `${currentVal}%`;
                if (currentVal >= targetWidth) {
                    clearInterval(timer);
                    valEl.textContent = `${targetWidth}%`;
                }
            }, stepTime);
        });
    };

    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedSkills) {
                    animateSkills();
                    animatedSkills = true;
                    // Keep observing but we have a lock variable
                }
            });
        }, { threshold: 0.25 });

        skillsObserver.observe(skillsSection);
    }

    // ==========================================================================
    // Interactive Ransel Gear Info Panel
    // ==========================================================================
    const gearItems = document.querySelectorAll('.gear-item');
    const displayDefault = document.querySelector('.display-default');
    const displayContent = document.getElementById('display-content');
    const gearTitle = document.getElementById('gear-title');
    const gearDescription = document.getElementById('gear-description');

    const gearDatabase = {
         Ponsel: {
            title: "📱Ponsel",
            desc: "Teman setia dalam setiap perjalanan, alat serbaguna untuk navigasi, fotografi, dan dokumentasi momen berharga."
        },
        kamera: {
            title: "🔋⚡PowerBank & charger",
            desc: "Dapat mengisi ulang daya baterai ponsel dan headlamp, yang akan habis saat berpergian"
        },
        ransel: {
            title: "🎒Tas Selempang",
            desc: "Dapat menyimpan barang-barang yang akan dibawa saat berpergian"
        },
        senter: {
            title: "🔦 Headlamp Black Diamond 450 Lumens",
            desc: "Sumber cahaya andalan ketika menyusuri sudut gelap reruntuhan kuno. Memiliki fitur waterproof dan red-light mode agar mata tetap adaptif dalam gelap."
        }
    };

    const updateGearDisplay = (gearKey) => {
        const gearInfo = gearDatabase[gearKey];
        if (gearInfo) {
            // Apply a quick fade transition
            displayContent.classList.add('hidden');
            displayDefault.style.display = 'none';
            
            setTimeout(() => {
                gearTitle.textContent = gearInfo.title;
                gearDescription.textContent = gearInfo.desc;
                displayContent.classList.remove('hidden');
            }, 150);
        }
    };

    gearItems.forEach(item => {
        // Hover effects (Desktop)
        item.addEventListener('mouseenter', () => {
            gearItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const gearKey = item.getAttribute('data-gear');
            updateGearDisplay(gearKey);
        });

        // Click/Tap support (Mobile & Accessibility)
        item.addEventListener('click', () => {
            gearItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const gearKey = item.getAttribute('data-gear');
            updateGearDisplay(gearKey);
        });
    });

    // ==========================================================================
    // Contact Form submission simulation
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    const contactSuccess = document.getElementById('contactSuccess');
    const btnSubmit = document.getElementById('btnSubmit');
    const btnResetForm = document.getElementById('btnResetForm');

    if (contactForm && contactSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form inputs
            const nameVal = document.getElementById('name').value.trim();
            const emailVal = document.getElementById('email').value.trim();
            const subjectVal = document.getElementById('subject').value.trim();
            const messageVal = document.getElementById('message').value.trim();

            if (!nameVal || !emailVal || !subjectVal || !messageVal) {
                alert('Silakan isi seluruh kolom formulir sebelum mengirim.');
                return;
            }

            // Simulate loading state
            btnSubmit.disabled = true;
            const originalBtnContent = btnSubmit.innerHTML;
            btnSubmit.innerHTML = `
                <span>Mengirim...</span>
                <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
            `;

            // Dynamic rotation style for spinner
            const spinnerStyle = document.createElement('style');
            spinnerStyle.id = 'spinner-animation-style';
            spinnerStyle.innerHTML = `
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .spinner { animation: spin 1s linear infinite; }
            `;
            document.head.appendChild(spinnerStyle);

            // Simulate server request delay
            setTimeout(() => {
                // Hide form
                contactForm.classList.add('hidden');
                contactForm.style.display = 'none';
                
                // Show success screen
                contactSuccess.classList.remove('hidden');
                
                // Reset submit button state
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalBtnContent;
                const styleEl = document.getElementById('spinner-animation-style');
                if (styleEl) styleEl.remove();
            }, 1800);
        });

        // Reset form handler
        btnResetForm.addEventListener('click', () => {
            // Clear inputs
            contactForm.reset();
            
            // Float labels back down (reset empty placeholders state)
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.placeholder = " ";
            });

            // Hide success screen
            contactSuccess.classList.add('hidden');
            
            // Show form screen
            contactForm.style.display = 'flex';
            // Trigger reflow
            contactForm.offsetHeight;
            contactForm.classList.remove('hidden');
        });
    }
});
