// ==== SISTEMA DE MODALES MEJORADO ====
class ModalSystem {
    constructor() {
        this.currentModal = null;
        this.init();
    }

    init() {
        this.bindModalEvents();
        this.applyModalStyles();
        console.log('🪟 Sistema de modales inicializado');
    }

    // ==== MODAL DE PRODUCTO ====
    openProductModal(productData) {
        // Cerrar modal existente
        this.closeAllModals();

        const modalHTML = `
            <div class="modal-overlay active" role="dialog" aria-labelledby="modal-product-title" aria-modal="true">
                <div class="modal-content">
                    <button class="modal-close" aria-label="Cerrar modal">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="modal-body">
                        <div class="modal-image">
                            <img src="${productData.image}" alt="${productData.name}" loading="lazy">
                        </div>
                        <div class="modal-info">
                            <h3 id="modal-product-title">${productData.name}</h3>
                            <p class="modal-description">${productData.description || 'Delicioso producto preparado con ingredientes frescos y de la más alta calidad.'}</p>
                            <div class="modal-features">
                                <div class="feature-item">
                                    <i class="fas fa-clock"></i>
                                    <span>Preparación: 15-20 min</span>
                                </div>
                                <div class="feature-item">
                                    <i class="fas fa-star"></i>
                                    <span>Ingredientes frescos</span>
                                </div>
                            </div>
                            <div class="modal-price">S/ ${parseFloat(productData.price).toFixed(2)}</div>
                            <div class="modal-actions">
                                <button class="btn btn-primary btn-add-cart-modal"
                                    data-name="${productData.name}"
                                    data-price="${productData.price}"
                                    data-image="${productData.image}">
                                    <i class="fas fa-cart-plus"></i>
                                    Agregar al Carrito
                                </button>
                                <button class="btn btn-outline btn-close-modal">
                                    <i class="fas fa-times"></i>
                                    Seguir Viendo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.currentModal = document.querySelector('.modal-overlay');

        // Eventos del modal
        this.bindProductModalEvents(productData);
        
        // Bloquear scroll del body
        document.body.style.overflow = 'hidden';
    }

    applyModalStyles() {
        const modalStyles = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
                padding: 1rem;
            }
            
            .modal-overlay.active {
                opacity: 1;
            }
            
            .modal-content {
                background: white;
                border-radius: 20px;
                max-width: 900px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                transform: scale(0.8) translateY(50px);
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            }
            
            .modal-overlay.active .modal-content {
                transform: scale(1) translateY(0);
            }
            
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: rgba(0, 0, 0, 0.1);
                border: none;
                font-size: 1.5rem;
                color: var(--text-light);
                cursor: pointer;
                z-index: 1;
                width: 45px;
                height: 45px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }
            
            .modal-close:hover {
                background: var(--accent-color);
                color: white;
                transform: rotate(90deg);
            }
            
            .modal-body {
                display: grid;
                grid-template-columns: 1fr;
                gap: 0;
            }
            
            .modal-image {
                height: 300px;
                overflow: hidden;
                position: relative;
            }
            
            .modal-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
            }
            
            .modal-image:hover img {
                transform: scale(1.05);
            }
            
            .modal-info {
                padding: 2.5rem;
            }
            
            .modal-info h3 {
                color: var(--primary-color);
                margin-bottom: 1rem;
                font-size: 1.8rem;
                font-weight: 700;
            }
            
            .modal-description {
                color: var(--text-light);
                margin-bottom: 1.5rem;
                line-height: 1.6;
                font-size: 1.1rem;
            }
            
            .modal-features {
                display: flex;
                gap: 1.5rem;
                margin-bottom: 2rem;
                flex-wrap: wrap;
            }
            
            .feature-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: var(--text-light);
                font-size: 0.9rem;
            }
            
            .feature-item i {
                color: var(--primary-color);
            }
            
            .modal-price {
                font-size: 2.5rem;
                font-weight: 800;
                color: var(--accent-color);
                margin-bottom: 2rem;
                text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
            }
            
            .modal-actions {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }
            
            .btn-add-cart-modal {
                flex: 1;
                min-width: 200px;
            }
            
            .btn-close-modal {
                flex: 1;
                min-width: 150px;
            }
            
            @media (min-width: 768px) {
                .modal-body {
                    grid-template-columns: 1fr 1fr;
                }
                
                .modal-image {
                    height: auto;
                }
            }
            
            @media (max-width: 767px) {
                .modal-content {
                    max-width: 95%;
                    margin: 1rem;
                }
                
                .modal-actions {
                    flex-direction: column;
                }
                
                .modal-info {
                    padding: 2rem 1.5rem;
                }
            }
        `;

        // Aplicar estilos solo si no existen
        if (!document.querySelector('#modal-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'modal-styles';
            styleSheet.textContent = modalStyles;
            document.head.appendChild(styleSheet);
        }
    }

    bindProductModalEvents(productData) {
        const modal = this.currentModal;
        const closeBtn = modal.querySelector('.modal-close');
        const closeModalBtn = modal.querySelector('.btn-close-modal');
        
        // Cerrar modal
        const closeModal = () => this.closeModal(modal);
        
        closeBtn.addEventListener('click', closeModal);
        closeModalBtn.addEventListener('click', closeModal);
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Cerrar con ESC
        const closeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };
        document.addEventListener('keydown', closeHandler);

        // Agregar al carrito desde modal
        const addBtn = modal.querySelector('.btn-add-cart-modal');
        addBtn.addEventListener('click', () => {
            if (window.cartSystem) {
                window.cartSystem.addToCart(productData);
                this.showAddToCartAnimation(addBtn);
            }
            setTimeout(() => {
                this.closeModal(modal);
            }, 1000);
        });

        // Guardar referencia para limpiar event listeners
        modal._closeHandler = closeHandler;
    }

