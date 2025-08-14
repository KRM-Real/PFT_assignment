// Forms Controller - Enhanced form handling with validation
export class FormController {
    constructor(appState) {
        this.state = appState;
        this.forms = new Map();
        this.validators = new Map();
        this.setupValidators();
    }

    async init() {
        this.bindForms();
        this.setupEventListeners();
    }

    setupValidators() {
        this.validators.set('email', {
            test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Please enter a valid email address'
        });

        this.validators.set('required', {
            test: (value) => value.trim().length > 0,
            message: 'This field is required'
        });

        this.validators.set('phone', {
            test: (value) => /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, '')),
            message: 'Please enter a valid phone number'
        });

        this.validators.set('minLength', {
            test: (value, min = 3) => value.trim().length >= min,
            message: (min) => `Must be at least ${min} characters long`
        });
    }

    bindForms() {
        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            this.forms.set('contact', {
                element: contactForm,
                fields: this.getFormFields(contactForm),
                onSubmit: this.handleContactSubmit.bind(this)
            });
        }

        // Search form
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            this.forms.set('search', {
                element: searchForm,
                fields: this.getFormFields(searchForm),
                onSubmit: this.handleSearchSubmit.bind(this)
            });
        }
    }

    getFormFields(form) {
        const fields = new Map();
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            fields.set(input.name || input.id, {
                element: input,
                errorElement: document.getElementById(`${input.id}Error`),
                rules: this.getValidationRules(input)
            });
        });

        return fields;
    }

    getValidationRules(input) {
        const rules = [];
        
        if (input.required) {
            rules.push({ type: 'required' });
        }
        
        if (input.type === 'email') {
            rules.push({ type: 'email' });
        }
        
        if (input.type === 'tel') {
            rules.push({ type: 'phone' });
        }
        
        const minLength = input.getAttribute('minlength');
        if (minLength) {
            rules.push({ type: 'minLength', param: parseInt(minLength) });
        }

        return rules;
    }

    setupEventListeners() {
        this.forms.forEach((form, formName) => {
            // Form submission
            form.element.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(formName, e);
            });

            // Real-time validation
            form.fields.forEach((field, fieldName) => {
                field.element.addEventListener('blur', () => {
                    this.validateField(formName, fieldName);
                });

                field.element.addEventListener('input', () => {
                    this.clearFieldError(formName, fieldName);
                });
            });
        });
    }

    validateField(formName, fieldName) {
        const form = this.forms.get(formName);
        const field = form.fields.get(fieldName);
        
        if (!field) return true;

        const value = field.element.value;
        
        for (const rule of field.rules) {
            const validator = this.validators.get(rule.type);
            if (!validator) continue;

            const isValid = validator.test(value, rule.param);
            if (!isValid) {
                const message = typeof validator.message === 'function' 
                    ? validator.message(rule.param)
                    : validator.message;
                
                this.showFieldError(formName, fieldName, message);
                return false;
            }
        }

        this.clearFieldError(formName, fieldName);
        return true;
    }

    validateForm(formName) {
        const form = this.forms.get(formName);
        if (!form) return false;

        let isValid = true;
        
        form.fields.forEach((field, fieldName) => {
            const fieldValid = this.validateField(formName, fieldName);
            if (!fieldValid) isValid = false;
        });

        return isValid;
    }

    showFieldError(formName, fieldName, message) {
        const form = this.forms.get(formName);
        const field = form.fields.get(fieldName);
        
        if (field.errorElement) {
            field.errorElement.textContent = message;
            field.errorElement.style.display = 'block';
        }
        
        field.element.style.borderColor = '#e74c3c';
        field.element.setAttribute('aria-invalid', 'true');
        field.element.setAttribute('aria-describedby', field.errorElement?.id || '');
    }

    clearFieldError(formName, fieldName) {
        const form = this.forms.get(formName);
        const field = form.fields.get(fieldName);
        
        if (field.errorElement) {
            field.errorElement.style.display = 'none';
        }
        
        field.element.style.borderColor = '';
        field.element.removeAttribute('aria-invalid');
        field.element.removeAttribute('aria-describedby');
    }

    handleFormSubmit(formName, event) {
        const form = this.forms.get(formName);
        if (!form) return;

        const isValid = this.validateForm(formName);
        
        if (isValid) {
            form.onSubmit(this.getFormData(formName), event);
        } else {
            // Focus first invalid field
            const firstInvalidField = Array.from(form.fields.values())
                .find(field => field.element.hasAttribute('aria-invalid'));
            
            if (firstInvalidField) {
                firstInvalidField.element.focus();
            }
        }
    }

    getFormData(formName) {
        const form = this.forms.get(formName);
        const data = {};
        
        form.fields.forEach((field, fieldName) => {
            data[fieldName] = field.element.value.trim();
        });

        return data;
    }

    async handleContactSubmit(data, event) {
        try {
            // Show loading state
            const submitBtn = event.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate API call (replace with actual endpoint)
            await this.simulateAPICall(data);

            // Reset form
            this.resetForm('contact');
            
            // Show success message
            this.showSuccessToast('Message sent successfully! I\'ll get back to you soon.');

            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorToast('Failed to send message. Please try again.');
        }
    }

    handleSearchSubmit(data, event) {
        // Build search criteria message
        const criteria = [];
        
        Object.entries(data).forEach(([key, value]) => {
            if (value && key !== 'sortBy') {
                const label = this.getFieldLabel(key);
                criteria.push(`${label}: ${value}`);
            }
        });

        // Pre-fill contact form
        const contactForm = this.forms.get('contact');
        const messageField = contactForm?.fields.get('message');
        
        if (messageField) {
            const message = criteria.length > 0 
                ? `Hi Marci, I'm interested in properties with the following criteria:\n\n${criteria.join('\n')}\n\nPlease send me some tailored listings. Thank you!`
                : `Hi Marci, I'm interested in finding a property in the Pahrump area. Please send me some listings that match my needs. Thank you!`;
            
            messageField.element.value = message;
        }

        // Scroll to contact section
        this.smoothScrollTo('#contact');
    }

    getFieldLabel(fieldName) {
        const labels = {
            location: 'Location',
            type: 'Property Type',
            bedrooms: 'Bedrooms',
            bathrooms: 'Bathrooms',
            minPrice: 'Min Price',
            maxPrice: 'Max Price'
        };
        
        return labels[fieldName] || fieldName;
    }

    resetForm(formName) {
        const form = this.forms.get(formName);
        if (!form) return;

        form.element.reset();
        
        // Clear all errors
        form.fields.forEach((field, fieldName) => {
            this.clearFieldError(formName, fieldName);
        });
    }

    showSuccessToast(message) {
        this.showToast(message, 'success');
    }

    showErrorToast(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('successToast') || this.createToast();
        const content = toast.querySelector('.toast-content span');
        
        if (content) {
            content.textContent = message;
        }
        
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    createToast() {
        const toast = document.createElement('div');
        toast.id = 'successToast';
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-check-circle"></i>
                <span></span>
            </div>
        `;
        document.body.appendChild(toast);
        return toast;
    }

    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (!element) return;

        const offsetTop = element.offsetTop - 80;
        
        window.scrollTo({
            top: Math.max(0, offsetTop),
            behavior: this.state.prefersReducedMotion ? 'auto' : 'smooth'
        });
    }

    // Simulate API call for demo purposes
    async simulateAPICall(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', data);
                resolve({ success: true });
            }, 1000);
        });
    }
}
