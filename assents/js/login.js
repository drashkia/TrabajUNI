// ==== SISTEMA DE LOGIN/REGISTRO ====
class LoginSystem {
    constructor() {
        this.currentMode = 'login';
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkExistingSession();
        console.log('Sistema de login inicializado');
    }

    bindEvents() {
        // Selector de modo
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchMode(e.target.dataset.mode);
            });
        });

        // Toggle visibilidad de contraseña
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                this.togglePasswordVisibility(e.target.closest('.password-toggle'));
            });
        });

        // Validación de fuerza de contraseña
        const passwordInput = document.getElementById('registerPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                this.checkPasswordStrength(e.target.value);
            });
        }

        // Envío de formularios
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            this.handleLogin(e);
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            this.handleRegister(e);
        });

        // Login social
        document.querySelector('.btn-google').addEventListener('click', () => {
            this.socialLogin('google');
        });

        document.querySelector('.btn-facebook').addEventListener('click', () => {
            this.socialLogin('facebook');
        });
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        // Actualizar botones activos
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Mostrar/ocultar formularios
        document.getElementById('loginForm').classList.toggle('active', mode === 'login');
        document.getElementById('registerForm').classList.toggle('active', mode === 'register');
    }

    togglePasswordVisibility(toggleBtn) {
        const input = toggleBtn.parentElement.querySelector('input');
        const icon = toggleBtn.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
            toggleBtn.setAttribute('aria-label', 'Ocultar contraseña');
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
            toggleBtn.setAttribute('aria-label', 'Mostrar contraseña');
        }
    }

    checkPasswordStrength(password) {
        let strength = 0;
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');

        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d]/)) strength++;

        strengthBar.setAttribute('data-strength', strength);
        
        const messages = ['Muy débil', 'Débil', 'Media', 'Fuerte', 'Muy fuerte'];
        strengthText.textContent = messages[strength];
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberMe = formData.get('rememberMe');

        // Validación básica
        if (!this.validateEmail(email)) {
            this.showError('Por favor ingresa un email válido');
            return;
        }

        if (password.length < 6) {
            this.showError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        // Simular proceso de login
        this.showLoading(true);
        
        try {
            // En una implementación real ---> llamada a la API
            await this.simulateAPICall();
            
            // Guardar sesión
            this.saveSession(email, rememberMe);
            
            this.showSuccess('¡Bienvenido de vuelta!');
            
            // Redirigir después de login exitoso
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } catch (error) {
            this.showError('Credenciales incorrectas. Por favor intenta de nuevo.');
        } finally {
            this.showLoading(false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        // Validaciones
        if (!this.validateEmail(email)) {
            this.showError('Por favor ingresa un email válido');
            return;
        }

        if (password.length < 8) {
            this.showError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('Las contraseñas no coinciden');
            return;
        }

        if (!document.getElementById('acceptTerms').checked) {
            this.showError('Debes aceptar los términos y condiciones');
            return;
        }

        // Simular proceso de registro
        this.showLoading(true);
        
        try {
            await this.simulateAPICall();
            
            this.showSuccess('¡Cuenta creada exitosamente!');
            
            // Cambiar a modo login después de registro exitoso
            setTimeout(() => {
                this.switchMode('login');
            }, 2000);
            
        } catch (error) {
            this.showError('Error al crear la cuenta. Por favor intenta de nuevo.');
        } finally {
            this.showLoading(false);
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async simulateAPICall() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simular éxito (en producción, aquí validarías con el backend)
                Math.random() > 0.1 ? resolve() : reject();
            }, 1500);
        });
    }

    saveSession(email, rememberMe) {
        const sessionData = {
            email: email,
            loggedIn: true,
            timestamp: Date.now()
        };
        
        if (rememberMe) {
            localStorage.setItem('lacasa_user', JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem('lacasa_user', JSON.stringify(sessionData));
        }
    }

    checkExistingSession() {
        const userData = localStorage.getItem('lacasa_user') || sessionStorage.getItem('lacasa_user');
        if (userData) {
            const user = JSON.parse(userData);
            if (user.loggedIn) {
                // Usuario ya está logueado, redirigir
                window.location.href = 'index.html';
            }
        }
    }

    socialLogin(provider) {
        this.showLoading(true);
        
        // Simular login social
        setTimeout(() => {
            this.showSuccess(`Iniciaste sesión con ${provider}`);
            this.showLoading(false);
            
            // Redirigir después de login exitoso
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }, 2000);
    }

    showLoading(show) {
        const submitBtns = document.querySelectorAll('.btn-login-submit, .btn-register-submit');
        submitBtns.forEach(btn => {
            if (show) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
            } else {
                btn.disabled = false;
                if (btn.classList.contains('btn-login-submit')) {
                    btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
                } else {
                    btn.innerHTML = '<i class="fas fa-user-plus"></i> Crear Cuenta';
                }
            }
        });
    }

    showSuccess(message) {
        if (window.cartSystem && window.cartSystem.showToast) {
            window.cartSystem.showToast(message);
        } else {
            alert(message);
        }
    }

    showError(message) {
        if (window.cartSystem && window.cartSystem.showToast) {
            window.cartSystem.showToast(message, 'error');
        } else {
            alert(message);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new LoginSystem();
});