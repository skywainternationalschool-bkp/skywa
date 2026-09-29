document.addEventListener("DOMContentLoaded", function() {
  // Header Load Karein
  const headerPlaceholder = document.getElementById('site-header');
  if (headerPlaceholder) {
    fetch('header.html')
      .then(response => response.text())
      .then(data => { headerPlaceholder.innerHTML = data; })
      .catch(error => console.error('Error loading header:', error));
  }

  // Footer Load Karein
  const footerPlaceholder = document.getElementById('site-footer');
  if (footerPlaceholder) {
    fetch('footer.html')
      .then(response => response.text())
      .then(data => { footerPlaceholder.innerHTML = data; 
  // Yahan current year automatic set ho jayega
      const yearSpan = document.getElementById('year');
      if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
      }
    })
      .catch(error => console.error('Error loading footer:', error));
  }
});

// Toggle navigation menu for mobile view
function toggleMenu() {
  const menu = document.getElementById('menu');
  if (menu) {
    menu.classList.toggle('active');
  }
}

// Automatically close the mobile menu when any link inside it is clicked
document.querySelectorAll('#menu a').forEach((a) => {
  a.addEventListener('click', (e) => {
    // If it's a dropdown toggle on mobile, let it toggle subitems instead of closing if desired, 
    // otherwise close the full menu drawer
    const menu = document.getElementById('menu');
    if (menu) {
      menu.classList.remove('active');
    }
  });
});

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
  galleryTimer = setInterval(() => showGallerySlide(galleryIndex + 1), 6000);
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

// Multi-Image Lightbox Logic for a Single Card
let currentLightboxIndex = 0;
let lightboxImages = [];

function openLightbox(el) {
  // Find all image elements inside the clicked card container
  lightboxImages = Array.from(el.querySelectorAll('img'));
  
  if (lightboxImages.length === 0) return;

  currentLightboxIndex = 0; // Start with the first image of this card
  updateLightboxImage();
  document.getElementById('lightbox').classList.add('open');
}

function updateLightboxImage() {
  if (lightboxImages.length > 0) {
    const lightboxImg = document.getElementById('lightboxImg');
    lightboxImg.src = lightboxImages[currentLightboxIndex].src;
    lightboxImg.alt = lightboxImages[currentLightboxIndex].alt || 'Gallery preview';
  }
}

function changeLightboxImage(direction, event) {
  if (event) event.stopPropagation(); // Prevent closing lightbox when clicking arrows
  if (lightboxImages.length === 0) return;

  currentLightboxIndex += direction;
  
  // Loop through images within this specific card
  if (currentLightboxIndex >= lightboxImages.length) {
    currentLightboxIndex = 0; 
  } else if (currentLightboxIndex < 0) {
    currentLightboxIndex = lightboxImages.length - 1; 
  }
  
  updateLightboxImage();
}

function closeLightbox(e) {
  if (e && e.target && (e.target.id === 'lightboxImg' || e.target.classList.contains('lightbox-nav'))) return;
  document.getElementById('lightbox').classList.remove('open');
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
