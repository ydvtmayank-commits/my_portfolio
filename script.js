/**
 * ===================================================================
 * MAYANK YADAV - MECHANICAL ENGINEERING & AUTOMOTIVE PORTFOLIO
 * Core Interactive Scripts & Mechanical Canvas Simulation
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Copyright Year
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Typewriter Effect
    initTypewriter();

    // 3. Interactive Mechanics & Grid Canvas
    initMechanicsCanvas();

    // 4. Project Filtering
    initProjectFilter();

    // 5. Project Modal System
    initProjectModal();

    // 6. Navigation & Scroll Effects
    initNavigation();

    // 7. Contact Form Handling
    initContactForm();

    // 8. Terminal Interactivity
    initTerminalFun();
});

/**
 * Typewriter Effect for Hero Subtitle
 */
function initTypewriter() {
    const typewriterEl = document.getElementById('typewriterText');
    if (!typewriterEl) return;

    const phrases = [
        "Car Mechanics & Engine Teardowns",
        "Automotive Design & Fabrication",
        "Firearms Kinematics & Ballistics",
        "Precision Tolerances & Lathe Machining",
        "Hands-On Problem Solving & CAD"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 90;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 1800; // Pause at end of phrase
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400; // Pause before new phrase
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/**
 * Mechanical Interactive Canvas Simulation
 * Draws faint rotating gears and connected kinematic linkage nodes
 */
function initMechanicsCanvas() {
    const canvas = document.getElementById('mechanicsCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = {
        x: width / 2,
        y: height / 2,
        targetX: width / 2,
        targetY: height / 2
    };

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
    });

    // Node particles representing mechanical links
    const nodeCount = Math.floor(Math.min(width, 1400) / 38);
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.7,
            vy: (Math.random() - 0.5) * 0.7,
            radius: Math.random() * 2 + 1.2
        });
    }

    // Gear definition
    const gears = [
        { x: width * 0.15, y: height * 0.35, radius: 65, teeth: 16, angle: 0, speed: 0.004, color: 'rgba(255, 87, 34, 0.15)' },
        { x: width * 0.15 + 115, y: height * 0.35 + 50, radius: 52, teeth: 12, angle: 0.2, speed: -0.0053, color: 'rgba(0, 229, 255, 0.15)' },
        { x: width * 0.85, y: height * 0.7, radius: 78, teeth: 20, angle: 0, speed: 0.003, color: 'rgba(255, 255, 255, 0.08)' }
    ];

    function drawGear(gear) {
        ctx.save();
        ctx.translate(gear.x, gear.y);
        ctx.rotate(gear.angle);
        ctx.strokeStyle = gear.color;
        ctx.lineWidth = 1.5;

        // Base circle
        ctx.beginPath();
        ctx.arc(0, 0, gear.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner circle
        ctx.beginPath();
        ctx.arc(0, 0, gear.radius * 0.4, 0, Math.PI * 2);
        ctx.stroke();

        // Gear Teeth
        const step = (Math.PI * 2) / gear.teeth;
        ctx.beginPath();
        for (let i = 0; i < gear.teeth; i++) {
            const a = i * step;
            const rOuter = gear.radius + 8;
            const rInner = gear.radius;
            
            const x1 = Math.cos(a - step * 0.25) * rInner;
            const y1 = Math.sin(a - step * 0.25) * rInner;
            const x2 = Math.cos(a - step * 0.15) * rOuter;
            const y2 = Math.sin(a - step * 0.15) * rOuter;
            const x3 = Math.cos(a + step * 0.15) * rOuter;
            const y3 = Math.sin(a + step * 0.15) * rOuter;
            const x4 = Math.cos(a + step * 0.25) * rInner;
            const y4 = Math.sin(a + step * 0.25) * rInner;

            if (i === 0) ctx.moveTo(x1, y1);
            else ctx.lineTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.lineTo(x4, y4);
        }
        ctx.closePath();
        ctx.stroke();

        // Spokes
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            ctx.moveTo(Math.cos(angle) * (gear.radius * 0.4), Math.sin(angle) * (gear.radius * 0.4));
            ctx.lineTo(Math.cos(angle) * gear.radius, Math.sin(angle) * gear.radius);
        }
        ctx.stroke();

        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Ease mouse
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        // Render gears
        gears.forEach((gear) => {
            gear.angle += gear.speed;
            drawGear(gear);
        });

        // Render Kinematic linkages / Nodes
        ctx.lineWidth = 0.75;
        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            n.x += n.vx;
            n.y += n.vy;

            if (n.x < 0 || n.x > width) n.vx *= -1;
            if (n.y < 0 || n.y > height) n.vy *= -1;

            // Connect nearby nodes
            for (let j = i + 1; j < nodes.length; j++) {
                const n2 = nodes[j];
                const dx = n.x - n2.x;
                const dy = n.y - n2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    const alpha = (1 - dist / 130) * 0.22;
                    ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(n2.x, n2.y);
                    ctx.stroke();
                }
            }

            // Connection to mouse
            const mdx = n.x - mouse.x;
            const mdy = n.y - mouse.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mDist < 160) {
                const alpha = (1 - mDist / 160) * 0.35;
                ctx.strokeStyle = `rgba(255, 87, 34, ${alpha})`;
                ctx.beginPath();
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }

            // Draw Node
            ctx.fillStyle = 'rgba(241, 245, 249, 0.4)';
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/**
 * Filter Projects by Category
 */
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach((card) => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    });
}

