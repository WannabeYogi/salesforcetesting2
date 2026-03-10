import { LightningElement, track } from 'lwc';

import createAccount from '@salesforce/apex/QuickAccountController.createAccount';

export default class QuickAccountWizard extends LightningElement {
    @track successMessage = '';
    @track errorMessage = '';
    @track isVipAccount = false;

    // Checkbox device options
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

    @track selectedMacDevices = [];
    @track selectedWindowsDevices = [];

    // Dropdown options
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

    formData = {
        name: '',
        accNumber: '',
        phone: '',
        website: '',
        industry: '',
        revenue: '', 
        revenueRange: '',
        employees: null,
        city: '',
        state: '',
        postalCode: '',
        country: '',
        type: '',
        source: '',
        description: '',
        primaryContact: '',
        contactTitle: '',
        contactEmail: '',
        contactPhone: '',
        fax: '',
        rating: '',
        customerPriority: '',
        slaExpiration: '',
        ticker: '',
        ownership: '',
        sicCode: '',
        yearStarted: '',
        macDevices: '',
        windowsDevices: ''
    };

    // REMOVED: get industryOptions() {...} is no longer needed

    handleInputChange(event) {
        const fieldMap = {
            'accName': 'name',
            'accNumber': 'accNumber',
            'accPhone': 'phone',
            'accWebsite': 'website',
            'accIndustry': 'industry',
            'accRevenue': 'revenue',
            'accRevenueRange': 'revenueRange',
            'accEmployees': 'employees',
            'accCity': 'city',
            'accState': 'state',
            'accPostalCode': 'postalCode',
            'accCountry': 'country',
            'accType': 'type',
            'accSource': 'source',
            'accDescription': 'description',
            'accPrimaryContact': 'primaryContact',
            'accContactTitle': 'contactTitle',
            'accContactEmail': 'contactEmail',
            'accContactPhone': 'contactPhone',
            'accFax': 'fax',
            'accRating': 'rating',
            'accCustomerPriority': 'customerPriority',
            'accSlaExpiration': 'slaExpiration',
            'accTicker': 'ticker',
            'accOwnership': 'ownership',
            'accSicCode': 'sicCode',
            'accYearStarted': 'yearStarted'
        };

        const fieldId = event.target.dataset.id;
        const key = fieldMap[fieldId];
        
        if (key) {
            this.formData[key] = event.target.value;
        }
    }

    // Enhanced handlers for new features
    handleIndustryChange(event) {
        this.formData.industry = event.detail.value;
        
        // Auto-populate account type based on industry
        if (event.detail.value === 'Technology' || event.detail.value === 'Finance') {
            this.formData.type = 'Prospect';
            const typeCombo = this.template.querySelector('lightning-combobox[name="accountType"]');
            if (typeCombo) {
                typeCombo.value = 'Prospect';
            }
        }
    }

    handleRevenueChange(event) {
        this.formData.revenue = event.target.value;
    }

    formatRevenue() {
        const revenueInput = this.template.querySelector('[data-id="accRevenue"]');
        if (revenueInput && revenueInput.value) {
            const cleanValue = String(revenueInput.value).replace(/[^0-9.]/g, '');
            const numberValue = parseFloat(cleanValue);
            if (!isNaN(numberValue)) {
                revenueInput.value = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(numberValue);
            }
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

    // Checkbox handlers for devices
    handleMacDeviceChange(event) {
        this.selectedMacDevices = event.detail.value;
        this.formData.macDevices = this.selectedMacDevices.join('; ');
    }

    handleWindowsDeviceChange(event) {
        this.selectedWindowsDevices = event.detail.value;
        this.formData.windowsDevices = this.selectedWindowsDevices.join('; ');
    }

    handleVipChange(event) {
        this.isVipAccount = event.target.checked;
        if (this.isVipAccount) {
            this.formData.customerPriority = 'High';
            this.formData.rating = 'Hot';
        }
    }

    handleCreate() {
        this.successMessage = '';
        this.errorMessage = '';

        const nameInput = this.template.querySelector('[data-id="accName"]');
        const websiteInput = this.template.querySelector('[data-id="accWebsite"]');
        
        if (!this.formData.name) {
            nameInput.setCustomValidity("Account Name is required.");
            nameInput.reportValidity();
            return;
        } else {
            nameInput.setCustomValidity("");
            nameInput.reportValidity();
        }

        // Business rule: If Annual Revenue > 5,000,000, Website is mandatory
        let cleanRevenue = 0;
        if (this.formData.revenue) {
            const stringVal = String(this.formData.revenue).replace(/[^0-9.]/g, '');
            cleanRevenue = parseFloat(stringVal);
        }

        // if (cleanRevenue > 5000000 && !this.formData.website) {
        //     this.errorMessage = 'Website is required for accounts with Annual Revenue greater than $5,000,000.';
        //     websiteInput.setCustomValidity('Website is required for high-value accounts.');
        //     websiteInput.reportValidity();
        //     return;
        // } else {
        //     websiteInput.setCustomValidity('');
        //     websiteInput.reportValidity();
        // }

        createAccount({ 
            name: this.formData.name,
            accNumber: this.formData.accNumber,
            phone: this.formData.phone,
            website: this.formData.website,
            industry: this.formData.industry,
            revenue: cleanRevenue,
            revenueRange: this.formData.revenueRange,
            employees: this.formData.employees,
            city: this.formData.city,
            state: this.formData.state,
            postalCode: this.formData.postalCode,
            country: this.formData.country,
            type: this.formData.type,
            source: this.formData.source,
            description: this.formData.description,
            primaryContact: this.formData.primaryContact,
            contactTitle: this.formData.contactTitle,
            contactEmail: this.formData.contactEmail,
            contactPhone: this.formData.contactPhone,
            fax: this.formData.fax,
            rating: this.formData.rating,
            customerPriority: this.formData.customerPriority,
            slaExpiration: this.formData.slaExpiration,
            ticker: this.formData.ticker,
            ownership: this.formData.ownership,
            sicCode: this.formData.sicCode,
            yearStarted: this.formData.yearStarted,
            macDevices: this.formData.macDevices,
            windowsDevices: this.formData.windowsDevices
        })
        .then(result => {
            this.successMessage = `Account "${result.Name}" created successfully!`;
            this.template.querySelectorAll('lightning-input, lightning-combobox, lightning-checkbox-group').forEach(input => {
                input.value = null;
            });
            this.selectedMacDevices = [];
            this.selectedWindowsDevices = [];
            this.formData = {}; 
        })
        .catch(error => {
            this.errorMessage = 'Error: ' + (error.body ? error.body.message : error.message);
        });
    }
}