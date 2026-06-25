const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const tripButtons = document.querySelectorAll("[data-trip-type]");
const returnDate = document.querySelector("#return-date");

tripButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tripButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-selected", "true");

    if (returnDate) {
      const isRoundTrip = button.dataset.tripType === "roundtrip";
      returnDate.disabled = !isRoundTrip;
      if (!isRoundTrip) returnDate.value = "";
    }
  });
});

const swapRouteButton = document.querySelector("[data-swap-route]");
const origin = document.querySelector("#origin");
const destination = document.querySelector("#destination");

if (swapRouteButton && origin && destination) {
  swapRouteButton.addEventListener("click", () => {
    const originValue = origin.value;
    origin.value = destination.value;
    destination.value = originValue;
  });
}

const openModalButtons = document.querySelectorAll("[data-open-modal]");
const closeModalButtons = document.querySelectorAll("[data-close-modal]");
let activeModal = null;

function closeModal() {
  if (!activeModal) return;
  activeModal.classList.remove("is-open");
  activeModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
  activeModal = null;
}

openModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeModal = document.getElementById(button.dataset.openModal);
    if (!activeModal) return;
    activeModal.classList.add("is-open");
    activeModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    activeModal.querySelector("[data-close-modal]")?.focus();
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) closeModal();
  });
});
