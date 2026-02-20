// Select all slots
const slots = document.querySelectorAll('.input-grid .slot');

// Function to increment slot number (skeleton)
function incrementSlotNumber(slot) {
  console.log("Incrementing slot:", slot.id);

  // 🚫 disable clicks during animation
  slot.style.pointerEvents = "none";

  // 1️⃣ Get current value and compute next
  let currentValue = parseInt(slot.dataset.value || 0, 10);
  let nextValue = (currentValue + 1) % 12;
  slot.dataset.value = nextValue;

  // 2️⃣ Select the <img> inside the slot
  const img = slot.querySelector('img');
  if (!img) return;

  // 3️⃣ Start first half of flip (rotate 90deg)
  slot.style.transform = "rotateY(90deg)";
  slot.style.transition = "transform 0.2s ease-in";// halfway flip

  // 4️⃣ Swap image halfway through
  setTimeout(() => {
    img.src = `art_assets/glyphs/Glyph_${nextValue}.svg`;

  // 5️⃣ Complete flip back to 0deg
    slot.style.transition = "transform 0.2s ease-out";
    slot.style.transform = "rotateY(0deg)";
  }, 200);

  // ✅ Re-enable clicks after full flip duration
  setTimeout(() => {
    slot.style.pointerEvents = "auto";
  }, 400); // matches 0.2s + 0.2s animation
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
