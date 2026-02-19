// Select all slots
const slots = document.querySelectorAll('.input-grid .slot');

// Function to increment slot number (skeleton)
function incrementSlotNumber(slot) {
  console.log("Incrementing slot:", slot.id);

  // Example: swap dataset value to next number (placeholder logic)
  let currentValue = parseInt(slot.dataset.value || 0, 10);
  let nextValue = (currentValue + 1) % 12; // wrap around 0-11
  slot.dataset.value = nextValue;

  // Optional: animate the slot (rotate/flip)
  slot.style.transition = "transform 0.3s";
  slot.style.transform = "rotateY(180deg)";
  setTimeout(() => {
    slot.style.transform = "rotateY(0deg)";
  }, 300);
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
