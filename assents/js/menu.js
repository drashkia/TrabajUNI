// Funcionalidades específicas para la página de carta/menú
class MenuPage {
    constructor() {
        this.categories = document.querySelectorAll('.menu-category');
        this.categoryNavItems = document.querySelectorAll('.category-nav-item');
        this.currentCategory = 'broasters';
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupScrollSpy();
        this.setupSmoothScrolling();
        this.initializeDefaultView();
        console.log('✅ Sistema de menú inicializado');
    }

    bindEvents() {
        // Navegación por categorías - CON FILTRADO
        this.categoryNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCategoryNavClick(e.currentTarget);
            });
        });
    }

    //Navegación con filtrado pero sin problemas de scroll
    handleCategoryNavClick(navItem) {
        const category = navItem.dataset.category;
        
        // Actualizar navegación activa
        this.updateCategoryNav(navItem);
        
        // Filtrar categorías (mostrar solo la seleccionada)
        this.filterCategories(category);
        
        // Hacer scroll al inicio del menu-container
        this.scrollToMenuContainer();
    }

    updateCategoryNav(activeItem) {
        this.categoryNavItems.forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }

    // Filtrar categorías sin afectar el scroll
    filterCategories(targetCategory) {
        this.currentCategory = targetCategory;
        
        this.categories.forEach(category => {
            if (category.dataset.category === targetCategory) {
                // Mostrar categoría seleccionada
                category.style.display = 'block';
                setTimeout(() => {
                    category.style.opacity = '1';
                    category.style.transform = 'translateY(0)';
                }, 50);
            } else {
                // Ocultar otras categorías
                category.style.opacity = '0';
                category.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    category.style.display = 'none';
                }, 300);
            }
        });
    }

    // Scroll al inicio del menu-container
    scrollToMenuContainer() {
        const menuContainer = document.querySelector('.menu-container');
        if (menuContainer) {
            const header = document.querySelector('.solid-header') || document.querySelector('.main-header');
            const headerHeight = header ? header.offsetHeight : 0;
            
            // Scroll al inicio del contenedor del menú
            const targetPosition = menuContainer.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Inicializar mostrando solo broasters
    initializeDefaultView() {
        // Mostrar solo broasters al inicio, ocultar los demás
        this.categories.forEach(category => {
            if (category.dataset.category === 'broasters') {
                category.style.display = 'block';
                category.style.opacity = '1';
                category.style.transform = 'translateY(0)';
            } else {
                category.style.display = 'none';
                category.style.opacity = '0';
                category.style.transform = 'translateY(20px)';
            }
        });
        
        // Activar la primera categoría en la navegación
        const firstNavItem = this.categoryNavItems[0];
        if (firstNavItem) {
            firstNavItem.classList.add('active');
        }
        
        // Scroll al inicio de la página
        window.scrollTo({ top: 0, behavior: 'auto' });
    }

    setupScrollSpy() {
        if (!('IntersectionObserver' in window)) return;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const category = entry.target.id;
                    this.highlightActiveCategory(category);
                }
            });
        }, observerOptions);

        this.categories.forEach(category => {
            if (category.id) {
                observer.observe(category);
            }
        });
    }

    highlightActiveCategory(activeCategory) {
        this.categoryNavItems.forEach(item => {
            if (item.dataset.category === activeCategory) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href !== '#' && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    
                    // Encontrar el nav item correspondiente y activarlo
                    const targetNavItem = document.querySelector(`.category-nav-item[data-category="${targetId}"]`);
                    if (targetNavItem) {
                        this.handleCategoryNavClick(targetNavItem);
                    }
                }
            });
        });
    }


    highlightCurrentCategory() {
        const hash = window.location.hash.substring(1);
        if (hash && this.isValidCategory(hash)) {
            const targetNavItem = document.querySelector(`.category-nav-item[data-category="${hash}"]`);
            if (targetNavItem) {
                // Pequeño delay para asegurar que el DOM esté listo
                setTimeout(() => {
                    this.handleCategoryNavClick(targetNavItem);
                }, 100);
            }
        }
    }

    // Método auxiliar para validar categorías
    isValidCategory(category) {
        const validCategories = ['broasters', 'salchipapas', 'hamburguesas', 'bebidas', 'combos'];
        return validCategories.includes(category);
    }

    // Para mostrar todas las categorías
    showAllCategories() {
        this.categories.forEach(category => {
            category.style.display = 'block';
            setTimeout(() => {
                category.style.opacity = '1';
                category.style.transform = 'translateY(0)';
            }, 50);
        });
        
        // Remover active de todos los nav items
        this.categoryNavItems.forEach(item => {
            item.classList.remove('active');
        });
        
        this.currentCategory = 'all';
    }
}

// CSS para animaciones de filtrado
const menuStyles = `
    .menu-category {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .category-nav-item.active {
        color: var(--primary-color);
    }

    .category-nav-item.active .category-icon {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(117, 86, 67, 0.4);
        background: linear-gradient(135deg, var(--primary-dark), var(--primary-color));
    }

    /* Animación suave para el cambio de categorías */
    .menu-container {
        transition: all 0.3s ease;
    }
`;

if (!document.querySelector('#menu-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'menu-styles';
    styleSheet.textContent = menuStyles;
    document.head.appendChild(styleSheet);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.menu-category')) {
        window.menuPage = new MenuPage();
        console.log('✅ Página de menú inicializada correctamente');
    }
});