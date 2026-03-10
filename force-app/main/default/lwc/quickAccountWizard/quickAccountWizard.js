import { LightningElement, track } from 'lwc';
import createAccount from '@salesforce/apex/QuickAccountController.createAccount';

export default class QuickAccountWizard extends LightningElement {
    @track successMessage = '';
    @track errorMessage = '';
    @track currentStep = '1';
    @track showSuccessState = false;
    @track selectedMacDevices = [];
    @track selectedWindowsDevices = [];
    @track formData = this.getInitialFormData();

    macDeviceOptions = [
        { label: 'MacBook Air', value: 'MacBook Air' },
        { label: 'MacBook Pro', value: 'MacBook Pro' },
        { label: 'iMac', value: 'iMac' },
        { label: 'Mac Mini', value: 'Mac Mini' },
        { label: 'Mac Studio', value: 'Mac Studio' },
        { label: 'Mac Pro', value: 'Mac Pro' }
    ];

    windowsDeviceOptions = [
        { label: 'Surface Pro', value: 'Surface Pro' },
        { label: 'Surface Laptop', value: 'Surface Laptop' },
        { label: 'Surface Studio', value: 'Surface Studio' },
        { label: 'Dell XPS', value: 'Dell XPS' },
        { label: 'HP EliteBook', value: 'HP EliteBook' },
        { label: 'Lenovo ThinkPad', value: 'Lenovo ThinkPad' }
    ];

    industryOptions = [
        { label: 'Technology', value: 'Technology' },
        { label: 'Healthcare', value: 'Healthcare' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Manufacturing', value: 'Manufacturing' },
        { label: 'Retail', value: 'Retail' },
        { label: 'Energy', value: 'Energy' },
        { label: 'Real Estate', value: 'Real Estate' },
        { label: 'Consulting', value: 'Consulting' },
        { label: 'Education', value: 'Education' },
        { label: 'Other', value: 'Other' }
    ];

    revenueRangeOptions = [
        { label: '< $1M', value: '< $1M' },
        { label: '$1M - $5M', value: '$1M - $5M' },
        { label: '$5M - $10M', value: '$5M - $10M' },
        { label: '$10M - $50M', value: '$10M - $50M' },
        { label: '$50M - $100M', value: '$50M - $100M' },
        { label: '$100M - $500M', value: '$100M - $500M' },
        { label: '$500M - $1B', value: '$500M - $1B' },
        { label: '> $1B', value: '> $1B' }
    ];

    accountTypeOptions = [
        { label: 'Prospect', value: 'Prospect' },
        { label: 'Customer - Direct', value: 'Customer - Direct' },
        { label: 'Customer - Channel', value: 'Customer - Channel' },
        { label: 'Partner', value: 'Partner' },
        { label: 'Reseller', value: 'Reseller' },
        { label: 'Investor', value: 'Investor' },
        { label: 'Vendor', value: 'Vendor' }
    ];

    getInitialFormData() {
        return {
            name: '',
            accNumber: '',
            phone: '',
            website: '',
            industry: '',
            revenue: '',
            revenueRange: '',
            employees: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
            type: '',
            ownership: ''
        };
    }

    get isStepOne() {
        return this.currentStep === '1';
    }

    get isStepTwo() {
        return this.currentStep === '2';
    }

    get isStepThree() {
        return this.currentStep === '3';
    }

    get isFirstStep() {
        return this.currentStep === '1';
    }

    get isLastStep() {
        return this.currentStep === '3';
    }

    get primaryButtonLabel() {
        return this.isLastStep ? 'Create Account' : 'Next';
    }

    get stepHeading() {
        if (this.isStepOne) {
            return 'Page 1: Basic Account Information';
        }

        if (this.isStepTwo) {
            return 'Page 2: Business and Billing Details';
        }

        return 'Page 3: Device Preferences and Review';
    }

    get stepDescription() {
        if (this.isStepOne) {
            return 'Start with the core account information.';
        }

        if (this.isStepTwo) {
            return 'Add business details and billing address information.';
        }

        return 'Review the data, choose devices, and submit the account.';
    }

    get macDevicesSummary() {
        return this.formData.macDevices || 'No Mac devices selected';
    }

    get windowsDevicesSummary() {
        return this.formData.windowsDevices || 'No Windows devices selected';
    }

    handleInputChange(event) {
        const fieldName = event.target.dataset.field;
        if (fieldName) {
            this.formData = {
                ...this.formData,
                [fieldName]: event.target.value
            };
        }
    }

    handleIndustryChange(event) {
        const updatedFormData = {
            ...this.formData,
            industry: event.detail.value
        };

        if (event.detail.value === 'Technology' || event.detail.value === 'Finance') {
            updatedFormData.type = 'Prospect';
        }

        this.formData = updatedFormData;
    }

    handleRevenueChange(event) {
        this.formData = {
            ...this.formData,
            revenue: event.target.value
        };
    }

    formatRevenue() {
        const revenueInput = this.template.querySelector('[data-field="revenue"]');
        if (!revenueInput || !revenueInput.value) {
            return;
        }

        const cleanValue = String(revenueInput.value).replace(/[^0-9.]/g, '');
        const numberValue = parseFloat(cleanValue);

        if (!isNaN(numberValue)) {
            const formattedValue = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(numberValue);

            revenueInput.value = formattedValue;
            this.formData = {
                ...this.formData,
                revenue: formattedValue
            };
        }
    }

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
        this.formData = {
            ...this.formData,
            phone
        };
    }

