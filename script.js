/* ════════════════════════════════════════
   Lumina Gallery — script.js
   ════════════════════════════════════════ */

/* ── IMAGE DATA ── */
const images = [
  {
    title:  "Verdant Canopy",
    cat:    "nature",
    credit: "Nature · Forest",
    url:    "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&q=80"
  },
  {
    title:  "Steel & Sky",
    cat:    "architecture",
    credit: "Architecture · Urban",
    url:    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80"
  },
  {
    title:  "Quiet Bloom",
    cat:    "nature",
    credit: "Nature · Macro",
    url:    "https://images.unsplash.com/photo-1490750967868-88df5691cc61?w=800&q=80"
  },
  {
    title:  "Glass Meridian",
    cat:    "architecture",
    credit: "Architecture · Glass",
    url:    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80"
  },
  {
    title:  "Coastal Light",
    cat:    "nature",
    credit: "Nature · Ocean",
    url:    "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80"
  },
  {
    title:  "Concrete Verse",
    cat:    "abstract",
    credit: "Abstract · Texture",
    url:    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
  },
  {
    title:  "Morning Reflection",
    cat:    "portrait",
    credit: "Portrait · Soft Light",
    url:    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80"
  },
  {
    title:  "Desert Geometry",
    cat:    "abstract",
    credit: "Abstract · Dunes",
    url:    "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80"
  },
  {
    title:  "Timber Hall",
    cat:    "architecture",
    credit: "Architecture · Interior",
    url:    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
  },
  {
    title:  "Ember Hour",
    cat:    "nature",
    credit: "Nature · Sunset",
    url:    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
  },
  {
    title:  "Fractured Light",
    cat:    "abstract",
    credit: "Abstract · Prism",
    url:    "https://images.unsplash.com/photo-1518655048521-f130df041f66?w=800&q=80"
  },
  {
    title:  "Golden Hour",
    cat:    "portrait",
    credit: "Portrait · Outdoor",
    url:    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80"
  },
  {
    title:  "Arched Passage",
    cat:    "architecture",
    credit: "Architecture · Arches",
    url:    "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80"
  },
  {
    title:  "Mountain Reverie",
    cat:    "nature",
    credit: "Nature · Alpine",
    url:    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"
  },
  {
    title:  "Graphite Study",
    cat:    "abstract",
    credit: "Abstract · Minimal",
    url:    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80"
  },
];


/* ── STATE ── */
let currentCat    = "all";
let currentIndex  = 0;
let currentFilter = "none";
let visibleImages = [...images];


/* ── DOM REFERENCES ── */
const gallery    = document.getElementById("gallery");
const lightbox   = document.getElementById("lightbox");
const lbImg      = document.getElementById("lbImg");
const lbTitle    = document.getElementById("lbTitle");
const lbMeta     = document.getElementById("lbMeta");
const lbCounter  = document.getElementById("lbCounter");
const lbClose    = document.getElementById("lbClose");
const lbPrev     = document.getElementById("lbPrev");
const lbNext     = document.getElementById("lbNext");
const countLabel = document.getElementById("countLabel");


/* ════════════════════════════════════════
   GALLERY — BUILD & FILTER
   ════════════════════════════════════════ */

/**
 * Rebuilds the gallery grid based on the active category.
 */
function buildGallery() {
  gallery.innerHTML = "";

  visibleImages = currentCat === "all"
    ? images
    : images.filter(img => img.cat === currentCat);

  countLabel.textContent = `${visibleImages.length} works`;

  if (visibleImages.length === 0) {
    gallery.innerHTML = `<div class="empty-state">No images in this category.</div>`;
    return;
  }

  visibleImages.forEach((img, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Open ${img.title}`);

    card.innerHTML = `
      <img
        src="${img.url}"
        alt="${img.title}"
        loading="${i < 4 ? 'eager' : 'lazy'}"
      >
      <div class="card-overlay">
        <div class="card-info">
          <div class="card-title">${img.title}</div>
          <div class="card-cat">${img.credit}</div>
        </div>
      </div>
    `;

    // Open lightbox on click or keyboard
    card.addEventListener("click", () => openLightbox(i));
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(i);
      }
    });

    gallery.appendChild(card);
  });
}

// Wire up category filter buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCat = btn.dataset.cat;
    buildGallery();
  });
});


/* ════════════════════════════════════════
   LIGHTBOX — OPEN / CLOSE / NAVIGATE
   ════════════════════════════════════════ */

/**
 * Opens the lightbox at the given index.
 * @param {number} index - Index within visibleImages
 */
function openLightbox(index) {
  currentIndex = index;
  updateLightboxContent();
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
  lbClose.focus();
}

/** Closes the lightbox and restores scroll. */
function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

/** Refreshes lightbox image, title, meta, and counter. */
function updateLightboxContent() {
  const img = visibleImages[currentIndex];
  lbImg.src = img.url;
  lbImg.alt = img.title;
  lbTitle.textContent = img.title;
  lbMeta.textContent  = img.credit;
  lbCounter.textContent = `${currentIndex + 1} / ${visibleImages.length}`;
  applyImageFilter(currentFilter);
}

/**
 * Navigates the lightbox by a given direction with a slide animation.
 * @param {number} dir - +1 for next, -1 for previous
 */
function navigate(dir) {
  currentIndex = (currentIndex + dir + visibleImages.length) % visibleImages.length;

  // Animate out
  lbImg.style.opacity   = "0";
  lbImg.style.transform = `translateX(${dir > 0 ? 20 : -20}px)`;

  setTimeout(() => {
    updateLightboxContent();

    // Animate in
    lbImg.style.transition = "opacity 0.25s, transform 0.25s";
    lbImg.style.opacity    = "1";
    lbImg.style.transform  = "translateX(0)";

    // Clean up inline transition
    setTimeout(() => { lbImg.style.transition = ""; }, 300);
  }, 120);
}

// Nav buttons
lbClose.addEventListener("click", closeLightbox);
lbPrev.addEventListener("click",  () => navigate(-1));
lbNext.addEventListener("click",  () => navigate(1));

// Click outside image to close
lightbox.addEventListener("click", e => {
  if (e.target === lightbox) closeLightbox();
});


/* ════════════════════════════════════════
   IMAGE FILTERS (inside lightbox)
   ════════════════════════════════════════ */

/**
 * Applies a CSS filter string to the lightbox image.
 * @param {string} filterValue - CSS filter value, or "none"
 */
function applyImageFilter(filterValue) {
  currentFilter = filterValue;
  lbImg.style.filter = filterValue === "none" ? "" : filterValue;
}

// Wire up filter buttons
document.querySelectorAll(".lb-filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".lb-filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    applyImageFilter(btn.dataset.filter);
  });
});


/* ════════════════════════════════════════
   KEYBOARD NAVIGATION
   ════════════════════════════════════════ */
document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("open")) return;

  switch (e.key) {
    case "Escape":     closeLightbox();  break;
    case "ArrowLeft":  navigate(-1);     break;
    case "ArrowRight": navigate(1);      break;
  }
});


/* ════════════════════════════════════════
   TOUCH / SWIPE SUPPORT
   ════════════════════════════════════════ */
let touchStartX = null;

lightbox.addEventListener("touchstart", e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

lightbox.addEventListener("touchend", e => {
  if (touchStartX === null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 48) navigate(dx < 0 ? 1 : -1);
  touchStartX = null;
});


/* ════════════════════════════════════════
   INIT
   ════════════════════════════════════════ */
buildGallery();
