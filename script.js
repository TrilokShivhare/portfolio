/* =============================================
   TRILOK SHIVHARE – PORTFOLIO SCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Navbar scroll effect ----
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
    });

    // ---- Active nav link on scroll ----
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 120;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }

    // ---- Mobile hamburger menu ----
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
        document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinksContainer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ---- Generate hero particles ----
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.setProperty('--duration', (4 + Math.random() * 8) + 's');
            p.style.setProperty('--delay', (Math.random() * 6) + 's');
            // Alternate blue / purple particles
            p.style.background = Math.random() > 0.5 ? '#3b82f6' : '#8b5cf6';
            p.style.width = (2 + Math.random() * 3) + 'px';
            p.style.height = p.style.width;
            particlesContainer.appendChild(p);
        }
    }

    // ---- Scroll reveal animation ----
    const revealEls = document.querySelectorAll(
        '.section-header, .stat-card, .skill-category, .timeline-card, .project-card, .achievement-card, .education-card, .contact-link, .contact-form, .about-content, .about-visual, .highlight-item, .floating-badge, .linkedin-card'
    );

    revealEls.forEach((el, i) => {
        el.classList.add('reveal');
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    // ---- Proficiency bar animation ----
    const profBars = document.querySelectorAll('.proficiency-fill');
    const profObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                profObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    profBars.forEach(bar => profObserver.observe(bar));

    // ---- Counter animation for stats ----
    function animateCounter(el, target, suffix = '') {
        let start = 0;
        const duration = 1800;
        const step = (timestamp) => {
            if (!el._startTime) el._startTime = timestamp;
            const progress = Math.min((timestamp - el._startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target * 10) / 10;
            el.textContent = current % 1 === 0 ? current + suffix : current.toFixed(1) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    const statNums = document.querySelectorAll('.stat-num');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                const num = parseFloat(text);
                const suffix = text.replace(/[\d.]/g, '');
                animateCounter(el, num, suffix);
                statObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    statNums.forEach(el => statObserver.observe(el));

    // ---- Contact form handler (Formspree) ----
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('formSubmitBtn');
            const successMsg = document.getElementById('formSuccess');
            const formData = new FormData(contactForm);

            btn.disabled = true;
            btn.querySelector('span').textContent = 'Sending…';

            try {
                const response = await fetch(contactForm.getAttribute('action'), {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    successMsg.classList.add('show');
                    contactForm.reset();
                    btn.querySelector('span').textContent = 'Send Message';
                    setTimeout(() => successMsg.classList.remove('show'), 5000);
                } else {
                    const data = await response.json();
                    const errorMsg = data.errors ? data.errors.map(error => error.message).join(", ") : "Oops! There was a problem submitting your form. Please ensure the Formspree ID is correct.";
                    alert(errorMsg);
                    console.error("Formspree Error:", data);
                }
            } catch (error) {
                alert("Oops! There was a problem submitting your form");
            } finally {
                btn.disabled = false;
                btn.querySelector('span').textContent = 'Send Message';
            }
        });
    }

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ---- Typing effect in hero badge ----
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.animation = 'none';
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 100);
    }

    // ---- Tilt effect on project cards ----
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ---- LinkedIn Feed Renderer ----
    /**
     * OPTION: MANUAL UPDATE
     * To update your LinkedIn posts:
     * 1. Go to the post on LinkedIn.
     * 2. Copy the Title, a short Excerpt, and the URL.
     * 3. Paste them into a new object in the array below.
     * 
     * NOTE: LinkedIn images expire quickly. If an image stops showing, 
     * it will fallback to the high-quality tech images below.
     */
    const linkedinPosts = [
        {
            title: 'Flutter Widgets for Responsive Design',
            excerpt: 'Essential widgets for pixel-perfect UIs: Hero, LayoutBuilder, and AnimatedSwitcher. A quick guide on building scalable mobile apps.',
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop', // MacBook coding
            link: 'https://www.linkedin.com/posts/trilok-shivhare-7825721aa_flutter-flutterdev-mobiledevelopment-activity-7383942849031192578-fwAc',
            tags: ['#Flutter', '#MobileDev']
        },
        {
            title: 'Problem Solving at Developer Bazaar',
            excerpt: 'Insights into the customer-centric approach at Developer Bazaar Technologies. Every challenge has a solution when the team is focused.',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop', // Team meeting
            link: 'https://www.linkedin.com/posts/developerbazaar_problemsolving-customercentric-developersbazaartechnologies-activity-7429114944408752128-7uoH',
            tags: ['#ProblemSolving', '#Leadership']
        },
        {
            title: 'Reflecting on 8 Months of Growth',
            excerpt: 'Concluding an incredible journey at Developer Bazaar. From complex Flutter projects to leading a team, it’s been a foundation-strengthening experience.',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop', // Analytics/growth visual
            link: 'https://www.linkedin.com/in/trilok-shivhare-7825721aa/',
            tags: ['#CareerGrowth', '#Milestone']
        }
    ];

    const linkedinGrid = document.getElementById('linkedinGrid');
    if (linkedinGrid) {
        linkedinGrid.innerHTML = ''; // Clear placeholders
        linkedinPosts.forEach((post, i) => {
            const card = document.createElement('div');
            card.className = 'linkedin-card reveal';
            card.style.transitionDelay = (i * 0.1) + 's';

            card.innerHTML = `
                <div class="linkedin-card-image">
                    <img src="${post.image}" alt="${post.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'">
                </div>
                <div class="linkedin-card-header">
                    <div class="linkedin-avatar">TS</div>
                    <div class="linkedin-header-text">
                        <h4>Trilok Shivhare</h4>
                        <span>Mobile App Developer</span>
                    </div>
                </div>
                <div class="linkedin-card-body">
                    <h5>${post.title}</h5>
                    <p>${post.excerpt}</p>
                    <div class="linkedin-tags">${post.tags.map(tag => `<span>${tag}</span>`).join(' ')}</div>
                </div>
                <div class="linkedin-card-footer">
                    <a href="${post.link}" target="_blank" class="linkedin-link">
                        View on LinkedIn
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                </div>
            `;
            linkedinGrid.appendChild(card);
            revealObserver.observe(card);
        });
    }

});
