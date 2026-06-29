$(document).ready(function () {
    var wind = $(window);

    // Initialize Lenis
    window.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // Connect Lenis to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after a small delay to ensure correct positions
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);

    wow = new WOW({
        boxClass: "wow",
        animateClass: "animated",
        offset: 200,
        mobile: false,
        live: false,
    });
    wow.init();

    // ---------- fixed nav -----------
    const navbar = $('.navbar');

    lenis.on('scroll', function (e) {
        const scrollTop = e.scroll;

        if (scrollTop > 400) {
            navbar.addClass('nav-scroll');
            navbar.removeClass('navbar-dark');
        } else {
            navbar.removeClass('nav-scroll');
            navbar.addClass('navbar-dark');
        }
    });

    // ---------- to top -----------
    $(".to-top, .progress-wrap").off("click").on("click", function () {
        lenis.scrollTo(0, {
            duration: 2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
        return false;
    });

    // counter
    $('.counter').countUp({
        delay: 10,
        time: 2000
    });


    // scrollup & scrolldown 
    let lastScroll = 0;
    lenis.on('scroll', ({ scroll }) => {
        if (scroll > lastScroll) {
            document.documentElement.classList.remove('scroll-up');
        } else {
            document.documentElement.classList.add('scroll-up');
        }
        lastScroll = scroll;
    });

});

// ------------ swiper sliders -----------
$(document).ready(function () {

    // partners slider 
    var swiper = new Swiper(".partners-slider", {
        slidesPerView: "auto",
        spaceBetween: 30,
        centeredSlides: true,
        pagination: false,
        navigation: false,
        mousewheel: false,
        keyboard: true,
        speed: 10000,
        allowTouchMove: false,
        a11y: false,
        autoplay: {
            delay: 1,
        },
        loop: true,
        breakpoints: {
            0: {
                slidesPerView: 2,
            },
            480: {
                slidesPerView: 2,
            },
            787: {
                slidesPerView: 3,
            },
            991: {
                slidesPerView: 4,
            },
            1200: {
                slidesPerView: 5,
            },
        },
    });

    // testimonials slider 
    const testimonialsSwiper = new Swiper('.testimonials .testimonials_swiper', {
        spaceBetween: 30,
        centeredSlides: true,
        speed: 1500,
        autoplay: {
            delay: 5000,
        },
        navigation: {
            nextEl: '.testimonials .swiper-button-next',
            prevEl: '.testimonials .swiper-button-prev',
        },
        pagination: {
            el: '.testimonials .swiper-pagination',
            clickable: true
        },
        loop: true,
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            480: {
                slidesPerView: 2,
            },
            787: {
                slidesPerView: 3,
            },
            991: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 3,
            },
        },

    });

    // solution lead side sliders 
    var swiper = new Swiper('.solution .marq-slider', {
        slidesPerView: "auto",
        spaceBetween: 50,
        centeredSlides: true,
        pagination: false,
        navigation: false,
        mousewheel: false,
        keyboard: true,
        speed: 3000,
        allowTouchMove: false,
        a11y: false,
        autoplay: {
            delay: 1,
        },
        loop: true,
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            480: {
                slidesPerView: 2,
            },
            787: {
                slidesPerView: 3,
            },
            991: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 3,
            },
        },
    });

    // -------- new scripts 
    // ------------ hero iimgs slider -----------
    var swiper = new Swiper('.hero .gallery-slider', {
        slidesPerView: 3,
        spaceBetween: 30,
        centeredSlides: true,
        pagination: false,
        navigation: false,
        mousewheel: false,
        keyboard: true,
        speed: 6000,
        allowTouchMove: false,
    	a11y: false,
        autoplay: {
            delay: 1,
        },
        loop: true,
    });

    // ------------ header marq slider -----------
    var swiper = new Swiper('.hero .marq-slider', {
        slidesPerView: "auto",
        spaceBetween: 100,
        centeredSlides: true,
        pagination: false,
        navigation: false,
        mousewheel: false,
        keyboard: true,
        speed: 15000,
        allowTouchMove: false,
        autoplay: {
            delay: 1,
        },
        loop: true,
    });

});

/* --------------------------------------------------------------
                        [ gsap scripts ]
-------------------------------------------------------------- */

gsap.registerPlugin(ScrollTrigger);

