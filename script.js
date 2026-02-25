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

    // ---- Tilt effect on cards ----
    document.querySelectorAll('.project-card, .blog-card').forEach(card => {
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

    // ---- Blog & Insights Renderer & Modal Logic ----
    const blogPosts = [
        {
            id: 'ai-journey',
            title: 'Leveraging AI: My Journey with Antigravity & Cursor',
            excerpt: 'How AI-powered tools are revolutionizing my development workflow, from rapid prototyping to complex bug fixing and code optimization.',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
            link: '#',
            tags: ['#AI', '#Productivity'],
            date: 'Feb 15, 2025',
            content: `
                <div class="blog-article">
                    <header class="article-header">
                        <span class="article-tag">AI-Powered Development</span>
                        <h1 class="article-title">Leveraging AI: My Journey with Antigravity & Cursor</h1>
                        <div class="article-meta">
                            <span>Feb 15, 2025</span>
                            <span>•</span>
                            <span>6 min read</span>
                        </div>
                    </header>
                    <div class="article-image">
                        <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop" alt="AI Development">
                    </div>
                    <div class="article-content">
                        <p>In the rapidly evolving world of mobile development, staying ahead means embracing the latest tools. My recent shift towards AI-powered development environments like <strong>Antigravity</strong> and <strong>Cursor</strong> has fundamental changed how I build apps.</p>
                        
                        <h3>The Shift in Workflow</h3>
                        <p>I transitioned from traditional IDEs to these AI-first platforms to gain speed without compromising on quality. These tools don't just write code; they understand context. Whether it's refactoring a complex GetX controller or optimizing a Firebase transaction, the AI provides suggestions that are actually relevant to my specific project structure.</p>
                        
                        <blockquote>
                            "AI doesn't replace the developer; it empowers the developer to focus on architecture and problem-solving rather than boilerplate."
                        </blockquote>

                        <h3>Key Benefits Experienced</h3>
                        <ul>
                            <li><strong>Rapid Prototyping:</strong> Building UI mockups from scratch is now 3x faster using generative UI commands.</li>
                            <li><strong>Deep Debugging:</strong> Antigravity's ability to trace errors across multiple files helps me resolve edge-case crashes in minutes.</li>
                            <li><strong>Code Optimization:</strong> Getting instant feedback on memory leaks or inefficient loops during the writing phase.</li>
                        </ul>

                        <p>By leveraging these tools, I've been able to maintain a high delivery pace for the 5+ production apps currently live on the stores, ensuring each one meets the highest performance standards.</p>
                    </div>
                </div>
            `
        },
        {
            id: 'flutter-responsive',
            title: 'Mastering Flutter Responsive Design',
            excerpt: 'Deep dive into building pixel-perfect, scalable UIs using Hero, LayoutBuilder, and custom responsive wrappers for Android and iOS.',
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
            link: '#',
            tags: ['#Flutter', '#UX'],
            date: 'Jan 28, 2025',
            content: `
                <div class="blog-article">
                    <header class="article-header">
                        <span class="article-tag">Development Guide</span>
                        <h1 class="article-title">Mastering Flutter Responsive Design</h1>
                        <div class="article-meta">
                            <span>Jan 28, 2025</span>
                            <span>•</span>
                            <span>8 min read</span>
                        </div>
                    </header>
                    <div class="article-image">
                        <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop" alt="Flutter Coding">
                    </div>
                    <div class="article-content">
                        <p>The "write once, run anywhere" promise of Flutter is powerful, but only if your UI adapts gracefully to thousands of different screen sizes. In this guide, I share my battle-tested approach to responsive design.</p>
                        
                        <h3>1. The Foundation: LayoutBuilder & BoxConstraints</h3>
                        <p>Always avoid hardcoding sizes. <code>LayoutBuilder</code> is your best friend when you need to make decisions based on the parent widget's constraints rather than the whole screen. This is crucial for widgets that might appear in both full-screen and split-screen modes.</p>
                        
                        <pre><code>LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth > 600) {
      return Row(
        children: [
          Expanded(child: Sidebar()),
          Expanded(flex: 2, child: MainContent()),
        ],
      );
    } else {
      return Column(
        children: [
          MainContent(),
          BottomNav(),
        ],
      );
    }
  },
);</code></pre>

                        <h3>2. Strategic Use of Hero Widgets</h3>
                        <p>Continuity is key to a premium feel. I use <code>Hero</code> widgets to bridge the gap between small list items and detailed views. It's not just an animation; it's a visual anchor that helps users maintain their mental model of the app's hierarchy. In production apps, I often wrap common UI components like product images or profile avatars in Hero widgets to ensure smooth transitions between screens.</p>

                        <h3>2. Logical Side of Scaling</h3>
                        <p>Beyond layout switching, you need proportional scaling. I use a mathematical approach to scale fonts and spacing. Instead of static values, calculate them based on the screen width relative to your design draft.</p>
                        
                        <blockquote>
                            <strong>Performance Tip:</strong> When building complex responsive UIs, use <code>RepaintBoundary</code> around heavy widgets to ensure that layout changes in one part of the screen don't trigger unnecessary repaints across the entire UI tree.
                        </blockquote>

                        <h3>Conclusion</h3>
                        <p>Building for mobile means building for change. By combining these techniques with a solid understanding of <code>Flexible</code> and <code>Expanded</code>, we can deliver experiences that feel custom-built for every device our users hold.</p>
                    </div>
                </div>
            `
        },
        {
            id: 'clean-arch',
            title: 'Clean Architecture in Production Apps',
            excerpt: 'Why MVVM and Clean Architecture are essential for long-term project stability. Lessons learned from 5+ live App Store deployments.',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
            link: '#',
            tags: ['#Architecture', '#Scale'],
            date: 'Dec 12, 2024',
            content: `
                <div class="blog-article">
                    <header class="article-header">
                        <span class="article-tag">Best Practices</span>
                        <h1 class="article-title">Clean Architecture in Production Apps</h1>
                        <div class="article-meta">
                            <span>Dec 12, 2024</span>
                            <span>•</span>
                            <span>5 min read</span>
                        </div>
                    </header>
                    <div class="article-image">
                        <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop" alt="Clean Code">
                    </div>
                    <div class="article-content">
                        <p>Maintaining a codebase for 5+ production apps requires more than just knowing how to code—it requires a system. That system is <strong>Clean Architecture</strong> mixed with <strong>SOLID</strong> principles.</p>
                        
                        <h3>Why MVVM?</h3>
                        <p>In Flutter, I strictly follow the Model-View-ViewModel pattern. This separation ensures that logic isn't tied to the UI. If I need to switch from Firebase to a local database, I only touch the Data Layer, leaving my UI and Business Logic layers intact.</p>
                        
                        <h3>Dependency Inversion (DI)</h3>
                        <p>One of the biggest lessons learned is the power of <em>Inversion of Control</em>. By depending on abstractions (interfaces) rather than concrete implementations, I can easily swap out services or mock them for testing.</p>

                        <pre><code>// Repository Interface (Domain Layer)
abstract class UserRepository {
  Future<User> getUser(String id);
}

// Concrete Implementation (Data Layer)
class UserRemoteSource implements UserRepository {
  @override
  Future<User> getUser(String id) async {
    // API call logic here
  }
}</code></pre>

                        <h3>Layered Responsibilities</h3>
                        <ul>
                            <li><strong>Domain Layer:</strong> The heart of the app. Contains Entities, Use Cases, and Repository interfaces. Zero external dependencies.</li>
                            <li><strong>Data Layer:</strong> The implementation detail. Repository implementations, Data Sources (API/DB), and Mappers.</li>
                            <li><strong>Presentation Layer:</strong> The visual skin. Flutter Widgets and State Management (GetX/Riverpod/Bloc).</li>
                        </ul>

                        <p>This structure has been the backbone of projects like <strong>Ability Amore</strong>, ensuring that as the app grows, the cognitive load for developers remains manageable.</p>
                    </div>
                </div>
            `
        }
    ];

    const blogGrid = document.getElementById('blogGrid');
    const blogModal = document.getElementById('blogModal');
    const blogModalContent = document.getElementById('blogModalContent');
    const blogModalClose = document.getElementById('blogModalClose');
    const blogModalOverlay = document.getElementById('blogModalOverlay');

    function openBlog(id) {
        const post = blogPosts.find(p => p.id === id);
        if (post) {
            blogModalContent.innerHTML = post.content;
            blogModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        }
    }

    function closeBlog() {
        blogModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
        setTimeout(() => {
            blogModalContent.innerHTML = '';
        }, 400);
    }

    if (blogGrid) {
        blogGrid.innerHTML = '';
        blogPosts.forEach((post, i) => {
            const card = document.createElement('article');
            card.className = 'blog-card reveal';
            card.style.transitionDelay = (i * 0.1) + 's';
            card.style.cursor = 'pointer';

            card.innerHTML = `
                <div class="blog-card-glow"></div>
                <div class="blog-card-image">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                    <div class="blog-date">${post.date}</div>
                </div>
                <div class="blog-card-body">
                    <div class="blog-tags">${post.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <span class="blog-link">
                        Read Insights
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            `;

            card.addEventListener('click', () => openBlog(post.id));

            blogGrid.appendChild(card);
            revealObserver.observe(card);
        });
    }

    if (blogModalClose) blogModalClose.addEventListener('click', closeBlog);
    if (blogModalOverlay) blogModalOverlay.addEventListener('click', closeBlog);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && blogModal && blogModal.classList.contains('active')) {
            closeBlog();
        }
    });

});