    showAddToCartAnimation(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
        button.style.background = 'var(--accent-color)';
        button.style.borderColor = 'var(--accent-color)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            button.style.borderColor = '';
        }, 1000);
    }

    closeModal(modal) {
        if (modal._closeHandler) {
            document.removeEventListener('keydown', modal._closeHandler);
        }
        
        modal.style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'scale(0.8) translateY(50px)';
        
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
            this.currentModal = null;
        }, 300);
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => this.closeModal(modal));
    }

    // ==== EVENTOS GLOBALES ====
    bindModalEvents() {
        // Delegación de eventos para abrir modales de producto
        document.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const addToCartBtn = e.target.closest('.btn-add-cart');
            
            if (productCard && !addToCartBtn) {
                e.preventDefault();
                const productData = this.extractProductData(productCard);
                this.openProductModal(productData);
            }
        });
    }

    extractProductData(productCard) {
        return {
            name: productCard.querySelector('h3').textContent,
            price: productCard.querySelector('.product-price').textContent.replace('S/ ', ''),
            image: productCard.querySelector('img').src,
            description: productCard.querySelector('.product-description')?.textContent
        };
    }

    // ==== MODALES DE CONFIRMACIÓN ====
    openConfirmationModal(title, message, onConfirm) {
        const modalHTML = `
            <div class="modal-overlay active">
                <div class="modal-content" style="max-width: 500px;">
                    <div class="modal-info">
                        <h3>${title}</h3>
                        <p>${message}</p>
                        <div class="modal-actions">
                            <button class="btn btn-primary btn-confirm">Confirmar</button>
                            <button class="btn btn-outline btn-cancel">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = document.querySelector('.modal-overlay:last-child');

        modal.querySelector('.btn-confirm').addEventListener('click', () => {
            onConfirm();
            this.closeModal(modal);
        });

        modal.querySelector('.btn-cancel').addEventListener('click', () => {
            this.closeModal(modal);
        });

        this.bindModalCloseEvents(modal);
    }

    bindModalCloseEvents(modal) {
        const closeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modal);
            }
        };
        
        document.addEventListener('keydown', closeHandler);
        modal._closeHandler = closeHandler;
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
    }
}

// Inicializar sistema de modales
const modalSystem = new ModalSystem();
window.modalSystem = modalSystem;

