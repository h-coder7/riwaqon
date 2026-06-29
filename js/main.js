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
    // const navbar = $('.navbar');

    // lenis.on('scroll', function (e) {
    //     const scrollTop = e.scroll;

    //     if (scrollTop > 400) {
    //         navbar.addClass('nav-scroll');
    //         navbar.removeClass('navbar-dark');
    //     } else {
    //         navbar.removeClass('nav-scroll');
    //         navbar.addClass('navbar-dark');
    //     }
    // });

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
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            480: {
                slidesPerView: 1,
            },
            787: {
                slidesPerView: 1,
            },
            991: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 3,
            },
        },
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

