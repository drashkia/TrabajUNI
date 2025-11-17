// ==== SISTEMA DE CARRITO MEJORADO ====
class CartSystem {
    constructor() {
        this.cart = [];
        this.storageKey = 'lacasa_cart';
        this.init();
    }

    init() {
        this.loadCart();
        this.bindCartEvents();
        this.updateCartUI();
        console.log('Sistema de carrito inicializado');
    }

    // ==== GESTIÓN DEL CARRITO ====
    addToCart(productData) {
        const product = {
            id: this.generateId(),
            name: productData.name,
            price: parseFloat(productData.price),
            image: productData.image,
            quantity: 1
        };

        const existingItem = this.cart.find(item => item.name === product.name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push(product);
        }

        this.saveCart();
        this.updateCartUI();
        this.showToast('✅ Producto agregado al carrito');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
        this.showToast('🗑️ Producto eliminado del carrito');
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartUI(); // Asegurar que se actualice la UI
        this.showToast('🛒 Carrito vaciado');
    }

    // ==== PERSISTENCIA ====
    saveCart() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
    }

    loadCart() {
        try {
            const savedCart = localStorage.getItem(this.storageKey);
            this.cart = savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            this.cart = [];
        }
    }

    // ==== CÁLCULOS ====
    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // ==== INTERFAZ DE USUARIO ====
    updateCartUI() {
        // Actualizar contadores en TODAS las páginas
        const cartCounts = document.querySelectorAll('.cart-count, .cart-count-mobile');
        cartCounts.forEach(element => {
            element.textContent = this.getTotalItems();
        });

        // Actualizar página del carrito si existe
        this.renderCartPage();
    }

    renderCartPage() {
        const cartContainer = document.querySelector('.cart-items-container');
        if (!cartContainer) return;

        if (this.cart.length === 0) {
            cartContainer.innerHTML = this.getEmptyCartHTML();
            this.disableCheckout();
            this.updateCartSummary(); //Actualizar resumen cuando está vacío
            return;
        }

        this.enableCheckout();
        cartContainer.innerHTML = this.cart.map(item => this.getCartItemHTML(item)).join('');
        this.updateCartSummary();
    }

    getEmptyCartHTML() {
        return `
            <div class="empty-cart-message">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega algunos productos deliciosos de nuestro menú</p>
                <a href="menu.html" class="btn btn-primary">
                    <i class="fas fa-utensils"></i>
                    Ver Menú
                </a>
            </div>
        `;
    }

    getCartItemHTML(item) {
        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <div class="cart-item-price">S/ ${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-total">S/ ${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="cart-item-remove" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    //  actualizar el resumen
    updateCartSummary() {
        const subtotal = this.getTotalPrice();
        const delivery = 5.00;
        const total = subtotal + delivery;

        const summaryHTML = `
            <div class="summary-row">
                <span>Subtotal:</span>
                <span class="summary-value">S/ ${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Delivery:</span>
                <span class="summary-value">S/ ${delivery.toFixed(2)}</span>
            </div>
            <div class="summary-row summary-total">
                <span>Total:</span>
                <span class="summary-value">S/ ${total.toFixed(2)}</span>
            </div>
        `;

        const summaryContainer = document.querySelector('.summary-details');
        if (summaryContainer) {
            summaryContainer.innerHTML = summaryHTML;
        }

        // Actualizar  botón de checkout
        this.updateCheckoutButton();
    }

    disableCheckout() {
        const checkoutBtn = document.querySelector('.btn-checkout');
        if (checkoutBtn) {
            checkoutBtn.disabled = true;
            checkoutBtn.innerHTML = '<i class="fas fa-credit-card"></i> Carrito Vacío';
        }
    }

    enableCheckout() {
        const checkoutBtn = document.querySelector('.btn-checkout');
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
            checkoutBtn.innerHTML = '<i class="fas fa-credit-card"></i> Proceder al Pago';
        }
    }

    // CORRECCIÓN: Método para actualizar el botón de checkout
    updateCheckoutButton() {
        if (this.cart.length === 0) {
            this.disableCheckout();
        } else {
            this.enableCheckout();
        }
    }

    // ==== EVENTOS ====
    bindCartEvents() {
        document.addEventListener('click', (e) => {
            // Agregar al carrito desde productos
            if (e.target.closest('.btn-add-cart')) {
                const btn = e.target.closest('.btn-add-cart');
                const productData = {
                    name: btn.dataset.name,
                    price: btn.dataset.price,
                    image: btn.dataset.image
                };
                this.addToCart(productData);
            }

            // Control de cantidad en carrito
            if (e.target.closest('.quantity-btn.minus')) {
                const productId = e.target.closest('.quantity-btn').dataset.id;
                this.updateQuantity(productId, -1);
            }

            if (e.target.closest('.quantity-btn.plus')) {
                const productId = e.target.closest('.quantity-btn').dataset.id;
                this.updateQuantity(productId, 1);
            }

            // Eliminar producto
            if (e.target.closest('.cart-item-remove')) {
                const productId = e.target.closest('.cart-item-remove').dataset.id;
                this.removeFromCart(productId);
            }

            // Vaciar carrito - CORRECCIÓN MEJORADA
            if (e.target.closest('.btn-clear-cart')) {
                if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                    this.clearCart();
                    // CORRECCIÓN: Forzar actualización completa
                    this.forceCartRefresh();
                }
            }

            // Checkout
            if (e.target.closest('.btn-checkout')) {
                this.handleCheckout();
            }
        });
    }

    //  Método para forzar actualización completa del carrito
    forceCartRefresh() {
        // Actualizar contadores
        this.updateCartUI();
        
        // Forzar actualización del resumen
        this.updateCartSummary();
        
        // Si estamos en la página del carrito, recargar los eventos
        if (document.querySelector('.cart-items-container')) {
            this.rebindCartEvents();
        }
    }

    // Re-vincular eventos después de vaciar carrito
    rebindCartEvents() {
        // Remover event listeners existentes
        document.removeEventListener('click', this.boundEventHandler);
        
        // Volver a vincular
        this.bindCartEvents();
    }

    handleCheckout() {
        if (this.cart.length === 0) {
            this.showToast('❌ Agrega productos al carrito primero', 'error');
            return;
        }

        const itemsText = this.cart.map(item => 
            `${item.quantity}x ${item.name} - S/ ${(item.price * item.quantity).toFixed(2)}`
        ).join("%0A");

        const total = this.getTotalPrice() + 5.00;
        const message = `Hola La Casa de Luci, quiero hacer un pedido:%0A%0A${itemsText}%0A%0A*Delivery:* S/ 5.00%0A*Total:* S/ ${total.toFixed(2)}%0A%0A*Mi información:*%0A[Nombre]%0A[Dirección]%0A[Referencia]%0A[Teléfono]`;

        window.open(`https://wa.me/51970170964?text=${message}`, '_blank');
        this.showToast('📱 Redirigiendo a WhatsApp...');
    }

    // ==== UTILIDADES ====
    generateId() {
        return 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    showToast(message, type = 'success') {
        // Eliminar toast existente
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        // Crear nuevo toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(toast);

        // Animación
        setTimeout(() => toast.style.transform = 'translateX(0)', 10);
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Inicializar sistema de carrito
const cartSystem = new CartSystem();