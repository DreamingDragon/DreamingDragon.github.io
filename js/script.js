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
  }, 450); // matches 0.2s + 0.2s animation
}

function calculateMachineOutput() {
  // 1️⃣ Select all 8 input slots
  const slots = Array.from(document.querySelectorAll('.slot'));

  if (slots.length < 8) {
    console.error("Not enough slots found!");
    return;
  }

  // 2️⃣ Helper function to convert 4 slots to base-10
  function slotsToNumber(slotArray) {
    return slotArray.reduce((sum, slot, index) => {
      const value = parseInt(slot.dataset.value || 0, 10);
      const power = 3 - index; // 12^3 for slot 0, 12^0 for slot 3
      return sum + value * Math.pow(12, power);
    }, 0);
  }

  // 3️⃣ First 4 slots → first number
  const firstNumber = slotsToNumber(slots.slice(0, 4));

  // 4️⃣ Next 4 slots → second number
  const secondNumber = slotsToNumber(slots.slice(4, 8));

  // 5️⃣ Sum them
  const total = firstNumber + secondNumber;

  // 6️⃣ Update output slot value
  const output = document.getElementById('result');
  output.dataset.value = total;
  console.log("Output total is: ", total);

  // 7️⃣ Update the output slots to match the value
  updateOutputImage(total);
}

function updateOutputImage(total) {
  // Convert total to base-12 string
  let base12 = total.toString(12);

  // Take last 4 digits (pad to ensure 4)
  base12 = base12.padStart(4, '0');
  const last4 = base12.slice(-4);

  const outputCells = document.querySelectorAll('#result .output-cell');

  outputCells.forEach((cell, index) => {
    const digit = parseInt(last4[index], 12);
    const img = cell.querySelector('img');
    if (!img) return;

    // Remove previous spin class in case of rapid updates
    img.classList.remove('spin');

    // Trigger reflow to restart animation
    void img.offsetWidth; 

    // Add spin animation
    img.classList.add('spin');

    // After half the animation, update the image
    setTimeout(() => {
      img.src = `art_assets/outputglyphs/OutputGlyph_${digit}.svg`;
      cell.dataset.value = digit;
    }, 200); // half of 0.4s animation

    // Remove spin class after animation completes
    setTimeout(() => {
      img.classList.remove('spin');
    }, 400);
  });
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