    handleMacDeviceChange(event) {
        this.selectedMacDevices = event.detail.value;
        this.formData = {
            ...this.formData,
            macDevices: this.selectedMacDevices.join('; ')
        };
    }

    handleWindowsDeviceChange(event) {
        this.selectedWindowsDevices = event.detail.value;
        this.formData = {
            ...this.formData,
            windowsDevices: this.selectedWindowsDevices.join('; ')
        };
    }

    handlePrevious() {
        this.errorMessage = '';
        const previousStep = Math.max(1, Number(this.currentStep) - 1);
        this.currentStep = String(previousStep);
    }

    handlePrimaryAction() {
        this.errorMessage = '';

        if (!this.validateCurrentStep()) {
            return;
        }

        if (this.isLastStep) {
            this.handleCreate();
            return;
        }

        this.currentStep = String(Number(this.currentStep) + 1);
    }

    validateCurrentStep() {
        const fields = this.template.querySelectorAll('lightning-input, lightning-combobox');
        return [...fields].reduce((isValid, field) => {
            field.reportValidity();
            return isValid && field.checkValidity();
        }, true);
    }

    handleCreate() {
        this.successMessage = '';
        this.errorMessage = '';

        const cleanRevenue = this.parseRevenueValue(this.formData.revenue);

        createAccount({
            name: this.formData.name,
            accNumber: this.formData.accNumber,
            phone: this.formData.phone,
            website: this.formData.website,
            industry: this.formData.industry,
            revenue: cleanRevenue,
            revenueRange: this.formData.revenueRange,
            employees: this.formData.employees ? Number(this.formData.employees) : null,
            city: this.formData.city,
            state: this.formData.state,
            postalCode: this.formData.postalCode,
            country: this.formData.country,
            type: this.formData.type,
            ownership: this.formData.ownership
        })
            .then((result) => {
                this.successMessage = `Account "${result.Name}" was created successfully after completing all 3 pages.`;
                this.showSuccessState = true;
            })
            .catch((error) => {
                this.errorMessage = 'Error: ' + (error.body ? error.body.message : error.message);
            });
    }

    handleStartOver() {
        this.successMessage = '';
        this.errorMessage = '';
        this.showSuccessState = false;
        this.currentStep = '1';
        this.selectedMacDevices = [];
        this.selectedWindowsDevices = [];
        this.formData = this.getInitialFormData();
    }

    parseRevenueValue(value) {
        if (!value) {
            return 0;
        }

        const cleanValue = String(value).replace(/[^0-9.]/g, '');
        const parsedValue = parseFloat(cleanValue);
        return isNaN(parsedValue) ? 0 : parsedValue;
    }
}