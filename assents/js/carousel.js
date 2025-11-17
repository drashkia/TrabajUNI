// ==== SISTEMA DE CARRUSEL MEJORADO ====
class CarouselSystem {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.slides = this.container.querySelectorAll('.carousel-slide');
        this.indicators = this.container.querySelectorAll('.indicator');
        this.prevBtn = this.container.querySelector('.carousel-prev');
        this.nextBtn = this.container.querySelector('.carousel-next');
        
        this.currentSlide = 0;
        this.autoPlayInterval = null;
        this.slideInterval = 3000; // 000 segundos
        this.isAnimating = false;

        this.init();
    }

    init() {
        if (this.slides.length === 0) return;

        this.bindEvents();
        this.startAutoPlay();
        this.updateActiveSlide();
    }

    // ==== EVENTOS ====
    bindEvents() {
        // Botones anterior/siguiente
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Pausar autoplay al interactuar
        this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());

        // Navegación por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Touch events para móviles
        this.bindTouchEvents();

        // Intersection Observer para pausar cuando no es visible
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.startAutoPlay();
                    } else {
                        this.pauseAutoPlay();
                    }
                });
            });

            observer.observe(this.container);
        }
    }

    bindTouchEvents() {
        let startX = 0;
        let endX = 0;

        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    // ==== CONTROL DE SLIDES ====
    nextSlide() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateActiveSlide();
        this.restartAutoPlay();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 1000);
    }

    prevSlide() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateActiveSlide();
        this.restartAutoPlay();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 1000);
    }

    goToSlide(index) {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        this.currentSlide = index;
        this.updateActiveSlide();
        this.restartAutoPlay();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 1000);
    }

    updateActiveSlide() {
        // Remover clase active de todos los slides e indicadores
        this.slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.transition = 'opacity 1s ease-in-out';
        });
        
        this.indicators.forEach(indicator => indicator.classList.remove('active'));

        // Agregar clase active al slide e indicador actual
        if (this.slides[this.currentSlide]) {
            setTimeout(() => {
                this.slides[this.currentSlide].classList.add('active');
            }, 50);
        }
        
        if (this.indicators[this.currentSlide]) {
            this.indicators[this.currentSlide].classList.add('active');
        }
    }

    // ==== AUTOPLAY ====
    startAutoPlay() {
        if (this.autoPlayInterval) return;

        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.slideInterval);
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    restartAutoPlay() {
        this.pauseAutoPlay();
        this.startAutoPlay();
    }

    // ==== UTILIDADES ====
    destroy() {
        this.pauseAutoPlay();
        // Remover event listeners si es necesario
    }
}

// Inicializar carruseles en la página
document.addEventListener('DOMContentLoaded', () => {
    // Carrusel del menú
    const menuCarousel = new CarouselSystem('.menu-carousel');
    
    // Hacer disponible globalmente para debugging
    window.menuCarousel = menuCarousel;
    
    console.log('🚀 Carrusel del menú inicializado');
});