/**
 * Interactive Project Details Modal System
 */
const projectDetailsData = {
    p1: {
        tag: "Automotive Diagnostics & Powertrain",
        title: "Internal Combustion Engine Complete Teardown & Diagnostic Mapping",
        desc: "A hands-on physical investigation into multi-component internal combustion engine mechanics. Explores cylinder head assembly, valve clearances, piston crown wear, crankcase breathing, and the exact thermodynamics of the 4-stroke cycle.",
        specs: [
            { key: "Cycle Type", val: "Otto 4-Stroke (Intake, Compression, Power, Exhaust)" },
            { key: "Tools Used", val: "Torque Wrench, Feeler Gauges, Piston Ring Compressor, Bore Gauge" },
            { key: "Core Learnings", val: "Overheating cause-identification, valve lash clearance adjustments, carbon buildup cleanup, dynamic compression ratio testing" },
            { key: "Engineering Focus", val: "Mechanical efficiency, oil viscosity degradation, thermal expansion clearances" }
        ],
        details: "This project deepened my appreciation for real-world mechanical tolerances. Beyond theoretical thermodynamic calculations, seeing how a 0.05mm clearance difference between valve stem and guide impacts oil blowby and power loss solidified my desire to specialize in automotive mechanics and high-performance engines."
    },
    p2: {
        tag: "Precision Mechanisms & Ballistics",
        title: "Kinematic Study of Rotating Bolt & Gas Operating Systems",
        desc: "A deep dive into the mechanical cycle of operation found in modern precision firearms and defense mechanisms. Investigates how high-pressure gas is harnessed through a gas port to unlock high-tensile locking lugs safely.",
        specs: [
            { key: "Mechanism Types", val: "Direct Impingement vs. Short-Stroke & Long-Stroke Gas Pistons" },
            { key: "Lockup Geometry", val: "Radial Rotating Bolt Head with Multi-Lug Engagement" },
            { key: "Chamber Pressure", val: "Kinetic calculations of 50,000+ PSI pressure curve decay" },
            { key: "Metallurgy Focus", val: "Chrome-moly vanadium alloys, Nitriding, Case-hardening" }
        ],
        details: "Firearms mechanics are among the most stringent demonstrations of mechanical timing in existence. If the bolt unlocks even microseconds too early before chamber pressures drop to ambient, catastrophic failure occurs. Studying the cam path angle, buffer spring harmonic frequency, and carrier mass opened my eyes to high-velocity kinematics."
    },
    p3: {
        tag: "Automotive Chassis Engineering",
        title: "Tubular Spaceframe Go-Kart / Buggy Chassis Design",
        desc: "Structural engineering design for a lightweight, rigid tubular spaceframe chassis. Utilizes triangulated load paths to resist torsional twisting during aggressive cornering.",
        specs: [
            { key: "Material Spec", val: "AISI 1018 / 1020 Seamless DOM Mild Steel Tubing" },
            { key: "Steering Principle", val: "True 100% Ackerman Steering Geometry" },
            { key: "Suspension", val: "Double A-Arm Unequal Length Front Geometry" },
            { key: "Target Weight", val: "Sub-120kg rolling chassis with low roll center" }
        ],
        details: "Focusing on roll-over safety protection, structural torsional rigidity, and center of gravity management. Designed to optimize handling through proper camber gain curves under hard lateral acceleration."
    },
    p4: {
        tag: "CAD & Kinematic Transmission",
        title: "3D CAD Modeling of Mechanical Gearboxes & Differential",
        desc: "Detailed 3D parametric computer-aided modeling of manual transmission gears, dog clutches, synchromesh cones, and automotive open bevel gear differentials.",
        specs: [
            { key: "Software", val: "AutoCAD & 3D Solid Modeling Tools" },
            { key: "Tooth Profile", val: "Standard Involute Curve with Correct Addendum/Dedendum" },
            { key: "Differential Action", val: "Sun & Planet Bevel Gear torque equalization while cornering" },
            { key: "Output", val: "Orthographic Engineering Projections & Exploded Assembly Views" }
        ],
        details: "Translating mechanical calculations into tangible 3D models. Verifying interference fits, backlash tolerances (0.15mm), and proper lubrication channel channels in the gear housing."
    },
    p5: {
        tag: "Practical Workshop & Maintenance",
        title: "Vehicle Maintenance & DIY Brake / Suspension Overhauls",
        desc: "Practical car workshop repairs executed with proper workshop safety procedures. Routine and advanced automotive service tasks performed directly on physical vehicles.",
        specs: [
            { key: "Brake Systems", val: "Disc brake pad renewal, caliper piston reset, DOT4 hydraulic bleeding" },
            { key: "Suspension", val: "MacPherson strut teardown, coil spring compression, bushing inspection" },
            { key: "Ignition / Fuel", val: "Spark plug gap setting with wire gauges, fuel filter replacement" },
            { key: "Diagnostics", val: "Vibration isolation, abnormal engine sound diagnostics, coolant flush" }
        ],
        details: "There is no substitute for turning a wrench. Understanding fastener torque specifications, preventing cross-threading in aluminum cylinder heads, and mastering brake hydraulic bleeding provides real-world engineering intuition that software simulations cannot teach alone."
    },
    p6: {
        tag: "Manufacturing & Metrology",
        title: "Machining Tolerances & Surface Finish Comparative Study",
        desc: "Study of ISO fit standards (clearance, transition, interference fits) in lathe turning, milling, and precision grinding for rotating mechanical shafts and bearings.",
        specs: [
            { key: "Measuring Tools", val: "0-25mm Micrometer (0.001mm), Vernier Caliper, Dial Test Indicator" },
            { key: "Tolerance Class", val: "H7 / g6 precision sliding and locator fits" },
            { key: "Surface Ra", val: "Evaluation of tool feed rate, spindle RPM, and coolant on Ra finish" },
            { key: "Applications", val: "Automotive crankshaft journals, firing pin channels, gear shafts" }
        ],
        details: "Investigating how heat generated during turning causes workpieces to expand, requiring temperature compensation when taking final micrometer passes for critical bearing journals."
    }
};

