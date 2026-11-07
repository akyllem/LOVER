// Talasea — small vanilla helpers. No framework, no build step.
(function () {
  'use strict';

  // ───── mobile menu ─────
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-mobile-nav');
  if (toggle && nav) {
    const close = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    };
    const open = () => {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
    };
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      expanded ? close() : open();
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
    });
  }

  // ───── reveal-on-scroll ─────
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (!reduced && 'IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  // ───── form: prevent submission and acknowledge ─────
  const form = document.getElementById('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      if (!button) return;
      const original = button.textContent;
      button.textContent = 'Sent — we’ll write back.';
      button.disabled = true;
      setTimeout(() => {
        button.textContent = original;
        button.disabled = false;
        form.reset();
      }, 4000);
    });
  }

  // ───── memory slideshow ─────
  const slideshow = document.querySelector('.memory-slideshow');
  if (slideshow) {
    const slides = [...slideshow.querySelectorAll('.memory-slide')];
    const dots = [...slideshow.querySelectorAll('.memory-dot')];
    const previous = slideshow.querySelector('.memory-prev');
    const next = slideshow.querySelector('.memory-next');
    let current = 0;
    let timer;

    const showSlide = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === current);
        dot.setAttribute('aria-current', i === current ? 'true' : 'false');
      });
    };
    const restartTimer = () => {
      clearInterval(timer);
      if (!reduced) timer = setInterval(() => showSlide(current + 1), 5000);
    };

    previous.addEventListener('click', () => { showSlide(current - 1); restartTimer(); });
    next.addEventListener('click', () => { showSlide(current + 1); restartTimer(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); restartTimer(); }));
    restartTimer();
  }

  // ───── clickable memory collage ─────
  const memoryTiles = [...document.querySelectorAll('.memory-tile')];
  const surprisePhotos = [
    'P_1.jpg', 'P_2.jpg', 'P_3.jpg', 'P_4.jpg', 'P_5.jpg',
    'P_6.jpg', 'P_7.jpg', 'P_8.jpg', 'P_9.jpg', 'P_10.jpg',
    'P_11.jpg', 'P_12.jpg', 'P_13.jpg', 'P_14.jpg', 'P_15.jpg',
    'P_16.jpg', 'P_17.jpg', 'P_18.jpg', 'P_19.jpg', 'P_20.jpg',
    'P_21.jpg', 'P_22.jpg', 'P23.jpg', 'P_24.jpg', 'P_25.jpg'
  ].map((filename) => `assets/img/PHOTOS_2/${filename}`);
  for (let i = surprisePhotos.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [surprisePhotos[i], surprisePhotos[randomIndex]] = [surprisePhotos[randomIndex], surprisePhotos[i]];
  }
  memoryTiles.forEach((tile, index) => {
    const surpriseImage = tile.querySelector('.memory-tile-back img');
    if (surpriseImage) surpriseImage.src = surprisePhotos[index];
    tile.addEventListener('click', () => {
      if (tile.classList.contains('is-revealed')) return;
      memoryTiles.forEach((otherTile) => {
        otherTile.classList.remove('is-revealed');
        otherTile.setAttribute('aria-label', 'Reveal memory');
      });
      tile.classList.add('is-revealed');
      tile.setAttribute('aria-label', 'Revealed memory');
    });
  });

  const flowerButton = document.querySelector('.flower-trigger');
  const flowerGallery = document.querySelector('#flowerGallery');
  if (flowerButton && flowerGallery) {
    const revealFlowers = () => {
      const isOpen = flowerButton.getAttribute('aria-expanded') === 'true';
      flowerButton.setAttribute('aria-expanded', String(!isOpen));
      flowerGallery.hidden = isOpen;
      flowerGallery.classList.toggle('is-opening', !isOpen);
    };
    flowerButton.addEventListener('click', revealFlowers);
    flowerButton.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        revealFlowers();
      }
    });
  }

  const memoryUpload = document.querySelector('#memoryUpload');
  const uploadedCards = document.querySelector('#uploadedCards');
  const memoryFolder = document.querySelector('.memory-folder');
  const memoryModal = document.querySelector('#memoryModal');
  const memoryModalGallery = document.querySelector('#memoryModalGallery');
  const memorySong = document.querySelector('#memorySong');
  const memorySongPlay = document.querySelector('#memorySongPlay');
  const memorySongStatus = document.querySelector('#memorySongStatus');
  if (memoryFolder && memoryModal) {
    const collection = [
      'a.jpg', 'a1.jpg', 'a2.jpg', 'a3.jpg', 'a4.jpg', 'a5.jpg',
      'a6.jpg', 'a7.jpg', 'a8.jpg', 'a9.jpg', 'a10.jpg', 'a11.jpg',
      'a12.jpg', 'a13.jpg', 'a14.jpg', 'a15.jpg'
    ];
    if (memoryModalGallery) {
      collection.forEach((filename, index) => {
        const image = document.createElement('img');
        image.src = `assets/img/PHOTOS_2/${filename}`;
        image.alt = `Antipolo Gallery memory ${index + 1}`;
        memoryModalGallery.appendChild(image);
      });
    }
    const closeMemory = () => {
      memoryFolder.classList.remove('is-open');
      memoryFolder.setAttribute('aria-expanded', 'false');
      memoryModal.hidden = true;
      if (memorySong) {
        memorySong.pause();
        memorySong.currentTime = 0;
      }
    };
    const openMemory = () => {
      memoryFolder.classList.add('is-open');
      memoryFolder.setAttribute('aria-expanded', 'true');
      memoryModal.hidden = false;
      playMemorySong();
    };
    const playMemorySong = () => {
      if (memorySong) {
        memorySong.play().then(() => {
          if (memorySongStatus) memorySongStatus.textContent = 'Now playing our song.';
        }).catch(() => {
          if (memorySongStatus) memorySongStatus.textContent = 'Press play to start our song.';
        });
      }
    };
    memoryFolder.addEventListener('click', openMemory);
    memoryFolder.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openMemory();
      }
    });
    if (memorySongPlay) memorySongPlay.addEventListener('click', playMemorySong);
    memoryModal.querySelectorAll('[data-close-memory]').forEach((element) => {
      element.addEventListener('click', closeMemory);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !memoryModal.hidden) closeMemory();
    });
  }
  if (memoryUpload && uploadedCards) {
    const storageKey = 'lover-uploaded-memories';
    let savedMemories = JSON.parse(localStorage.getItem(storageKey) || '[]');

    const renderMemories = () => {
      uploadedCards.replaceChildren();
      savedMemories.forEach((memory, index) => {
        const card = document.createElement('div');
        const image = document.createElement('img');
        const deleteButton = document.createElement('button');
        card.className = 'uploaded-card';
        card.tabIndex = 0;
        card.style.setProperty('--card-rotation', `${(index % 5) - 2}deg`);
        image.src = memory;
        image.alt = `Uploaded memory ${index + 1}`;
        deleteButton.type = 'button';
        deleteButton.className = 'uploaded-card-delete';
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute('aria-label', `Delete uploaded memory ${index + 1}`);
        card.append(image, deleteButton);
        card.addEventListener('click', () => card.classList.toggle('is-selected'));
        deleteButton.addEventListener('click', (event) => {
          event.stopPropagation();
          savedMemories.splice(index, 1);
          localStorage.setItem(storageKey, JSON.stringify(savedMemories));
          renderMemories();
        });
        uploadedCards.appendChild(card);
      });
    };

    memoryUpload.addEventListener('change', () => {
      const files = Array.from(memoryUpload.files).filter((file) => file.type.startsWith('image/'));
      Promise.all(files.map((file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }))).then((images) => {
        savedMemories = savedMemories.concat(images);
        localStorage.setItem(storageKey, JSON.stringify(savedMemories));
        renderMemories();
        memoryUpload.value = '';
      });
    });

    renderMemories();
  }

  // ───── duplicate marquee track if singular ─────
  document.querySelectorAll('.marquee-track').forEach((track) => {
    if (track.children.length === 1) {
      track.appendChild(track.firstElementChild.cloneNode(true));
    }
  });
})();
