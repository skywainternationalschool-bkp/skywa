// Toggle navigation menu
function toggleMenu() {
  document.getElementById('menu').classList.toggle('open');
}

document.querySelectorAll('#menu a').forEach((a) =>
  a.addEventListener('click', () =>
    document.getElementById('menu').classList.remove('open')
  )
);

// Unique Visitor Counter
async function countUniqueVisitor() {
  const counter = document.getElementById('visitorCount');
  if (!counter) return;

  const alreadyCounted = localStorage.getItem('skywaVisitorCounted');

  try {
    let url;
    if (alreadyCounted) {
      url = "https://api.counterapi.dev/v1/skywa-international-school/visitors";
    } else {
      url = "https://api.counterapi.dev/v1/skywa-international-school/visitors/up";
      localStorage.setItem("skywaVisitorCounted", "true");
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error("Counter unavailable");

    const data = await response.json();
    counter.textContent = Number(data.count ?? data.value).toLocaleString("en-IN");
  } catch (error) {
    counter.textContent = "—";
    console.error("Visitor counter error:", error);
  }
}

// Gallery Slider Logic
let galleryIndex = 0;
let galleryTimer;
const galleryTrack = document.getElementById("galleryTrack");
const gallerySlides = document.querySelectorAll(".gallery-slide");
const galleryDots = document.getElementById("galleryDots");

if (gallerySlides.length > 0) {
  gallerySlides.forEach((slide, i) => {
    const dot = document.createElement("button");
    dot.className = "gallery-dot" + (i === 0 ? " active" : "");
    dot.type = "button";
    dot.setAttribute("aria-label", "Go to photo " + (i + 1));
    dot.onclick = () => showGallerySlide(i);
    galleryDots.appendChild(dot);
  });
}

function showGallerySlide(index) {
  if (index >= gallerySlides.length) index = 0;
  if (index < 0) index = gallerySlides.length - 1;
  galleryIndex = index;
  galleryTrack.style.transform = "translateX(-" + galleryIndex * 100 + "%)";
  document.querySelectorAll(".gallery-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === galleryIndex);
  });
}

function changeGallerySlide(direction) {
  showGallerySlide(galleryIndex + direction);
  restartGalleryAutoPlay();
}

function startGalleryAutoPlay() {
  galleryTimer = setInterval(() => showGallerySlide(galleryIndex + 1), 4000);
}

function restartGalleryAutoPlay() {
  clearInterval(galleryTimer);
  startGalleryAutoPlay();
}

// Touch swipe support for mobile
let galleryTouchStartX = 0;
let galleryTouchEndX = 0;
const gallerySlider = document.getElementById("gallerySlider");

if (gallerySlider) {
  gallerySlider.addEventListener("touchstart", (e) => {
    galleryTouchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  gallerySlider.addEventListener("touchend", (e) => {
    galleryTouchEndX = e.changedTouches[0].screenX;
    const distance = galleryTouchEndX - galleryTouchStartX;
    if (Math.abs(distance) > 50) {
      changeGallerySlide(distance < 0 ? 1 : -1);
    }
  }, { passive: true });

  gallerySlider.addEventListener("mouseenter", () => clearInterval(galleryTimer));
  gallerySlider.addEventListener("mouseleave", startGalleryAutoPlay);
}

// Lightbox Logic
function openLightbox(el) {
  document.getElementById('lightboxImg').src = el.querySelector('img').src;
  document.getElementById('lightbox').classList.add('open');
}

function closeLightbox(e) {
  if (e && e.target && e.target.id === 'lightboxImg') return;
  document.getElementById('lightbox').classList.remove('open');
}

function submitForm(e) {
  e.preventDefault();
  document.getElementById('formMsg').textContent =
    'Thank you! Your enquiry has been received. We will contact you soon.';
  e.target.reset();
}

// Live Visitor Local Date & Time Display
function updateVisitorDateTime() {
  const visitorElement = document.getElementById("visitorDateTime");
  if (!visitorElement) return;

  const now = new Date();
  const date = now.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  const time = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  visitorElement.innerHTML = "📅 " + date + " &nbsp; | &nbsp; 🕐 " + time;
}

// Initialization on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  countUniqueVisitor();
  startGalleryAutoPlay();
  
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  updateVisitorDateTime();
  setInterval(updateVisitorDateTime, 1000);
});

// Popup Notification Modal Functions
function openPopupModal() {
  const popup = document.getElementById("popupModal");
  if (popup) {
    popup.classList.add("show");
  }
}

function closePopupModalDirect() {
  const popup = document.getElementById("popupModal");
  if (popup) {
    popup.classList.remove("show");
  }
}

function closePopupModal(event) {
  // Close if clicking outside the image container
  if (event.target.id === "popupModal") {
    closePopupModalDirect();
  }
}

// Trigger popup automatically when page loads
window.addEventListener("load", () => {
  // Optional delay (e.g., 500ms) for smoother entrance
  setTimeout(openPopupModal, 500);
});
