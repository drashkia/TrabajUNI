// ==== INICIALIZACIÓN PRINCIPAL DE LA APLICACIÓN ====
class LaCasaDeLuciApp {
    constructor() {
        this.init();
    }

    init() {
        this.initSystems();
        this.bindGlobalEvents();
        this.setCurrentPage();
        console.log('La Casa de Luci - Aplicación inicializada');
    }

    initSystems() {        
        // Verificar que los sistemas estén disponibles
        this.checkSystems();
    }

    checkSystems() {
        const systems = ['cartSystem', 'navigationSystem', 'modalSystem'];
        systems.forEach(system => {
            if (window[system]) {
                console.log(`${system} inicializado correctamente`);
            } else {
                console.warn(` ${system} no está disponible`);
            }
        });

        // Verificar sistemas específicos de páginas
        if (document.querySelector('.menu-carousel') && !window.menuCarousel) {
            console.warn('Carrusel del menú no inicializado');
        }

        if (document.querySelector('.category-nav-item') && !window.menuFilterSystem) {
            console.warn('Filtros del menú no inicializados');
        }
    }

    // ==== EVENTOS GLOBALES ====
    bindGlobalEvents() {
        // Manejo de errores globales
        window.addEventListener('error', (event) => {
            console.error('Error global:', event.error);
            this.showErrorToast('Ha ocurrido un error inesperado');
        });

        // Manejo de promises rechazadas
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Promise rechazada:', event.reason);
            this.showErrorToast('Error en una operación');
        });

        // Optimización de imágenes lazy loading
        this.initImageOptimization();

        // Mejoras de rendimiento
        this.initPerformanceOptimizations();
    }

    // ==== OPTIMIZACIÓN DE IMÁGENES ====
    initImageOptimization() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('fade-in-up');
                        observer.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback para navegadores antiguos
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // ==== OPTIMIZACIONES DE RENDIMIENTO ====
    initPerformanceOptimizations() {
        // Debounce para eventos de resize
        this.debouncedResize = this.debounce(() => {
            this.handleResize();
        }, 250);

        window.addEventListener('resize', this.debouncedResize);

        // Preconexión para recursos externos
        this.addResourceHints();
    }

    handleResize() {
        // Cerrar menú móvil en desktop
        if (window.innerWidth > 768) {
            if (window.navigationSystem) {
                window.navigationSystem.closeMobileMenu();
            }
        }
    }

    // ==== PÁGINA ACTUAL ====
    setCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.body.setAttribute('data-page', currentPage.replace('.html', ''));
        
        // Ejecutar código específico por página
        this.runPageSpecificCode(currentPage);
    }

    runPageSpecificCode(page) {
        switch(page) {
            case 'menu.html':
                this.initMenuPage();
                break;
            case 'cart.html':
                this.initCartPage();
                break;
            case 'index.html':
                this.initHomePage();
                break;
            default:
                this.initGeneralPage();
        }
    }

    initMenuPage() {
        console.log('Página del menú inicializada');

    }

    initCartPage() {
        console.log('Página del carrito inicializada');

    }

    initHomePage() {
        console.log('Página de inicio inicializada');
    }

    initGeneralPage() {
        console.log('Página general inicializada');
    }

    // ==== UTILIDADES ====
    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    addResourceHints() {
        // Preconexión para Font Awesome
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = 'https://cdnjs.cloudflare.com';
        document.head.appendChild(link);
    }

    showErrorToast(message) {
        // Usar el sistema de toasts del carrito si está disponible
        if (window.cartSystem && window.cartSystem.showToast) {
            window.cartSystem.showToast(message, 'error');
        } else {
            // Fallback básico
            console.error('Toast error:', message);
        }
    }

    // ==== MÉTODOS PÚBLICOS ====
    getCartCount() {
        return window.cartSystem ? window.cartSystem.getTotalItems() : 0;
    }

    getCurrentCategory() {
        return window.menuFilterSystem ? window.menuFilterSystem.getCurrentCategory() : null;
    }

    // ==== DESTRUCTOR ====
    destroy() {
        window.removeEventListener('resize', this.debouncedResize);
        // Limpiar otros event listeners si es necesario
    }
}

// ==== INICIALIZACIÓN CUANDO EL DOM ESTÉ LISTO ====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar aplicación principal
    window.app = new LaCasaDeLuciApp();
    
    // Hacer sistemas globalmente disponibles
    window.cartSystem = typeof cartSystem !== 'undefined' ? cartSystem : null;
    window.navigationSystem = typeof navigationSystem !== 'undefined' ? navigationSystem : null;
    window.modalSystem = typeof modalSystem !== 'undefined' ? modalSystem : null;
    
    // Inicializar sistemas específicos si existen en la página
    if (document.querySelector('.menu-carousel')) {
        console.log('Inicializando carrusel del menú...');
        // Se inicializa automáticamente en carousel.js
    }
    
    if (document.querySelector('.category-nav-item')) {
        console.log('Inicializando navegación del menú...');
        // Se inicializa automáticamente en menu-filters.js
    }

    console.log('Todos los sistemas JavaScript inicializados correctamente');
});

// ==== MANEJO DE ERRORES GLOBALES ====
window.addEventListener('error', (event) => {
    console.error('Error global capturado:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rechazada no manejada:', event.reason);
});

// ==== EXPORT PARA MÓDULOS (futura compatibilidad) ====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LaCasaDeLuciApp };
}