import { LightningElement, track } from 'lwc';
import createAccount from '@salesforce/apex/QuickAccountController.createAccount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class QuickAccountWizard extends LightningElement {
    @track message = '';

    handleCreate() {
        const nameInput = this.template.querySelector('[data-id="accName"]');
        const phoneInput = this.template.querySelector('[data-id="accPhone"]');
        const ageInput = this.template.querySelector('[data-id="accAge"]');
        
        const name = nameInput.value;
        const phone = phoneInput.value;
        const age = ageInput.value;

        if (!name) {
            nameInput.reportValidity();
            return;
        }

        // NEW LOGIC: Check if Phone is valid
        // The current test does NOT fill this, so this block will fire
        if (!phone) {
            phoneInput.setCustomValidity("Emergency Contact is MANDATORY for VIP Accounts!");
            phoneInput.reportValidity();
            return; // Stop execution (Test will time out waiting for success)
        }
        // --- CHANGE END ---
        if (!age) {
            ageInput.setCustomValidity("Age is required for insurance purposes!");
            ageInput.reportValidity();
            return; // STOP HERE -> This will cause the test to fail
        } else {
            ageInput.setCustomValidity(""); 
            ageInput.reportValidity();
        }

        createAccount({ name: name, phone: phone ,age: parseInt(age)})
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
                ageInput.value = '';
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