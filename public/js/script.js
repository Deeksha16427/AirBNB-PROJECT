(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

  
document.addEventListener("DOMContentLoaded", () => {
  const filters = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll(".listing-card");

  filters.forEach(filter => {
    filter.addEventListener("click", () => {
      const selectedCategory = filter.dataset.category;

      cards.forEach(card => {
        const cardCategory = card.dataset.category;

        console.log("filter:", selectedCategory, "card:", cardCategory);

        if (cardCategory === selectedCategory) {
          card.parentElement.style.display = "block";
        } else {
          card.parentElement.style.display = "none";
        }
      });
    });
  });
});