// Run only if window width > 991px
if (window.innerWidth > 991) {
    $(function () {

        // gs image parallax
        const parallaxImages = document.querySelectorAll(".gs-img-parallax");
        parallaxImages.forEach((container) => {
            const img = container.querySelector("img");
            container.style.overflow = "hidden";
            // effect Parallax + Zoom
            gsap.to(img, {
                yPercent: -20,
                scale: 1.2,
                ease: "none",
                scrollTrigger: {
                    trigger: container,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                    // pin: true,
                },
            });
        });
    });

    // ----------- pin cards ----------
    const items = gsap.utils.toArray(".pin-card");
    const lastCard = items[items.length - 1];

    items.forEach((item, index) => {
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: "top top",
                endTrigger: lastCard,
                end: "bottom top+=500",
                pin: true,
                pinSpacing: false,
                scrub: true,
            },
        });
    });

    // flipScroll1 animation
    const flipScrollCards = document.querySelectorAll(".flip-scroll-st1");

    flipScrollCards.forEach((card) => {
        gsap.to(card, {
            y: 0,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            ease: "power1.out",
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                end: "bottom top",
                scrub: 1,
                invalidateOnRefresh: true,
            },
        });
    });

    // letters animation
    window.addEventListener("load", () => {
        document.querySelectorAll(".letters-line").forEach((title) => {
            if (title.dataset.lettersProcessed) return;
            title.dataset.lettersProcessed = true;

            function processTextNodes(element) {
                const walker = document.createTreeWalker(
                    element,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false,
                );
                const textNodes = [];
                let node;
                while ((node = walker.nextNode())) {
                    if (node.textContent.trim() !== "") textNodes.push(node);
                }

                textNodes.forEach((textNode) => {
                    const text = textNode.textContent;
                    const parent = textNode.parentNode;

                    const words = text.split(/(\s+)/);
                    const fragment = document.createDocumentFragment();

                    words.forEach((word) => {
                        if (word.trim() === "") {
                            fragment.appendChild(document.createTextNode(word));
                        } else {
                            const wordWrapper = document.createElement("span");
                            wordWrapper.className = "word";
                            wordWrapper.style.display = "inline-block";
                            wordWrapper.style.whiteSpace = "nowrap";
                            wordWrapper.innerHTML = word;

                            fragment.appendChild(wordWrapper);
                        }
                    });

                    parent.replaceChild(fragment, textNode);
                });
            }

            processTextNodes(title);

            gsap.fromTo(
                title.querySelectorAll(".word"),
                {
                    scale: 2,
                    filter: "blur(20px)",
                    opacity: 0,
                    y: 50,
                },
                {
                    scrollTrigger: {
                        trigger: title,
                        scroller: window,
                        start: "top 110%",
                        toggleActions: "play none none none",
                    },
                    scale: 1,
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: -0.3,
                    stagger: 0.1,
                    ease: "power4.out",
                },
            );
        });

        ScrollTrigger.refresh();
    });
}

// loader scripts
function initLoader() {
    const particlesContainer = document.getElementById("particles");
    if (!particlesContainer) return;

    const numParticles = 12;
    const radius = 150;

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particlesContainer.appendChild(particle);

        const angle = (360 / numParticles) * i;

        const x = radius * Math.cos((angle * Math.PI) / 180);
        const y = radius * Math.sin((angle * Math.PI) / 180);

        gsap.set(particle, {
            x: x,
            y: y,
        });

        gsap.to(particle, {
            rotation: 360,
            transformOrigin: `${-x}px ${-y}px`,
            repeat: -1,
            duration: 4,
            ease: "none",
            delay: i * 0.1,
        });
    }
}

initLoader();

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader-wrapper");
    if (!loader) return;

    $(".loader-wrapper").fadeOut("slow", function () {
        $(this).remove();
    });
});


