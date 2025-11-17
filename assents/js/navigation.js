// ==== SISTEMA DE NAVEGACIÓN MEJORADO ====
class NavigationSystem {
    constructor() {
        this.mobileMenu = null;
        this.overlay = null;
        this.bottomNav = null;
        this.init();
    }

    init() {
        this.createMobileMenu();
        this.createBottomNav();
        this.bindEvents();
        this.setActiveNavItem();
        this.handleScroll();
        this.handleResize();
    }

    // ==== MENÚ MÓVIL MEJORADO ====
    createMobileMenu() {
        // Crear overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'mobile-menu-overlay';
        this.overlay.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            z-index: 999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        // Crear menú móvil mejorado
        this.mobileMenu = document.createElement('div');
        this.mobileMenu.className = 'mobile-menu';
        this.mobileMenu.style.cssText = `
            position: fixed;
            top: 0;
            right: -100%;
            width: 85%;
            max-width: 300px;
            height: 100%;
            background: var(--bg-white);
            box-shadow: var(--shadow-xl);
            z-index: 1000;
            transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            padding: 2rem 1.5rem;
            overflow-y: auto;
        `;

        this.mobileMenu.innerHTML = `
            <div class="mobile-menu-header">
                <div class="logo">
                    <img src="assents/imagenes/iconos/LogoSf2.png" alt="La Casa de Luci" width="40" height="40">
                    <h3>La Casa de Luci</h3>
                </div>
                <button class="mobile-menu-close" aria-label="Cerrar menú">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <nav class="mobile-nav">
                <a href="index.html" class="mobile-nav-item">
                    <i class="fas fa-home"></i>
                    <span>Inicio</span>
                </a>
                <a href="menu.html" class="mobile-nav-item">
                    <i class="fas fa-utensils"></i>
                    <span>Menú</span>
                </a>
                <a href="nosotros.html" class="mobile-nav-item">
                    <i class="fas fa-info-circle"></i>
                    <span>Nosotros</span>
                </a>
                <a href="cart.html" class="mobile-nav-item">
                    <i class="fas fa-shopping-cart"></i>
                    <span>Carrito</span>
                    <span class="cart-count-mobile">0</span>
                </a>
                <!--<a href="login.html" class="mobile-nav-item">
                    <i class="fas fa-sign-in-alt"></i>
                    <span>Ingresar</span>-->
                </a>
            </nav>
            <div class="mobile-menu-footer">
                <div class="contact-info">
                    <p><i class="fas fa-phone"></i> (+51) 970 170 964</p>
                    <p><i class="fas fa-clock"></i> 10:00 AM - 10:00 PM</p>
                </div>
            </div>
        `;

        document.body.appendChild(this.overlay);
        document.body.appendChild(this.mobileMenu);
    }

