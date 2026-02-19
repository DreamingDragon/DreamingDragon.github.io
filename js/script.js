const slots = document.querySelectorAll('.input-grid .slot');

slots.forEach(slot => {
  slot.addEventListener('click', () => {
    // Toggle selection (visual highlight)
    slot.classList.toggle('selected');

    // Optional: do something when clicked
    console.log("Clicked slot value:", slot.dataset.value);
  });
});
