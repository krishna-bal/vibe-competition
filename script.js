// Loader logic and all enhancements
window.addEventListener('DOMContentLoaded', () => {
  // Loader
  const loader = document.getElementById('loader');
  const mainContent = document.getElementById('main-content');
  const loaderVideo = loader.querySelector('video');

  // Hide loader when video is ready, fallback to timeout
  let loaderHidden = false;
  function hideLoader() {
    if (loaderHidden) return;
    loaderHidden = true;
    loader.style.display = 'none';
    mainContent.style.display = 'block';
  }
  if (loaderVideo) {
    loaderVideo.addEventListener('canplaythrough', hideLoader);
    // Fallback: hide loader after 3.5s if video takes too long
    setTimeout(hideLoader, 3500);
  } else {
    // No video, fallback to timeout
    setTimeout(hideLoader, 1500);
  }

  // Light/Dark mode
  const modeToggle = document.getElementById('mode-toggle');
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    modeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  };
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
  modeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Smooth scroll for anchor links
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Section reveal on scroll
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealOnScroll = () => {
    const trigger = window.innerHeight * 0.92;
    revealEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < trigger) {
        el.classList.add('revealed');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

  // Back to Top button
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Stats count-up animation
  let statsAnimated = false;
  function animateStats() {
    if (statsAnimated) return;
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
      const target = +stat.getAttribute('data-count');
      let count = 0;
      const step = Math.ceil(target / 60);
      const update = () => {
        count += step;
        if (count > target) count = target;
        stat.textContent = count;
        if (count < target) {
          requestAnimationFrame(update);
        }
      };
      update();
    });
    statsAnimated = true;
  }
  window.addEventListener('scroll', () => {
    const statsSection = document.getElementById('stats');
    if (!statsAnimated && statsSection.getBoundingClientRect().top < window.innerHeight * 0.85) {
      animateStats();
    }
  });

  // Hamburger menu logic
  const hamburger = document.getElementById('hamburger');
  const navLinksList = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    navLinksList.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', navLinksList.classList.contains('open'));
  });

  // Ripple effect for .cta-btn and #mode-toggle
  function addRipple(e) {
    const btn = e.currentTarget;
    const circle = document.createElement('span');
    circle.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    circle.style.left = (e.clientX - rect.left) + 'px';
    circle.style.top = (e.clientY - rect.top) + 'px';
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  }
  document.querySelectorAll('.cta-btn, #mode-toggle').forEach(btn => {
    btn.addEventListener('click', addRipple);
  });

  // Contact form demo handler
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('Thank you for your message! (Demo only)');
      contactForm.reset();
    });
  }

  // Gallery Carousel Logic
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');
  let currentSlide = 0;
  function showSlide(idx) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === idx);
      if (slide.querySelector('video')) {
        slide.querySelector('video').pause();
        slide.querySelector('video').currentTime = 0;
      }
    });
    Array.from(dotsContainer.children).forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
    });
    currentSlide = idx;
  }
  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => showSlide(i));
    dotsContainer.appendChild(dot);
  });
  prevBtn.addEventListener('click', () => {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
  });
  nextBtn.addEventListener('click', () => {
    showSlide((currentSlide + 1) % slides.length);
  });
  // Optional: swipe support for mobile
  let startX = null;
  const carousel = document.querySelector('.carousel');
  carousel.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });
  carousel.addEventListener('touchend', e => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    if (endX - startX > 50) prevBtn.click();
    else if (startX - endX > 50) nextBtn.click();
    startX = null;
  });
  // Show initial slide
  showSlide(0);

  // Navbar scroll shadow and active link highlight
  const navbar = document.querySelector('.navbar');
  const navLinksA = document.querySelectorAll('.nav-links a');
  function onScrollNav() {
    if (window.scrollY > 10) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    // Active link highlight
    let fromTop = window.scrollY + 80;
    navLinksA.forEach(link => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section && section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  window.addEventListener('scroll', onScrollNav);
  onScrollNav();

  // CTA pulse and smooth scroll
  const ctaBtn = document.querySelector('.cta-btn');
  if (ctaBtn) {
    ctaBtn.classList.add('pulse');
    ctaBtn.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Card tilt effect
  function handleTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;
    card.style.setProperty('--tilt-x', `${percentX * 8}deg`);
    card.style.setProperty('--tilt-y', `${-percentY * 8}deg`);
    card.classList.add('tilt');
  }
  function resetTilt(e) {
    const card = e.currentTarget;
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
    card.classList.remove('tilt');
  }
  document.querySelectorAll('.feature-card, .stat-card').forEach(card => {
    card.addEventListener('mousemove', handleTilt);
    card.addEventListener('mouseleave', resetTilt);
    card.addEventListener('focus', resetTilt);
  });

  // Gallery carousel: auto-play, keyboard nav, pause on hover
  let carouselInterval = null;
  function startCarouselAutoPlay() {
    if (carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
      showSlide((currentSlide + 1) % slides.length);
    }, 6000);
  }
  function stopCarouselAutoPlay() {
    if (carouselInterval) clearInterval(carouselInterval);
  }
  const galleryCarousel = document.querySelector('.carousel');
  if (galleryCarousel) {
    galleryCarousel.addEventListener('mouseenter', stopCarouselAutoPlay);
    galleryCarousel.addEventListener('mouseleave', startCarouselAutoPlay);
    galleryCarousel.addEventListener('focusin', stopCarouselAutoPlay);
    galleryCarousel.addEventListener('focusout', startCarouselAutoPlay);
    galleryCarousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') prevBtn.click();
      if (e.key === 'ArrowRight') nextBtn.click();
    });
    galleryCarousel.setAttribute('tabindex', '0');
    startCarouselAutoPlay();
  }

  // Stats tooltips
  document.querySelectorAll('.stat-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('focus', () => {
      const tip = card.querySelector('.tooltip');
      if (tip) tip.style.display = 'block';
    });
    card.addEventListener('blur', () => {
      const tip = card.querySelector('.tooltip');
      if (tip) tip.style.display = 'none';
    });
  });

  // Testimonial carousel logic
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const testimonialPrev = document.getElementById('testimonial-prev');
  const testimonialNext = document.getElementById('testimonial-next');
  const testimonialDots = document.getElementById('testimonial-dots');
  let testimonialIdx = 0;
  let testimonialInterval = null;
  function showTestimonial(idx) {
    testimonialSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === idx);
      const vid = slide.querySelector('video');
      if (vid) {
        if (i === idx) vid.pause(); // don't autoplay testimonial video
        else { vid.pause(); vid.currentTime = 0; }
      }
    });
    Array.from(testimonialDots.children).forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
    });
    testimonialIdx = idx;
  }
  // Create dots
  testimonialSlides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    dot.addEventListener('click', () => showTestimonial(i));
    testimonialDots.appendChild(dot);
  });
  testimonialPrev.addEventListener('click', () => {
    showTestimonial((testimonialIdx - 1 + testimonialSlides.length) % testimonialSlides.length);
  });
  testimonialNext.addEventListener('click', () => {
    showTestimonial((testimonialIdx + 1) % testimonialSlides.length);
  });
  // Auto-advance
  function startTestimonialAuto() {
    if (testimonialInterval) clearInterval(testimonialInterval);
    testimonialInterval = setInterval(() => {
      showTestimonial((testimonialIdx + 1) % testimonialSlides.length);
    }, 7000);
  }
  function stopTestimonialAuto() {
    if (testimonialInterval) clearInterval(testimonialInterval);
  }
  const testimonialCarousel = document.querySelector('.testimonial-carousel');
  if (testimonialCarousel) {
    testimonialCarousel.addEventListener('mouseenter', stopTestimonialAuto);
    testimonialCarousel.addEventListener('mouseleave', startTestimonialAuto);
    testimonialCarousel.addEventListener('focusin', stopTestimonialAuto);
    testimonialCarousel.addEventListener('focusout', startTestimonialAuto);
    testimonialCarousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') testimonialPrev.click();
      if (e.key === 'ArrowRight') testimonialNext.click();
    });
    testimonialCarousel.setAttribute('tabindex', '0');
    startTestimonialAuto();
  }
  showTestimonial(0);

  // Testimonial video play/pause overlay logic
  document.querySelectorAll('.testimonial-video-wrapper').forEach(wrapper => {
    const video = wrapper.querySelector('video');
    const overlay = wrapper.querySelector('.video-overlay');
    function updateOverlay() {
      if (video.paused) {
        overlay.classList.add('play');
        overlay.classList.remove('pause');
      } else {
        overlay.classList.remove('play');
        overlay.classList.add('pause');
      }
    }
    overlay.addEventListener('click', () => {
      if (video.paused) video.play();
      else video.pause();
      updateOverlay();
    });
    video.addEventListener('click', () => {
      if (video.paused) video.play();
      else video.pause();
      updateOverlay();
    });
    video.addEventListener('play', updateOverlay);
    video.addEventListener('pause', updateOverlay);
    updateOverlay();
  });

  // Animate contact form success message
  const contactSuccess = document.getElementById('contact-success');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();
      if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      contactSuccess.style.display = 'block';
      contactForm.reset();
      setTimeout(() => {
        contactSuccess.style.display = 'none';
      }, 2500);
    });
  }

  // Scroll-down indicator scrolls to features
  const scrollDown = document.querySelector('.scroll-down-indicator');
  if (scrollDown) {
    scrollDown.addEventListener('click', () => {
      document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Image lightbox modal
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const modalClose = document.getElementById('modal-close');

  // Enable modal for gallery images and videos
  document.querySelectorAll('.gallery-videos img, .gallery-videos video').forEach(media => {
    media.style.cursor = 'zoom-in';
    media.addEventListener('click', () => {
      modal.style.display = 'flex';
      if (media.tagName.toLowerCase() === 'img') {
        modalImg.src = media.src;
        modalImg.style.display = 'block';
        // Remove any previous video
        if (modalImg.nextSibling && modalImg.nextSibling.tagName === 'VIDEO') {
          modalImg.nextSibling.remove();
        }
      } else if (media.tagName.toLowerCase() === 'video') {
        // Remove any previous video
        if (modalImg.nextSibling && modalImg.nextSibling.tagName === 'VIDEO') {
          modalImg.nextSibling.remove();
        }
        modalImg.style.display = 'none';
        const video = document.createElement('video');
        video.src = media.src;
        video.controls = true;
        video.autoplay = true;
        video.style.maxWidth = '90vw';
        video.style.maxHeight = '80vh';
        video.style.borderRadius = '1rem';
        video.style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)';
        modalImg.parentNode.insertBefore(video, modalImg.nextSibling);
      }
      document.body.style.overflow = 'hidden';
    });
  });
  function closeModal() {
    modal.style.display = 'none';
    modalImg.src = '';
    modalImg.style.display = 'block';
    // Remove any video if present
    if (modalImg.nextSibling && modalImg.nextSibling.tagName === 'VIDEO') {
      modalImg.nextSibling.remove();
    }
    document.body.style.overflow = '';
  }
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (modal.style.display === 'flex' && e.key === 'Escape') closeModal();
  });
}); 