    // ==== BARRA INFERIOR (BOTTOM NAV) ====
createBottomNav() {
    this.bottomNav = document.createElement('div');
    this.bottomNav.className = 'bottom-nav';
    this.bottomNav.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: var(--bg-white);
        border-top: 1px solid var(--border-color);
        display: none;
        justify-content: space-around;
        align-items: center;
        padding: 0.5rem 0;
        z-index: 998;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
    `;

    this.bottomNav.innerHTML = `
        <a href="index.html" class="bottom-nav-item" aria-label="Inicio">
            <div class="bottom-nav-icon">
                <i class="fas fa-home"></i>
            </div>
            <span class="bottom-nav-label">Inicio</span>
        </a>

        <a href="menu.html" class="bottom-nav-item" aria-label="Menu">
            <div class="bottom-nav-icon">
                <i class="fas fa-utensils"></i>
            </div>
            <span class="bottom-nav-label">Carta</span>
        </a>        
        
        <a href="cart.html" class="bottom-nav-item" aria-label="Carrito">
            <div class="bottom-nav-icon">
                <i class="fas fa-shopping-cart"></i>
            </div>
            <span class="bottom-nav-label">Carrito</span>
            <span class="bottom-nav-badge">0</span>
        </a>
        <!--<a href="login.html" class="bottom-nav-item" aria-label="Cuenta">
            <div class="bottom-nav-icon">
                <i class="fas fa-user"></i>
            </div>
            <span class="bottom-nav-label">Cuenta</span>
        </a>-->

    `;

    document.body.appendChild(this.bottomNav);
}
    // ==== EVENTOS MEJORADOS ====
    bindEvents() {
        // Toggle menú hamburguesa
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Cerrar menú
        const closeBtn = this.mobileMenu.querySelector('.mobile-menu-close');
        closeBtn.addEventListener('click', () => this.closeMobileMenu());

        // Cerrar al hacer clic en overlay
        this.overlay.addEventListener('click', () => this.closeMobileMenu());

        // Cerrar al hacer clic en enlaces del menú móvil
        const mobileLinks = this.mobileMenu.querySelectorAll('.mobile-nav-item');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Scroll header
        window.addEventListener('scroll', () => this.handleScroll());

        // Resize para mostrar/ocultar bottom nav
        window.addEventListener('resize', () => this.handleResize());

        // Bottom nav events
        this.bindBottomNavEvents();
    }

    bindBottomNavEvents() {
        const bottomNavItems = this.bottomNav.querySelectorAll('.bottom-nav-item');
        bottomNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Actualizar active state
                bottomNavItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    // ==== CONTROL DEL MENÚ ====
    toggleMobileMenu() {
        const isActive = this.mobileMenu.style.right === '0px';
        if (isActive) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.mobileMenu.style.right = '0';
        this.overlay.style.display = 'block';
        setTimeout(() => {
            this.overlay.style.opacity = '1';
        }, 10);
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        this.mobileMenu.style.right = '-100%';
        this.overlay.style.opacity = '0';
        setTimeout(() => {
            this.overlay.style.display = 'none';
        }, 300);
        document.body.style.overflow = '';
    }

    // ==== MANEJO DE RESPONSIVE ====
    handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        // Mostrar/ocultar bottom nav
        if (this.bottomNav) {
            this.bottomNav.style.display = isMobile ? 'flex' : 'none';
        }

        // Mostrar/ocultar menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        
        if (menuToggle && mainNav) {
            if (isMobile) {
                menuToggle.style.display = 'flex';
                mainNav.style.display = 'none';
            } else {
                menuToggle.style.display = 'none';
                mainNav.style.display = 'flex';
                this.closeMobileMenu(); // Cerrar menú móvil en desktop
            }
        }
    }

    // ==== SCROLL HEADER MEJORADO ====
    handleScroll() {
        const header = document.querySelector('.main-header');
        if (header) {
            const scrolled = window.scrollY > 100;
            const isMobile = window.innerWidth <= 768;

            if (isMobile) {
                header.classList.toggle('scrolled', scrolled);
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    // ==== NAVEGACIÓN ACTIVA MEJORADA ====
    setActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Navegación principal
        const mainNavLinks = document.querySelectorAll('.main-nav a');
        this.updateActiveLinks(mainNavLinks, currentPage);

        // Navegación móvil
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');
        this.updateActiveLinks(mobileNavLinks, currentPage);

        // Navegación inferior
        const bottomNavItems = this.bottomNav.querySelectorAll('.bottom-nav-item');
        this.updateActiveLinks(bottomNavItems, currentPage);

        // Actualizar contadores
        this.updateCartCounters();
    }

    updateActiveLinks(links, currentPage) {
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    updateCartCounters() {
        const cart = JSON.parse(localStorage.getItem('lacasa_cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Actualizar todos los contadores
        document.querySelectorAll('.cart-count, .cart-count-mobile, .bottom-nav-badge').forEach(element => {
            element.textContent = totalItems;
        });
    }
}

// Inicializar sistema de navegación
const navigationSystem = new NavigationSystem();

// Actualizar contadores cuando cambie el carrito

// ==== SINCRONIZACIÓN AUTOMÁTICA DEL CARRITO ====

// Sincronizar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (navigationSystem) {
            navigationSystem.updateCartCounters();
        }
    }, 100);
});

// Sincronizar cuando cambia el localStorage
window.addEventListener('storage', (e) => {
    if (e.key === 'lacasa_cart' && navigationSystem) {
        navigationSystem.updateCartCounters();
    }
});

// Sincronizar cuando se modifica el carrito mediante el sistema
if (window.cartSystem) {
    // Interceptar el método updateCartUI del carrito
    const originalUpdateCartUI = window.cartSystem.updateCartUI;
    window.cartSystem.updateCartUI = function() {
        originalUpdateCartUI.call(this);
        if (navigationSystem) {
            navigationSystem.updateCartCounters();
        }
    };
}

// Sincronizar en intervalos (fallback)
setInterval(() => {
    if (navigationSystem) {
        navigationSystem.updateCartCounters();
    }
}, 1000);

// Actualizar cuando se modifique el carrito
if (window.cartSystem) {
    const originalUpdateUI = window.cartSystem.updateCartUI;
    window.cartSystem.updateCartUI = function() {
        originalUpdateUI.call(this);
        if (navigationSystem) {
            navigationSystem.updateCartCounters();
        }
    };
}