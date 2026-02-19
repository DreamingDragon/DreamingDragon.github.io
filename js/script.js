// Select all slots
const slots = document.querySelectorAll('.input-grid .slot');

// Function to increment slot number (skeleton)
function incrementSlotNumber(slot) {
  console.log("Incrementing slot:", slot.id);

  // 1️⃣ Get current value and compute next
  let currentValue = parseInt(slot.dataset.value || 0, 10);
  let nextValue = (currentValue + 1) % 12;
  slot.dataset.value = nextValue;

  // 2️⃣ Select the <img> inside the slot
  const img = slot.querySelector('img');
  if (!img) return;

  // 3️⃣ Animate flip
  slot.style.transition = "transform 0.3s";
  slot.style.transform = "rotateY(90deg)"; // halfway flip

  // 4️⃣ After 150ms (halfway), swap image
  setTimeout(() => {
    img.src = `art_assets/glyphs/Glyph_${nextValue}.svg`;
    slot.style.transform = "rotateY(0deg)"; // complete flip
  }, 150);
}

// Attach events to each slot
slots.forEach(slot => {
  // Highlight on press
  slot.addEventListener('mousedown', () => {
    slot.classList.add('selected');
    incrementSlotNumber(slot);
  });

  slot.addEventListener('touchstart', () => {
    slot.classList.add('selected');
    incrementSlotNumber(slot);
  }, {passive: true});

  // Remove highlight on release
  slot.addEventListener('mouseup', () => {
    slot.classList.remove('selected');
  });

  slot.addEventListener('mouseleave', () => {
    slot.classList.remove('selected'); // in case cursor leaves while holding
  });

  slot.addEventListener('touchend', () => {
    slot.classList.remove('selected');
  });
});
