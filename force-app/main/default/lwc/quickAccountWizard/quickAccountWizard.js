import { LightningElement, track } from 'lwc';

import createSimpleAccount from '@salesforce/apex/QuickAccountController.createSimpleAccount';

export default class QuickAccountWizard extends LightningElement {
    @track successMessage = '';
    @track errorMessage = '';
    @track currentPage = 1;

    formData = {
        name: '',
        type: '',
        description: '',
        phone: '',
        website: '',
        email: '',
        industry: '',
        revenue: '',
        employees: '',
        billingStreet: '',
        billingCity: '',
        billingState: '',
        billingPostalCode: '',
        billingCountry: ''
    };

    // Account type options
    typeOptions = [
        { label: 'Prospect', value: 'Prospect' },
        { label: 'Customer - Direct', value: 'Customer - Direct' },
        { label: 'Customer - Channel', value: 'Customer - Channel' },
        { label: 'Channel Partner / Reseller', value: 'Channel Partner / Reseller' },
        { label: 'Technology Partner', value: 'Technology Partner' },
        { label: 'Other', value: 'Other' }
    ];

    // Industry options
    industryOptions = [
        { label: 'Agriculture', value: 'Agriculture' },
        { label: 'Apparel', value: 'Apparel' },
        { label: 'Banking', value: 'Banking' },
        { label: 'Biotechnology', value: 'Biotechnology' },
        { label: 'Chemicals', value: 'Chemicals' },
        { label: 'Communications', value: 'Communications' },
        { label: 'Construction', value: 'Construction' },
        { label: 'Consulting', value: 'Consulting' },
        { label: 'Education', value: 'Education' },
        { label: 'Electronics', value: 'Electronics' },
        { label: 'Energy', value: 'Energy' },
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Entertainment', value: 'Entertainment' },
        { label: 'Environmental', value: 'Environmental' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Food & Beverage', value: 'Food & Beverage' },
        { label: 'Government', value: 'Government' },
        { label: 'Healthcare', value: 'Healthcare' },
        { label: 'Hospitality', value: 'Hospitality' },
        { label: 'Insurance', value: 'Insurance' },
        { label: 'Machinery', value: 'Machinery' },
        { label: 'Manufacturing', value: 'Manufacturing' },
        { label: 'Media', value: 'Media' },
        { label: 'Not For Profit', value: 'Not For Profit' },
        { label: 'Recreation', value: 'Recreation' },
        { label: 'Retail', value: 'Retail' },
        { label: 'Shipping', value: 'Shipping' },
        { label: 'Technology', value: 'Technology' },
        { label: 'Telecommunications', value: 'Telecommunications' },
        { label: 'Transportation', value: 'Transportation' },
        { label: 'Utilities', value: 'Utilities' },
        { label: 'Other', value: 'Other' }
    ];

    // Computed properties for page navigation
    get isPage1() {
        return this.currentPage === 1;
    }

    get isPage2() {
        return this.currentPage === 2;
    }

    get isPage3() {
        return this.currentPage === 3;
    }

    get isPage4() {
        return this.currentPage === 4;
    }

    get showPrevious() {
        return this.currentPage > 1;
    }

    get showNext() {
        return this.currentPage < 4;
    }

    get showSubmit() {
        return this.currentPage === 4;
    }

    handleInputChange(event) {
        const fieldMap = {
            'accName': 'name',
            'accPhone': 'phone',
            'accWebsite': 'website',
            'accIndustry': 'industry',
            'accType': 'type',
            'accDescription': 'description',
            'accEmail': 'email',
            'accRevenue': 'revenue',
            'accEmployees': 'employees',
            'accBillingStreet': 'billingStreet',
            'accBillingCity': 'billingCity',
            'accBillingState': 'billingState',
            'accBillingPostalCode': 'billingPostalCode',
            'accBillingCountry': 'billingCountry'
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

    handleNext() {
        if (this.validateCurrentPage()) {
            this.currentPage++;
        }
    }

    handlePrevious() {
        this.currentPage--;
    }

    validateCurrentPage() {
        let isValid = true;
        
        if (this.currentPage === 1) {
            // Validate Basic Information
            const nameInput = this.template.querySelector('[data-id="accName"]');
            const typeInput = this.template.querySelector('[data-id="accType"]');
            
            if (!this.formData.name) {
                nameInput.setCustomValidity("Account Name is required.");
                nameInput.reportValidity();
                isValid = false;
            } else {
                nameInput.setCustomValidity("");
                nameInput.reportValidity();
            }

            if (!this.formData.type) {
                typeInput.setCustomValidity("Account Type is required.");
                typeInput.reportValidity();
                isValid = false;
            } else {
                typeInput.setCustomValidity("");
                typeInput.reportValidity();
            }
        } else if (this.currentPage === 2) {
            // Validate Contact Details
            const phoneInput = this.template.querySelector('[data-id="accPhone"]');
            const websiteInput = this.template.querySelector('[data-id="accWebsite"]');
            
            if (!this.formData.phone) {
                phoneInput.setCustomValidity("Phone is required.");
                phoneInput.reportValidity();
                isValid = false;
            } else {
                phoneInput.setCustomValidity("");
                phoneInput.reportValidity();
            }

            if (!this.formData.website) {
                websiteInput.setCustomValidity("Website is required.");
                websiteInput.reportValidity();
                isValid = false;
            } else {
                websiteInput.setCustomValidity("");
                websiteInput.reportValidity();
            }
        } else if (this.currentPage === 3) {
            // Validate Business Details
            const industryInput = this.template.querySelector('[data-id="accIndustry"]');
            
            if (!this.formData.industry) {
                industryInput.setCustomValidity("Industry is required.");
                industryInput.reportValidity();
                isValid = false;
            } else {
                industryInput.setCustomValidity("");
                industryInput.reportValidity();
            }
        }
        
        return isValid;
    }

    handleCreate() {
        this.successMessage = '';
        this.errorMessage = '';

        // Final validation of all required fields
        if (!this.validateCurrentPage()) {
            return;
        }

        createSimpleAccount({ 
            name: this.formData.name,
            phone: this.formData.phone,
            website: this.formData.website,
            industry: this.formData.industry
        })
        .then(result => {
            this.successMessage = `Account "${result.Name}" created successfully!`;
            this.resetForm();
        })
        .catch(error => {
            this.errorMessage = 'Error: ' + (error.body ? error.body.message : error.message);
        });
    }

    handleCancel() {
        this.resetForm();
    }

    resetForm() {
        // Clear all form data
        this.formData = {
            name: '',
            type: '',
            description: '',
            phone: '',
            website: '',
            email: '',
            industry: '',
            revenue: '',
            employees: '',
            billingStreet: '',
            billingCity: '',
            billingState: '',
            billingPostalCode: '',
            billingCountry: ''
        };
        
        // Clear all form fields
        this.template.querySelectorAll('lightning-input, lightning-combobox').forEach(input => {
            input.value = null;
        });
        
        // Reset to first page
        this.currentPage = 1;
        
        // Clear messages
        this.successMessage = '';
        this.errorMessage = '';
    }
}