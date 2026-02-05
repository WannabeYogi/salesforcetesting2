import { LightningElement, track } from 'lwc';
import createAccount from '@salesforce/apex/QuickAccountController.createAccount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class QuickAccountWizard extends LightningElement {
    @track message = '';

    handleCreate() {
        const nameInput = this.template.querySelector('[data-id="accName"]');
        const phoneInput = this.template.querySelector('[data-id="accPhone"]');
        
        const name = nameInput.value;
        const phone = phoneInput.value;

        if (!name) {
            nameInput.reportValidity();
            return;
        }

        createAccount({ name: name, phone: phone })
            .then(result => {
                this.message = `Success! Created account: ${result.Name}`;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Account created successfully!',
                        variant: 'success'
                    })
                );
                // Clear inputs
                nameInput.value = '';
                phoneInput.value = '';
            })
            .catch(error => {
                this.message = 'Error creating account';
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
}