import { LightningElement, track } from 'lwc';

import createAccount from '@salesforce/apex/QuickAccountController.createAccount';

export default class QuickAccountWizard extends LightningElement {
    @track successMessage = '';
    @track errorMessage = '';

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
        marketCap: '',
        locations: null,
        fiscalYear: '',
        accountCurrency: '',
        stockExchange: '',
        dunsNumber: '',
        naicsCode: '',
        source: '',
        campaign: '',
        leadSource: '',
        lastActivityDate: '',
        nextActivityDate: '',
        activityType: '',
        activityDescription: ''
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
            'accYearStarted': 'yearStarted',
            'accMarketCap': 'marketCap',
            'accLocations': 'locations',
            'accFiscalYear': 'fiscalYear',
            'accCurrency': 'accountCurrency',
            'accStockExchange': 'stockExchange',
            'accDunsNumber': 'dunsNumber',
            'accNaicsCode': 'naicsCode',
            'accSource': 'source',
            'accCampaign': 'campaign',
            'accLeadSource': 'leadSource',
            'accLastActivityDate': 'lastActivityDate',
            'accNextActivityDate': 'nextActivityDate',
            'accActivityType': 'activityType',
            'accActivityDescription': 'activityDescription'
        };

        const fieldId = event.target.dataset.id;
        const key = fieldMap[fieldId];
        
        if (key) {
            this.formData[key] = event.target.value;
        }
    }

    handleCreate() {
        this.successMessage = '';
        this.errorMessage = '';

        const nameInput = this.template.querySelector('[data-id="accName"]');
        if (!this.formData.name) {
            nameInput.setCustomValidity("Account Name is required.");
            nameInput.reportValidity();
            return;
        } else {
            nameInput.setCustomValidity("");
            nameInput.reportValidity();
        }

        // Clean Revenue Logic
        let cleanRevenue = 0;
        if (this.formData.revenue) {
            const stringVal = String(this.formData.revenue).replace(/[^0-9.]/g, '');
            cleanRevenue = parseFloat(stringVal);
        }

        createAccount({ data: this.formData })
        .then(result => {
            this.successMessage = `Account "${result.Name}" created successfully!`;
            this.template.querySelectorAll('lightning-input, lightning-combobox').forEach(input => {
                input.value = null;
            });
            this.formData = {}; 
        })
        .catch(error => {
            this.errorMessage = 'Error: ' + (error.body ? error.body.message : error.message);
        });
    }
}