// =========================================
// GESTION DU CARROUSEL
// =========================================
let slideIndex = 0;
let slideInterval;

function showSlides(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    if (!slides.length) return;
    if (n >= slides.length) slideIndex = 0;
    if (n < 0) slideIndex = slides.length - 1;
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    if (slides[slideIndex]) slides[slideIndex].classList.add('active');
    if (dots[slideIndex]) dots[slideIndex].classList.add('active');
}
function nextSlide() { slideIndex++; showSlides(slideIndex); }
function startSlideShow() { slideInterval = setInterval(nextSlide, 5000); }
function stopSlideShow() { clearInterval(slideInterval); }
function currentSlide(n) { stopSlideShow(); slideIndex = n; showSlides(slideIndex); startSlideShow(); }

// =========================================
// GESTION DE LA LIGHTBOX (GALERIE) - VERSION ROBUSTE
// =========================================
function openLightbox(element) {
    // On récupère l'image qui est à l'intérieur de la carte cliquée
    const img = element.querySelector('img');
    if (!img) return; // Si pas d'image, on ne fait rien

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    if (lightbox && lightboxImg) {
        // On utilise la source exacte de l'image cliquée (peu importe son nom ou extension)
        lightboxImg.src = img.src; 
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Empêche le scroll en arrière-plan
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Fermer la lightbox en cliquant en dehors de l'image
document.addEventListener('click', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (e.target === lightbox) { closeLightbox(); }
});

// =========================================
// INITIALISATION
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    // Carrousel
    if (document.querySelector('.carousel-slide')) {
        showSlides(slideIndex);
        startSlideShow();
    }

    // Menu Mobile
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavClose = document.getElementById('mobile-nav-close');
    if (mobileMenuBtn && mobileNavOverlay && mobileNavClose) {
        mobileMenuBtn.addEventListener('click', () => mobileNavOverlay.classList.add('active'));
        mobileNavClose.addEventListener('click', () => mobileNavOverlay.classList.remove('active'));
        mobileNavOverlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileNavOverlay.classList.remove('active'));
        });
    }

    // Formulaire de Contact
    const form = document.getElementById('contact-form');
    const responseDiv = document.getElementById('form-response');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                nom: document.getElementById('nom').value,
                email: document.getElementById('email').value,
                telephone: document.getElementById('telephone').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value
            };
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();
                if (response.ok) {
                    responseDiv.style.color = 'green';
                    responseDiv.textContent = result.message;
                    form.reset();
                } else {
                    responseDiv.style.color = 'red';
                    responseDiv.textContent = result.error || 'Une erreur est survenue.';
                }
            } catch (error) {
                responseDiv.style.color = 'red';
                responseDiv.textContent = 'Erreur de connexion au serveur.';
            }
        });
    }

    // Téléchargement Brochure
    const downloadForm = document.getElementById('download-form');
    const downloadResponse = document.getElementById('download-response');
    if (downloadForm) {
        downloadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('download-email').value;
            try {
                const response = await fetch('/api/download', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'NovaEnergyCo_Brochure.pdf';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                    downloadResponse.style.color = 'lightgreen';
                    downloadResponse.textContent = 'Merci ! Votre téléchargement va commencer.';
                    downloadForm.reset();
                } else {
                    const result = await response.json();
                    downloadResponse.style.color = '#ffcccc';
                    downloadResponse.textContent = result.error;
                }
            } catch (error) {
                downloadResponse.style.color = '#ffcccc';
                downloadResponse.textContent = 'Erreur de connexion au serveur.';
            }
        });
    }
});