function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalClose = document.getElementById('modalClose');
    const modalBody = document.getElementById('modalBody');
    const openBtns = document.querySelectorAll('.open-modal-btn');

    if (!modal || !modalBody) return;

    function openModal(projectId) {
        const data = projectDetailsData[projectId];
        if (!data) return;

        let specsHtml = data.specs
            .map(
                (s) => `
            <tr>
                <th>${s.key}</th>
                <td>${s.val}</td>
            </tr>
        `
            )
            .join('');

        modalBody.innerHTML = `
            <span class="modal-project-tag"><i class="fa-solid fa-microchip"></i> ${data.tag}</span>
            <h2 class="modal-project-title">${data.title}</h2>
            <p class="modal-text">${data.desc}</p>
            
            <h4 class="modal-section-title"><i class="fa-solid fa-list-check"></i> Technical Specifications & Methods</h4>
            <table class="modal-specs-table">
                <tbody>
                    ${specsHtml}
                </tbody>
            </table>

            <h4 class="modal-section-title"><i class="fa-solid fa-lightbulb"></i> Engineering Takeaway & Practical Insight</h4>
            <p class="modal-text">${data.details}</p>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    openBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const pid = btn.getAttribute('data-project');
            openModal(pid);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/**
 * Navigation, Smooth Scroll & Back to Top
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky navbar & back-to-top visibility
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active link tracking
        const sections = document.querySelectorAll('section[id]');
        sections.forEach((sec) => {
            const top = sec.offsetTop - 120;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Mobile Hamburger
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close on link click
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Back to top click
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Contact Form Simulation with Instant Visual Feedback
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formSuccessMessage');

    if (!form || !feedback) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<span><i class="fa-solid fa-spinner fa-spin"></i> Transmitting...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            feedback.classList.remove('hidden');
            form.reset();

            setTimeout(() => {
                feedback.classList.add('hidden');
            }, 6000);
        }, 800);
    });
}

/**
 * Interactive Terminal Easter Egg
 */
function initTerminalFun() {
    const terminalBody = document.getElementById('terminalBody');
    if (!terminalBody) return;

    terminalBody.addEventListener('click', () => {
        const extraLogs = [
            "Running engine diagnostic: No misfires detected in cylinder 1-4.",
            "Gas port calculation verified: dwell time optimal for 16-inch barrel.",
            "Torsion test: Tubular spaceframe deflection < 1.2 degrees at 1500 Nm.",
            "Lathe calibration: Spindle runout measured within 0.005mm."
        ];
        const randomLog = extraLogs[Math.floor(Math.random() * extraLogs.length)];
        
        const newP = document.createElement('p');
        newP.className = 't-output';
        newP.innerHTML = `<span style="color: #ff5722;">[LOG]</span> ${randomLog}`;
        
        const lastLine = terminalBody.querySelector('.t-line:last-child');
        if (lastLine) {
            terminalBody.insertBefore(newP, lastLine);
        }
    });
}