// -------- Enhanced Parallax img mouse move -------
if ($(window).width() > 991) {
    $(function () {
        var parallaxContainers = document.getElementsByClassName(
            "parallaxed-container",
        );

        for (var j = 0; j < parallaxContainers.length; j++) {
            var container = parallaxContainers[j];

            container.addEventListener("mouseenter", function (event) {
                this.addEventListener("mousemove", parallaxed);
            });

            container.addEventListener("mouseleave", function (event) {
                this.removeEventListener("mousemove", parallaxed);
                // Reset transforms when mouse leaves
                var parallaxElements = this.getElementsByClassName("parallaxed");
                for (var i = 0; i < parallaxElements.length; i++) {
                    parallaxElements[i].style.transform = "translate(0px, 0px) scale(1)";
                }
            });
        }

        function parallaxed(e) {
            var container = this;
            var containerRect = container.getBoundingClientRect();
            var mouseX = e.clientX - containerRect.left;
            var mouseY = e.clientY - containerRect.top;
            var containerWidth = containerRect.width;
            var containerHeight = containerRect.height;

            // Calculate normalized mouse position (-1 to 1)
            var normalizedX = (mouseX / containerWidth) * 2 - 1;
            var normalizedY = (mouseY / containerHeight) * 2 - 1;

            var parallaxElements = container.getElementsByClassName("parallaxed");

            for (var i = 0; i < parallaxElements.length; i++) {
                var element = parallaxElements[i];
                var elementRect = element.getBoundingClientRect();
                var elementCenterX =
                    elementRect.left + elementRect.width / 2 - containerRect.left;
                var elementCenterY =
                    elementRect.top + elementRect.height / 2 - containerRect.top;

                // Calculate distance from mouse to element center
                var distanceX = (mouseX - elementCenterX) / containerWidth;
                var distanceY = (mouseY - elementCenterY) / containerHeight;

                // Different movement intensity based on element index
                var intensity = 0.4 + i * 0.15; // Increased intensity

                // Movement calculations - increased values
                var amountMovedX = distanceX * intensity * 50;
                var amountMovedY = distanceY * intensity * 50;

                // Enhanced scale based on mouse proximity
                var scale = 1 + (Math.abs(distanceX) + Math.abs(distanceY)) * 0.05;

                // Combine transformations
                element.style.transform = `
                        translate(${amountMovedX}px, ${amountMovedY}px) 
                        scale(${scale})
                    `;
            }
        }
    });
}

// ---------- AI Chat Animation ----------
$(document).ready(function () {
    const clientText = document.getElementById("clientText");
    const aiText = document.getElementById("aiText");
    const clientBubble = document.getElementById("clientBubble");
    const aiBubble = document.getElementById("aiBubble");

    if (!clientText || !aiText) return;

    const stepsElements = document.querySelectorAll("#conversation-steps .step");
    if (stepsElements.length === 0) return;

    const conversation = Array.from(stepsElements).map(el => {
        const side = el.dataset.side;
        return {
            side: side,
            text: el.textContent.trim(),
            container: side === "client" ? clientBubble : aiBubble,
            element: side === "client" ? clientText : aiText,
        };
    });

    let currentStep = 0;

    async function typeEffect(element, text) {
        element.textContent = "";
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            await new Promise((resolve) => setTimeout(resolve, 30));
        }
    }

    function resetBubbles() {
        gsap.set([clientBubble, aiBubble], { opacity: 0, y: 20 });
        clientText.textContent = "";
        aiText.textContent = "";
    }

    async function startChatLoop() {
        while (true) {
            const step = conversation[currentStep];

            // Hide other bubble if switching sides or starting over
            if (currentStep === 0) {
                gsap.to([clientBubble, aiBubble], { opacity: 0, y: 20, duration: 0.5 });
                await new Promise((r) => setTimeout(r, 600));
                resetBubbles();
            }

            // Show current bubble
            gsap.to(step.container, { opacity: 1, y: 0, duration: 0.5 });

            // Type text
            await typeEffect(step.element, step.text);

            // Wait after typing
            await new Promise((r) => setTimeout(r, 2000));

            currentStep = (currentStep + 1) % conversation.length;

            // If we finished a full cycle (Client + AI), wait a bit more before next
            if (currentStep % 2 === 0) {
                await new Promise((r) => setTimeout(r, 1000));
            }
        }
    }

    // Start the loop
    startChatLoop();
});


