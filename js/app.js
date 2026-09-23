/**
 * Kirti YK — Relationship Clarity Landing Page V3 Logic
 * Vanilla JavaScript + GSAP ScrollTrigger
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initQuestionAccordion();
  initFAQ();
  initModal();
  initInlineForm();
  initStickyMobileCTA();
  initVideoTrigger();
  initScrollAnimations();
});

/* --------------------------------------------------------------------------
   1. Site Header & Scroll Detection
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. Interactive Problem Question Cards
   -------------------------------------------------------------------------- */
function initQuestionAccordion() {
  const questionCards = document.querySelectorAll('.question-card');
  if (!questionCards.length) return;

  questionCards.forEach((card) => {
    const headerBtn = card.querySelector('.question-card-header');
    if (!headerBtn) return;

    headerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isAlreadyActive = card.classList.contains('active');

      // Close other question cards for focused experience
      questionCards.forEach((other) => {
        if (other !== card) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.question-card-header');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle clicked card
      if (isAlreadyActive) {
        card.classList.remove('active');
        headerBtn.setAttribute('aria-expanded', 'false');
      } else {
        card.classList.add('active');
        headerBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Accessible FAQ Accordion
   -------------------------------------------------------------------------- */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item, index) => {
    const button = item.querySelector('.faq-button');
    const content = item.querySelector('.faq-content');

    if (!button || !content) return;

    const questionId = `faq-q-${index}`;
    const answerId = `faq-a-${index}`;
    button.setAttribute('id', questionId);
    button.setAttribute('aria-controls', answerId);
    button.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');
    content.setAttribute('id', answerId);
    content.setAttribute('aria-labelledby', questionId);
    content.setAttribute('role', 'region');

    button.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-button');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isActive) {
        item.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. Booking Modal & Flow
   -------------------------------------------------------------------------- */
function initModal() {
  const modalOverlay = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const bookingForm = document.getElementById('bookingForm');
  const formView = document.getElementById('modalFormView');
  const confView = document.getElementById('modalConfView');
  const confCloseBtn = document.getElementById('confCloseBtn');
  const clarityTopicInput = document.getElementById('clarityTopic');

  if (!modalOverlay) return;

  const openTriggers = document.querySelectorAll('[data-open-modal]');
  openTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const topic = trigger.getAttribute('data-topic');
      openModal(topic);
    });
  });

  function openModal(topic = null) {
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (clarityTopicInput && topic) {
      clarityTopicInput.value = topic;
    }

    if (formView && confView) {
      formView.style.display = 'block';
      confView.style.display = 'none';
    }

    const firstInput = modalOverlay.querySelector('input');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (confCloseBtn) confCloseBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(bookingForm, formView, confView);
    });
  }
}

/* --------------------------------------------------------------------------
   5. Inline Booking Form
   -------------------------------------------------------------------------- */
function initInlineForm() {
  const form = document.getElementById('inlineBookingForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Securing Slot...';
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
      // Open confirmation in modal
      const modalOverlay = document.getElementById('bookingModal');
      const formView = document.getElementById('modalFormView');
      const confView = document.getElementById('modalConfView');
      if (modalOverlay && formView && confView) {
        formView.style.display = 'none';
        confView.style.display = 'block';
        modalOverlay.classList.add('open');
        modalOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (typeof confetti === 'function') {
          confetti({
            particleCount: 65,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#D83F78', '#F8DCE6', '#D7A86E', '#B9275F']
          });
        }
      }
    }, 700);
  });
}

function handleFormSubmit(form, formView, confView) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Securing Slot...';
  }

  setTimeout(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }

    if (formView && confView) {
      formView.style.display = 'none';
      confView.style.display = 'block';

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D83F78', '#F8DCE6', '#D7A86E', '#B9275F']
        });
      }
    }
  }, 700);
}

/* --------------------------------------------------------------------------
   6. Sticky Mobile Bar
   -------------------------------------------------------------------------- */
function initStickyMobileCTA() {
  const stickyBar = document.getElementById('stickyMobileCTA');
  const heroSection = document.getElementById('hero');
  if (!stickyBar || !heroSection) return;

  const handleScroll = () => {
    if (window.innerWidth >= 768) {
      stickyBar.classList.remove('visible');
      return;
    }
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    if (heroBottom < 0) {
      stickyBar.classList.add('visible');
    } else {
      stickyBar.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll);
  handleScroll();
}

/* --------------------------------------------------------------------------
   7. Video Trigger
   -------------------------------------------------------------------------- */
function initVideoTrigger() {
  const videoBlock = document.getElementById('videoTrigger');
  if (!videoBlock) return;

  videoBlock.addEventListener('click', () => {
    alert('“Hello! I’m Kirti. If you’re here, you’ve likely been turning the same relationship questions over in your mind. This session is a calm, private space where we use Tarot as a reflection mirror to help you see the dynamic clearly and step out of the confusion. I look forward to speaking with you.”');
  });
}

/* --------------------------------------------------------------------------
   8. GSAP ScrollTrigger Animations
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Timeline
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
  heroTl.from('.hero-eyebrow', { opacity: 0, y: 15, delay: 0.1 })
        .from('.hero-headline', { opacity: 0, y: 20, duration: 0.9 }, '-=0.5')
        .from('.hero-subheadline', { opacity: 0, y: 15 }, '-=0.6')
        .from('.insight-gap-box', { opacity: 0, x: -20, duration: 0.8 }, '-=0.5')
        .from('.hero-cta-wrapper', { opacity: 0, y: 18 }, '-=0.5')
        .from('.hero-trust-strip .hero-trust-item', { opacity: 0, y: 10, stagger: 0.1 }, '-=0.4')
        .from('.hero-visual-wrap', { opacity: 0, scale: 0.95, duration: 1 }, '-=0.9');

  // Scroll reveals
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.utils.toArray('.reveal-up').forEach((elem) => {
      gsap.from(elem, {
        scrollTrigger: {
          trigger: elem,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 26,
        duration: 0.7,
        ease: 'power2.out'
      });
    });

    gsap.utils.toArray('.reveal-stagger').forEach((container) => {
      const items = container.children;
      gsap.from(items, {
        scrollTrigger: {
          trigger: container,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 22,
        stagger: 0.09,
        duration: 0.65,
        ease: 'power2.out'
      });
    });
  }
}
