// ==== SISTEMA DE LIBRO DE RECLAMACIONES ====
class ComplaintsSystem {
    constructor() {
        this.form = document.getElementById('complaintsForm');
        this.confirmationMessage = document.getElementById('confirmationMessage');
        this.ticketCounter = this.getTicketCounter();
        this.init();
    }

    init() {
        this.bindEvents();
        this.setMaxDate();
        console.log('Sistema de reclamaciones inicializado');
    }

    bindEvents() {
        // Envío del formulario
        this.form.addEventListener('submit', (e) => {
            this.handleSubmit(e);
        });

        // Limpiar formulario
        document.getElementById('btnLimpiar').addEventListener('click', () => {
            this.clearForm();
        });

        // Contador de caracteres
        document.getElementById('reclamoDetalle').addEventListener('input', (e) => {
            this.updateCharCount(e.target);
        });

        // Validación en tiempo real
        this.form.addEventListener('input', (e) => {
            this.validateField(e.target);
        });

        // Subida de archivos
        document.getElementById('reclamoArchivos').addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });

        // Botones de confirmación
        document.getElementById('btnNuevoReclamo').addEventListener('click', () => {
            this.showForm();
        });

        document.getElementById('btnImprimir').addEventListener('click', () => {
            this.printComplaint();
        });
    }

    setMaxDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('reclamoFecha').setAttribute('max', today);
    }

    updateCharCount(textarea) {
        const charCount = textarea.value.length;
        const counter = document.getElementById('charCount');
        counter.textContent = charCount;

        if (charCount > 1000) {
            counter.style.color = 'var(--accent-color)';
        } else {
            counter.style.color = 'var(--text-light)';
        }
    }

    validateField(field) {
        // Remover mensajes de error previos
        this.clearFieldError(field);

        if (!field.checkValidity()) {
            this.showFieldError(field, this.getErrorMessage(field));
        }
    }

    getErrorMessage(field) {
        if (field.validity.valueMissing) {
            return 'Este campo es obligatorio';
        }

        if (field.validity.typeMismatch) {
            if (field.type === 'email') return 'Ingrese un email válido';
        }

        if (field.validity.patternMismatch) {
            if (field.name === 'numeroDocumento') return 'Ingrese un número de documento válido';
            if (field.name === 'telefono') return 'Ingrese un número de teléfono válido';
            if (field.name === 'nombres' || field.name === 'apellidos') return 'Ingrese solo letras y espacios';
        }

        if (field.validity.rangeOverflow) {
            return 'La fecha no puede ser futura';
        }

        return 'Por favor complete este campo correctamente';
    }

    showFieldError(field, message) {
        field.style.borderColor = 'var(--accent-color)';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: var(--accent-color);
            font-size: 0.8rem;
            margin-top: 0.25rem;
        `;
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            this.showError('Por favor complete todos los campos obligatorios correctamente');
            return;
        }

        if (!document.getElementById('aceptoTerminos').checked) {
            this.showError('Debe aceptar los términos y condiciones');
            return;
        }

        this.showLoading(true);

        try {
            // Simular envío a servidor
            await this.submitComplaint();
            
            // Mostrar confirmación
            this.showConfirmation();
            
        } catch (error) {
            this.showError('Error al enviar el reclamo. Por favor intente nuevamente.');
        } finally {
            this.showLoading(false);
        }
    }

    validateForm() {
        let isValid = true;
        const requiredFields = this.form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            this.clearFieldError(field);
            if (!field.checkValidity()) {
                this.showFieldError(field, this.getErrorMessage(field));
                isValid = false;
            }
        });

        // Validar confirmación de contraseña si aplica
        const password = document.getElementById('registerPassword');
        const confirmPassword = document.getElementById('registerConfirmPassword');
        
        if (password && confirmPassword && password.value !== confirmPassword.value) {
            this.showFieldError(confirmPassword, 'Las contraseñas no coinciden');
            isValid = false;
        }

        return isValid;
    }

    async submitComplaint() {
        const formData = new FormData(this.form);
        
        // Agregar datos adicionales
        formData.append('ticketNumber', this.generateTicketNumber());
        formData.append('fechaEnvio', new Date().toISOString());
        
        // Simular envío a API
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                Math.random() > 0.1 ? resolve() : reject();
            }, 2000);
        });
    }

    generateTicketNumber() {
        this.ticketCounter++;
        localStorage.setItem('complaint_counter', this.ticketCounter);
        
        const ticketNumber = `LR-${new Date().getFullYear()}-${this.ticketCounter.toString().padStart(3, '0')}`;
        document.getElementById('ticketNumber').textContent = ticketNumber;
        
        return ticketNumber;
    }

    getTicketCounter() {
        return parseInt(localStorage.getItem('complaint_counter')) || 0;
    }

    showConfirmation() {
        this.form.style.display = 'none';
        this.confirmationMessage.style.display = 'block';
        
        // Scroll to confirmation
        this.confirmationMessage.scrollIntoView({ behavior: 'smooth' });
    }

    showForm() {
        this.confirmationMessage.style.display = 'none';
        this.form.style.display = 'block';
        this.clearForm();
        
        // Scroll to form
        this.form.scrollIntoView({ behavior: 'smooth' });
    }

    clearForm() {
        this.form.reset();
        this.updateCharCount(document.getElementById('reclamoDetalle'));
        this.clearFilePreview();
        
        // Limpiar errores
        this.form.querySelectorAll('.field-error').forEach(error => error.remove());
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            field.style.borderColor = '';
        });
    }

    handleFileUpload(files) {
        const preview = document.getElementById('filePreview');
        preview.innerHTML = '';

        Array.from(files).forEach(file => {
            if (this.validateFile(file)) {
                this.addFilePreview(file, preview);
            }
        });
    }

    validateFile(file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            this.showError('Tipo de archivo no permitido');
            return false;
        }

        if (file.size > maxSize) {
            this.showError('El archivo excede el tamaño máximo de 5MB');
            return false;
        }

        return true;
    }

    addFilePreview(file, preview) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-preview-item';
        fileItem.innerHTML = `
            <i class="fas fa-file"></i>
            <span>${file.name}</span>
            <button type="button" class="remove-file" aria-label="Eliminar archivo">
                <i class="fas fa-times"></i>
            </button>
        `;

        const removeBtn = fileItem.querySelector('.remove-file');
        removeBtn.addEventListener('click', () => {
            fileItem.remove();
        });

        preview.appendChild(fileItem);
    }

    clearFilePreview() {
        document.getElementById('filePreview').innerHTML = '';
        document.getElementById('reclamoArchivos').value = '';
    }

    printComplaint() {
        const ticketNumber = document.getElementById('ticketNumber').textContent;
        const printContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="text-align: center; color: #333;">La Casa de Luci</h1>
                <h2 style="text-align: center; color: #666;">Comprobante de Reclamo</h2>
                <hr>
                <p><strong>Número de Ticket:</strong> ${ticketNumber}</p>
                <p><strong>Fecha de Envío:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Estado:</strong> Recibido</p>
                <hr>
                <p>Su reclamo ha sido registrado exitosamente. Nos contactaremos con usted dentro de los próximos 15 días hábiles.</p>
                <p style="margin-top: 30px; text-align: center; font-size: 0.9em; color: #666;">
                    Gracias por confiar en La Casa de Luci<br>
                    Carabayllo, Lima - Perú<br>
                    Tel: (+51) 970 170 964
                </p>
            </div>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }

    showLoading(show) {
        const submitBtn = document.querySelector('.btn-submit');
        if (show) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Reclamo';
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

// Inicializar sistema de reclamaciones
document.addEventListener('DOMContentLoaded', () => {
    new ComplaintsSystem();
});