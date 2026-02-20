// Select all slots
const slots = document.querySelectorAll('.input-grid .slot');
///////////////////////////////////////////////////////////////////////////////////////
function animateSlotsToValue(targetValue = 0, slotSelector = '.slot') {
  const slots = document.querySelectorAll(slotSelector);
  if (slots.length === 0) return;

  // Total duration includes last slot's delay + animation duration
  const animationDuration = 350; // ms, matches your .dialing animation
  const delayBetweenSlots = 100; // ms

  slots.forEach((slot, index) => {
    const img = slot.querySelector('img');
    if (!img) return;

    slot.style.pointerEvents = 'none';

    const delay = index * delayBetweenSlots;
    setTimeout(() => {
      // Start the magic animation
      slot.classList.add('dialing');

      // Swap glyph at midpoint
      setTimeout(() => {
        slot.dataset.value = targetValue;
        img.src = `art_assets/glyphs/Glyph_${targetValue}.svg`;
      }, animationDuration / 2);

      // Cleanup when animation ends
      slot.addEventListener('animationend', () => {
        slot.classList.remove('dialing');
        slot.style.pointerEvents = 'auto';
      }, { once: true });
    }, delay);
  });

  // Call calculateMachineOutput after the last slot finishes
  const totalTime = (slots.length - 1) * delayBetweenSlots + animationDuration;
  setTimeout(() => {
    if (typeof calculateMachineOutput === 'function') {
      calculateMachineOutput();
    }
  }, totalTime);
}
///////////////////////////////////////////////////////////////////////////////////////
// Function to increment slot number
function incrementSlotNumber(slot) {
  console.log("Incrementing slot:", slot.id);
  slot.style.pointerEvents = "none";

  let currentValue = parseInt(slot.dataset.value || 0, 10);
  let nextValue = (currentValue + 1) % 12;
  slot.dataset.value = nextValue;

  const img = slot.querySelector("img");
  if (!img) return;

  // start magic animation
  slot.classList.add("dialing");

  // swap image at roughly midpoint
  setTimeout(() => {
    img.src = `art_assets/glyphs/Glyph_${nextValue}.svg`;
  }, 175); // half of 0.35s

  slot.addEventListener("animationend", () => {
    slot.classList.remove("dialing");
    slot.style.pointerEvents = "auto";
  }, { once: true });
  console.log("Value set to:", slot.dataset.value);
}


// function incrementSlotNumber(slot) {
//   console.log("Incrementing slot:", slot.id);

//   // 🚫 disable clicks during animation
//   slot.style.pointerEvents = "none";

//   // 1️⃣ Get current value and compute next
//   let currentValue = parseInt(slot.dataset.value || 0, 10);
//   let nextValue = (currentValue + 1) % 12;
//   slot.dataset.value = nextValue;

//   // 2️⃣ Select the <img> inside the slot
//   const img = slot.querySelector('img');
//   if (!img) return;

//   // 3️⃣ Start first half of flip (rotate 90deg)
//   slot.style.transform = "rotateY(90deg)";
//   slot.style.transition = "transform 0.2s ease-in";// halfway flip

//   // 4️⃣ Swap image halfway through
//   setTimeout(() => {
//     img.src = `art_assets/glyphs/Glyph_${nextValue}.svg`;

//   // 5️⃣ Complete flip back to 0deg
//     slot.style.transition = "transform 0.2s ease-out";
//     slot.style.transform = "rotateY(0deg)";
//   }, 200);

//   // ✅ Re-enable clicks after full flip duration
//   setTimeout(() => {
//     slot.style.pointerEvents = "auto";
//   }, 450); // matches 0.2s + 0.2s animation
// }
//////////////////////////////////////////////////////////////////////////////////////////////
function calculateMachineOutput() {
  // 1️⃣ Select all 8 input slots
  const slots = Array.from(document.querySelectorAll('.slot'));

  if (slots.length < 8) {
    console.error("Not enough slots found!");
    return;
  }
///////////////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////////////////
function updateOutputImage(total) {
  // Convert total to base-12 string
  let base12 = total.toString(12).padStart(4, '0');
  const last4 = base12.slice(-4);

  const outputCells = document.querySelectorAll('#result .output-cell');

  outputCells.forEach((cell, index) => {
    const digit = parseInt(last4[index], 12);
    const img = cell.querySelector('img');
    if (!img) return;

    // Restart spin animation on the CELL
    spinOutputCell(cell)

    // Swap glyph halfway through the spin (180°)
    setTimeout(() => {
      img.src = `art_assets/glyphs/OutputGlyph_${digit}.svg`;
      cell.dataset.value = digit;
    }, 200); // half of 0.4s spin
  });

  // Store total in parent div
  document.getElementById('result').dataset.value = total;
}
////////////////////////////////////////////////////////////////////////////////////////////
// Helper: spins an image while preserving any CSS flip
function spinOutputCell(cell) {
  cell.classList.remove('spin');
  void cell.offsetWidth;
  cell.classList.add('spin');
}
/////////////////////////////////////////////////////////////////////////////////////////

// Do a cute start animation
window.addEventListener('DOMContentLoaded', () => {
  animateSlotsToValue(0); // all slots reset to zero with magic animation
});

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


