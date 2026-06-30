/* =========================================================
   JEEVAN SHAKTI HERBS — script.js
   Loading screen, nav, theme toggle, custom cursor, hero
   leaves + typing effect, scroll reveal, counters, gallery
   lightbox, testimonial slider, FAQ accordion, contact form,
   floating buttons.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loading Screen ---------- */
  const loader = document.querySelector('.loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('hidden'), 350);
  });
  // Fallback in case 'load' already fired or assets are slow
  setTimeout(() => loader && loader.classList.add('hidden'), 2500);

  /* ---------- Sticky Navbar ---------- */
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    if (window.scrollY > 30) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    updateActiveNav();
    updateBackToTop();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile Hamburger ---------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* ---------- Active Nav Link on Scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  /* ---------- Theme Toggle (Dark Mode) ---------- */
  const themeToggle = document.querySelector('.theme-toggle');
  const root = document.documentElement;
  const savedTheme = (() => {
    try { return localStorage.getItem('jsh-theme'); } catch (e) { return null; }
  })();
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    if (next === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    try { localStorage.setItem('jsh-theme', next); } catch (e) { /* storage unavailable */ }
  });

  /* ---------- Custom Cursor (desktop pointer only) ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .gallery-item, input, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
  }

  /* ---------- Hero Floating Leaves (generated) ---------- */
  const leafField = document.querySelector('.hero-leaves');
  if (leafField) {
    const leafSVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17 1.5.5 2.5.5C18 20 22 7 22 3c-1.5 1.5-7 1-13 6 4-6.5 11-7 13-9-2.5-.5-7 1-7 1z"/></svg>`;
    const count = window.innerWidth < 600 ? 8 : 16;
    for (let i = 0; i < count; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'leaf';
      leaf.innerHTML = leafSVG;
      const size = 14 + Math.random() * 22;
      leaf.style.width = size + 'px';
      leaf.style.height = size + 'px';
      leaf.style.left = Math.random() * 100 + '%';
      leaf.style.top = 40 + Math.random() * 60 + '%';
      leaf.style.animationDuration = (8 + Math.random() * 10) + 's';
      leaf.style.animationDelay = (Math.random() * 8) + 's';
      leafField.appendChild(leaf);
    }
  }

  /* ---------- Hero Typing Effect ---------- */
  const typedEl = document.querySelector('.typed-wrap');
  if (typedEl) {
    const phrases = ['Naturally.', 'Ayurvedically.', 'Sustainably.'];
    let pIndex = 0, charIndex = 0, deleting = false;

    function typeLoop() {
      const current = phrases[pIndex];
      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1600);
          return;
        }
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          pIndex = (pIndex + 1) % phrases.length;
        }
      }
      setTimeout(typeLoop, deleting ? 45 : 90);
    }
    typeLoop();
  }

  /* ---------- Scroll Reveal (IntersectionObserver, AOS-style) ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated Counters ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-counter'));
      const suffix = el.getAttribute('data-suffix') || '';
      const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
      let startTime = null;
      const duration = 1600;

      function step(ts) {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = eased * target;
        el.textContent = (decimals > 0 ? value.toFixed(decimals) : Math.round(value)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- Gallery Lightbox ---------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxInner = document.querySelector('.lightbox-content');
  let galleryIndex = 0;

  function renderLightbox(index) {
    const item = galleryItems[index];
    const visualHTML = item.querySelector('.gallery-visual').innerHTML;
    const caption = item.getAttribute('data-caption') || '';
    lightboxInner.innerHTML = `<div class="lightbox-content-inner">${visualHTML}</div><span class="lightbox-caption">${caption}</span>`;
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      galleryIndex = idx;
      renderLightbox(galleryIndex);
      lightbox.classList.add('active');
    });
  });

  function closeLightbox() { lightbox.classList.remove('active'); }
  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  document.querySelector('.lightbox-next').addEventListener('click', () => {
    galleryIndex = (galleryIndex + 1) % galleryItems.length;
    renderLightbox(galleryIndex);
  });
  document.querySelector('.lightbox-prev').addEventListener('click', () => {
    galleryIndex = (galleryIndex - 1 + galleryItems.length) % galleryItems.length;
    renderLightbox(galleryIndex);
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') document.querySelector('.lightbox-next').click();
    if (e.key === 'ArrowLeft') document.querySelector('.lightbox-prev').click();
  });

  /* ---------- Testimonial Slider ---------- */
  const tCards = document.querySelectorAll('.t-card');
  const tDotsWrap = document.querySelector('.t-nav');
  let tIndex = 0, tInterval;

  if (tCards.length) {
    tCards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 't-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      dot.addEventListener('click', () => goToTestimonial(i));
      tDotsWrap.appendChild(dot);
    });
    const tDots = document.querySelectorAll('.t-dot');

    function goToTestimonial(i) {
      tCards[tIndex].classList.remove('active');
      tDots[tIndex].classList.remove('active');
      tIndex = i;
      tCards[tIndex].classList.add('active');
      tDots[tIndex].classList.add('active');
    }

    function nextTestimonial() { goToTestimonial((tIndex + 1) % tCards.length); }

    function startAutoplay() { tInterval = setInterval(nextTestimonial, 5500); }
    function stopAutoplay() { clearInterval(tInterval); }

    tCards[0].classList.add('active');
    startAutoplay();

    const slider = document.querySelector('.t-slider');
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
  }

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-answer').style.maxHeight = null;
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = null;
        question.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Contact Form Validation ---------- */
  const form = document.querySelector('#contact-form');
  if (form) {
    const successMsg = form.querySelector('.form-success');

    function setError(group, message) {
      group.classList.add('invalid');
      group.querySelector('.error-msg').textContent = message;
    }
    function clearError(group) {
      group.classList.remove('invalid');
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      successMsg.classList.remove('show');

      const nameGroup = form.querySelector('#field-name').closest('.form-group');
      const phoneGroup = form.querySelector('#field-phone').closest('.form-group');
      const emailGroup = form.querySelector('#field-email').closest('.form-group');
      const messageGroup = form.querySelector('#field-message').closest('.form-group');

      const nameVal = form.querySelector('#field-name').value.trim();
      const phoneVal = form.querySelector('#field-phone').value.trim();
      const emailVal = form.querySelector('#field-email').value.trim();
      const messageVal = form.querySelector('#field-message').value.trim();

      [nameGroup, phoneGroup, emailGroup, messageGroup].forEach(clearError);

      if (nameVal.length < 2) { setError(nameGroup, 'Please enter your full name.'); valid = false; }

      const phonePattern = /^[6-9]\d{9}$/;
      if (!phonePattern.test(phoneVal.replace(/\D/g, '').slice(-10))) {
        setError(phoneGroup, 'Please enter a valid 10-digit phone number.'); valid = false;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailVal)) {
        setError(emailGroup, 'Please enter a valid email address.'); valid = false;
      }

      if (messageVal.length < 10) {
        setError(messageGroup, 'Please tell us a little more (min. 10 characters).'); valid = false;
      }

      if (valid) {
        // Build a formatted WhatsApp message from the form fields
        const whatsappNumber = '919368443747'; // country code + number, no + or spaces
        const messageLines = [
          'Hello Jeevan Shakti Herbs! I have an inquiry from your website:',
          '',
          `*Name:* ${nameVal}`,
          `*Phone:* ${phoneVal}`,
          `*Email:* ${emailVal}`,
          `*Message:* ${messageVal}`
        ];
        const encodedMessage = encodeURIComponent(messageLines.join('\n'));
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // Point the fallback link at the same URL in case the popup is blocked
        const fallbackLink = successMsg.querySelector('.whatsapp-fallback-link');
        if (fallbackLink) fallbackLink.href = whatsappURL;

        successMsg.classList.add('show');
        window.open(whatsappURL, '_blank', 'noopener');

        setTimeout(() => {
          successMsg.classList.remove('show');
          form.reset();
        }, 8000);
      }
    });
  }

  /* ---------- Order Now: Pricing + UPI QR + WhatsApp Order Submission ---------- */
  const orderForm = document.querySelector('#order-form');
  if (orderForm) {
    const DELIVERY_CHARGE = 0; // set a number like 49 if you want to charge delivery below a threshold
    const FREE_DELIVERY_ABOVE = 0; // e.g. 999 — leave both at 0 for "always free" delivery
    const UPI_ID = 'jeevanshaktiherbs@upi'; // ⚠️ replace with the real UPI ID before going live
    const UPI_PAYEE_NAME = 'Jeevan Shakti Herbs';

    const packInputs = document.querySelectorAll('input[name="pack"]');
    const paymentInputs = document.querySelectorAll('input[name="payment"]');
    const subtotalEl = document.getElementById('summary-subtotal');
    const deliveryEl = document.getElementById('summary-delivery');
    const totalEl = document.getElementById('summary-total');
    const submitTotalEl = document.getElementById('submit-total');
    const qrPanel = document.getElementById('upi-qr-panel');
    const qrImage = document.getElementById('upi-qr-image');
    const qrError = document.getElementById('upi-qr-error');
    const qrAmountEl = document.getElementById('upi-qr-amount');
    const upiIdTextEl = document.getElementById('upi-id-text');
    const copyBtn = document.getElementById('upi-copy-btn');

    function formatINR(amount) {
      return '₹' + amount.toLocaleString('en-IN');
    }

    function getSelectedPack() {
      const checked = document.querySelector('input[name="pack"]:checked');
      return {
        price: checked ? parseInt(checked.getAttribute('data-price'), 10) : 0,
        label: checked ? checked.getAttribute('data-label') : ''
      };
    }

    function getCurrentTotal() {
      const { price } = getSelectedPack();
      const delivery = (FREE_DELIVERY_ABOVE > 0 && price >= FREE_DELIVERY_ABOVE) ? 0 : DELIVERY_CHARGE;
      return price + delivery;
    }

    function buildUpiURI(amount) {
      const params = new URLSearchParams({
        pa: UPI_ID,
        pn: UPI_PAYEE_NAME,
        am: String(amount),
        cu: 'INR',
        tn: 'Magic Fat Cutter Order'
      });
      return `upi://pay?${params.toString()}`;
    }

    function updateQrCode() {
      const total = getCurrentTotal();
      const upiURI = buildUpiURI(total);
      // Free, no-signup QR image generator — encodes the UPI URI as a scannable QR
      qrImage.hidden = false;
      qrError.hidden = true;
      qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiURI)}`;
      qrAmountEl.textContent = formatINR(total);
    }

    qrImage.addEventListener('error', () => {
      qrImage.hidden = true;
      qrError.hidden = false;
    });
    qrImage.addEventListener('load', () => {
      if (qrImage.naturalWidth > 0) {
        qrImage.hidden = false;
        qrError.hidden = true;
      }
    });

    function updateOrderSummary() {
      const { price } = getSelectedPack();
      const delivery = (FREE_DELIVERY_ABOVE > 0 && price >= FREE_DELIVERY_ABOVE) ? 0 : DELIVERY_CHARGE;
      const total = price + delivery;

      subtotalEl.textContent = formatINR(price);
      deliveryEl.textContent = delivery === 0 ? 'FREE' : formatINR(delivery);
      totalEl.textContent = formatINR(total);
      submitTotalEl.textContent = formatINR(total);

      if (qrPanel && !qrPanel.hidden) updateQrCode();
    }

    function toggleQrPanel() {
      const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
      if (selectedPayment === 'Online') {
        qrPanel.hidden = false;
        updateQrCode();
      } else {
        qrPanel.hidden = true;
      }
    }

    packInputs.forEach(input => input.addEventListener('change', updateOrderSummary));
    paymentInputs.forEach(input => input.addEventListener('change', toggleQrPanel));
    upiIdTextEl.textContent = UPI_ID;
    updateOrderSummary(); // run once on load to reflect the pre-checked pack
    toggleQrPanel(); // run once on load to reflect the pre-checked payment method

    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(UPI_ID);
          copyBtn.classList.add('copied');
          setTimeout(() => copyBtn.classList.remove('copied'), 1800);
        } catch (err) {
          // Clipboard API unavailable (e.g. insecure context) — silently ignore
        }
      });
    }

    function setOrderError(group, message) {
      group.classList.add('invalid');
      group.querySelector('.error-msg').textContent = message;
    }
    function clearOrderError(group) {
      group.classList.remove('invalid');
    }

    const orderSuccessMsg = orderForm.querySelector('.order-form-success');

    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      orderSuccessMsg.classList.remove('show');

      const nameGroup = orderForm.querySelector('#order-name').closest('.form-group');
      const phoneGroup = orderForm.querySelector('#order-phone').closest('.form-group');
      const addressGroup = orderForm.querySelector('#order-address').closest('.form-group');

      const nameVal = orderForm.querySelector('#order-name').value.trim();
      const phoneVal = orderForm.querySelector('#order-phone').value.trim();
      const addressVal = orderForm.querySelector('#order-address').value.trim();
      const paymentVal = orderForm.querySelector('input[name="payment"]:checked').value;

      [nameGroup, phoneGroup, addressGroup].forEach(clearOrderError);

      if (nameVal.length < 2) { setOrderError(nameGroup, 'Please enter your full name.'); valid = false; }

      const phonePattern = /^[6-9]\d{9}$/;
      if (!phonePattern.test(phoneVal.replace(/\D/g, '').slice(-10))) {
        setOrderError(phoneGroup, 'Please enter a valid 10-digit phone number.'); valid = false;
      }

      if (addressVal.length < 10) {
        setOrderError(addressGroup, 'Please enter your complete delivery address.'); valid = false;
      }

      if (valid) {
        const { price, label } = getSelectedPack();
        const delivery = (FREE_DELIVERY_ABOVE > 0 && price >= FREE_DELIVERY_ABOVE) ? 0 : DELIVERY_CHARGE;
        const total = price + delivery;
        const isOnline = paymentVal === 'Online';

        const whatsappNumber = '919368443747'; // country code + number, no + or spaces
        const messageLines = [
          'Hello Jeevan Shakti Herbs! I would like to place an order:',
          '',
          `*Product:* Magic Fat Cutter`,
          `*Pack:* ${label}`,
          `*Price:* ${formatINR(price)}`,
          `*Delivery:* ${delivery === 0 ? 'FREE' : formatINR(delivery)}`,
          `*Total Amount:* ${formatINR(total)}`,
          `*Payment Method:* ${isOnline ? `Pay Online (UPI QR scanned — ${UPI_ID})` : 'Cash on Delivery'}`,
          '',
          `*Name:* ${nameVal}`,
          `*Phone:* ${phoneVal}`,
          `*Delivery Address:* ${addressVal}`
        ];
        if (isOnline) {
          messageLines.push('', "I've scanned the QR and will share my payment screenshot here.");
        }
        const encodedMessage = encodeURIComponent(messageLines.join('\n'));
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        const fallbackLink = orderSuccessMsg.querySelector('.order-fallback-link');
        if (fallbackLink) fallbackLink.href = whatsappURL;

        orderSuccessMsg.classList.add('show');
        window.open(whatsappURL, '_blank', 'noopener');

        setTimeout(() => {
          orderSuccessMsg.classList.remove('show');
          orderForm.reset();
          updateOrderSummary();
          toggleQrPanel();
        }, 9000);
      }
    });
  }

  /* ---------- Floating Back-to-Top Button ---------- */
  const backToTop = document.querySelector('.fab-top');
  function updateBackToTop() {
    if (window.scrollY > 500) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  }
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* Initialize state on load */
  onScroll();
});