document.addEventListener('DOMContentLoaded', function () {
    gsap.registerPlugin(MotionPathPlugin);

    const circles = document.querySelectorAll('.icon-circle');
    circles.forEach((circle, index) => {
        const randomLeft = Math.random() * 85;
        circle.style.left = `${randomLeft}%`;
        circle.style.animationDelay = `${index * 1.5}s`;
        circle.classList.add('fall-in');
    });


    /**
     * @param {HTMLElement} wrapper  — the .flow-wrapper element
     */
    function initFlowInstance(wrapper) {
        const pathsGroup = wrapper.querySelector('[id^="paths"]') || wrapper.querySelector('#paths');
        const satellites = wrapper.querySelectorAll('.node.satellite');

        if (!pathsGroup || satellites.length === 0) return;

        if (!pathsGroup.id || pathsGroup.id === 'paths') {
            pathsGroup.id = 'paths-' + Math.random().toString(36).slice(2, 8);
        }

        let activeTweens = [];

        const nodeListeners = new WeakMap();

        function buildLayout() {
            activeTweens.forEach(t => t.kill());
            activeTweens = [];
            pathsGroup.innerHTML = '';

            const rect = wrapper.getBoundingClientRect();
            const wrapperW = rect.width;
            const wrapperH = rect.height;

            if (wrapperW === 0 || wrapperH === 0) return;

            const scaleX = 1000 / wrapperW;
            const scaleY = 600 / wrapperH;
            const baseDist = Math.min(wrapperW, wrapperH);

            satellites.forEach((node, i) => {
                const gx = parseFloat(node.style.getPropertyValue('--gx'));
                const gy = parseFloat(node.style.getPropertyValue('--gy'));
                const distInput = parseFloat(node.style.getPropertyValue('--dist'));

                const dist = baseDist * (distInput / 650);
                const x = gx * dist;
                const y = gy * dist;

                node.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;

                const x1 = 500 + x * scaleX;
                const y1 = 300 + y * scaleY;
                const x2 = 500;
                const y2 = 300;

                let pathData;
                if (gx === 0 || gy === 0) {
                    pathData = `M ${x1} ${y1} L ${x2} ${y2}`;
                } else {
                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const len = Math.sqrt(dx * dx + dy * dy);
                    const nx = -dy / len;
                    const ny = dx / len;
                    const offset = len * 0.25;
                    const waveDir = (gx * gy > 0) ? 1 : -1;
                    const c1x = x1 + dx * 0.3 + nx * offset * waveDir;
                    const c1y = y1 + dy * 0.3 + ny * offset * waveDir;
                    const c2x = x1 + dx * 0.7 - nx * offset * waveDir;
                    const c2y = y1 + dy * 0.7 - ny * offset * waveDir;
                    pathData = `M ${x1} ${y1} C ${c1x} ${c1y} ${c2x} ${c2y} ${x2} ${y2}`;
                }

                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', pathData);
                path.setAttribute('class', 'connection-path');
                path.setAttribute('id', `path-${pathsGroup.id}-${i}`);
                pathsGroup.appendChild(path);

                // Create particle + trail
                [{ r: 2.5, opacity: 1, offset: 0 }, { r: 1.5, opacity: 0.5, offset: 0.1 }]
                    .forEach(cfg => {
                        const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        el.setAttribute('r', cfg.r);
                        el.setAttribute('class', 'light-particle');
                        el.style.opacity = cfg.opacity;
                        pathsGroup.appendChild(el);

                        const duration = 2.5 + Math.random() * 2;
                        const delay = Math.random() * 2 + cfg.offset;

                        const tween = gsap.to(el, {
                            duration,
                            repeat: -1,
                            ease: 'power1.inOut',
                            delay,
                            motionPath: {
                                path,
                                align: path,
                                autoRotate: true,
                                alignOrigin: [0.5, 0.5]
                            }
                        });
                        activeTweens.push(tween);
                    });

                if (nodeListeners.has(node)) {
                    const old = nodeListeners.get(node);
                    node.removeEventListener('mouseenter', old.enter);
                    node.removeEventListener('mouseleave', old.leave);
                }

                const onEnter = () => {
                    gsap.to(path, { stroke: 'var(--cr-main)', strokeWidth: 3, opacity: 0.8, duration: 0.4 });
                    gsap.to(node, { scale: 1.1, duration: 0.4 });
                    node.style.borderColor = 'var(--cr-main)';
                };
                const onLeave = () => {
                    gsap.to(path, { stroke: 'rgba(87, 75, 87, 0.1)', strokeWidth: 1.5, opacity: 1, duration: 0.4 });
                    gsap.to(node, { scale: 1, duration: 0.4 });
                    node.style.borderColor = 'rgba(91, 72, 91, 0.15)';
                };

                node.addEventListener('mouseenter', onEnter);
                node.addEventListener('mouseleave', onLeave);
                nodeListeners.set(node, { enter: onEnter, leave: onLeave });
            });
        }

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(buildLayout, 120);
        });

        setTimeout(buildLayout, 300);
    }

    document.querySelectorAll('.flow-wrapper').forEach(initFlowInstance);

});



// floating-lines-container
$(document).ready(function () {
    new FloatingLines('#floating-lines-container', {
        enabledWaves: ["top", "middle", "bottom"],
        lineCount: 6,
        lineDistance: 6,
        bendRadius: 6,
        bendStrength: -0.6,
        interactive: true,
        parallax: true
    });
});

