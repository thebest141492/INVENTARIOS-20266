let currentIndex = 0;
const cards = document.querySelectorAll('.card');
const carousel = document.querySelector('.carousel');

let isDragging = false;
let startX = 0;

// ===== ACTUALIZA POSICIONES =====
function updateCarousel() {
  cards.forEach((card, index) => {
    card.classList.remove('active', 'left', 'right', 'far');

    const diff = index - currentIndex;

    if (diff === 0) {
      card.classList.add('active');
    } else if (diff === -1 || diff === cards.length - 1) {
      card.classList.add('left');
    } else if (diff === 1 || diff === -(cards.length - 1)) {
      card.classList.add('right');
    } else {
      card.classList.add('far');
    }
  });
}

// ===== BOTONES =====
function nextCard() {
  currentIndex = (currentIndex + 1) % cards.length;
  updateCarousel();
}

function prevCard() {
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  updateCarousel();
}

// ===== RUEDA DEL MOUSE =====
carousel.addEventListener('wheel', e => {
  e.preventDefault();
  if (e.deltaY > 0) {
    nextCard();
  } else {
    prevCard();
  }
}, { passive: false });

// ===== DRAG CON MOUSE =====
carousel.addEventListener('mousedown', e => {
  isDragging = true;
  startX = e.clientX;
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

window.addEventListener('mousemove', e => {
  if (!isDragging) return;

  const diff = e.clientX - startX;
  if (diff > 60) {
    prevCard();
    isDragging = false;
  } else if (diff < -60) {
    nextCard();
    isDragging = false;
  }
});

// ===== CLICK REDIRIGE =====
cards.forEach(card => {
  card.addEventListener('click', () => {
    const link = card.getAttribute('data-link');
    if (link) window.location.href = link;
  });
});

// ===== AUTOPLAY (PAUSA AL HOVERrr) =====
let autoPlay = setInterval(nextCard, 6000);

carousel.addEventListener('mouseenter', () => {
  clearInterval(autoPlay);
});

carousel.addEventListener('mouseleave', () => {
  autoPlay = setInterval(nextCard, 6000);
});

// INIT
updateCarousel();



