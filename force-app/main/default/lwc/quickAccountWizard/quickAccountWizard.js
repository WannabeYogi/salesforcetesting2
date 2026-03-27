import { LightningElement, track } from 'lwc';

import createAccount from '@salesforce/apex/QuickAccountController.createAccount';

export default class QuickAccountWizard extends LightningElement {
    @track successMessage = '';
    @track errorMessage = '';

    formData = {
        name: '',
        phone: '',
        website: '',
        industry: ''
    };

    handleInputChange(event) {
        const fieldMap = {
            'accName': 'name',
            'accPhone': 'phone',
            'accWebsite': 'website',
            'accIndustry': 'industry'
        };

        const fieldId = event.target.dataset.id;
        const key = fieldMap[fieldId];
        
        if (key) {
            this.formData[key] = event.target.value;
        }
    }

    // Auto-format phone number
    handlePhoneChange(event) {
        let phone = event.target.value.replace(/\D/g, '');
        if (phone.length > 0) {
            if (phone.length <= 3) {
                phone = `(${phone}`;
            } else if (phone.length <= 6) {
                phone = `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
            } else {
                phone = `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
            }
        }
        event.target.value = phone;
        this.formData.phone = phone;
    }

    handleCreate() {
        this.successMessage = '';
        this.errorMessage = '';

        const nameInput = this.template.querySelector('[data-id="accName"]');
        const phoneInput = this.template.querySelector('[data-id="accPhone"]');
        const websiteInput = this.template.querySelector('[data-id="accWebsite"]');
        const industryInput = this.template.querySelector('[data-id="accIndustry"]');
        
        let isValid = true;

        // Validate Account Name
        if (!this.formData.name) {
            nameInput.setCustomValidity("Account Name is required.");
            nameInput.reportValidity();
            isValid = false;
        } else {
            nameInput.setCustomValidity("");
            nameInput.reportValidity();
        }

        // Validate Phone
        if (!this.formData.phone) {
            phoneInput.setCustomValidity("Phone is required.");
            phoneInput.reportValidity();
            isValid = false;
        } else {
            phoneInput.setCustomValidity("");
            phoneInput.reportValidity();
        }

        // Validate Website
        if (!this.formData.website) {
            websiteInput.setCustomValidity("Website is required.");
            websiteInput.reportValidity();
            isValid = false;
        } else {
            websiteInput.setCustomValidity("");
            websiteInput.reportValidity();
        }

        // Validate Industry
        if (!this.formData.industry) {
            industryInput.setCustomValidity("Industry is required.");
            industryInput.reportValidity();
            isValid = false;
        } else {
            industryInput.setCustomValidity("");
            industryInput.reportValidity();
        }

        if (!isValid) {
            return;
        }

        createAccount({ 
            name: this.formData.name,
            phone: this.formData.phone,
            website: this.formData.website,
            industry: this.formData.industry
        })
        .then(result => {
            this.successMessage = `Account "${result.Name}" created successfully!`;
            this.template.querySelectorAll('lightning-input').forEach(input => {
                input.value = null;
            });
            this.formData = {
                name: '',
                phone: '',
                website: '',
                industry: ''
            }; 
        })
        .catch(error => {
            this.errorMessage = 'Error: ' + (error.body ? error.body.message : error.message);
        });
    }

    handleCancel() {
        // Clear all form data
        this.formData = {
            name: '',
            phone: '',
            website: '',
            industry: ''
        };
        
        // Clear all form fields
        this.template.querySelectorAll('lightning-input').forEach(input => {
            input.value = null;
        });
        
        // Clear messages
        this.successMessage = '';
        this.errorMessage = '';
    }
}