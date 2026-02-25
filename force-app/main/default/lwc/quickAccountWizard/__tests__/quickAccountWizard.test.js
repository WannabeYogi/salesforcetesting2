import { createElement } from 'lwc';
import QuickAccountWizard from 'c/quickAccountWizard';

jest.mock(
    '@salesforce/apex/QuickAccountController.createAccount',
    () => ({ default: jest.fn() }),
    { virtual: true }
);

describe('c-quick-account-wizard', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders the account form with title', () => {
        const element = createElement('c-quick-account-wizard', {
            is: QuickAccountWizard
        });
        document.body.appendChild(element);

        const card = element.shadowRoot.querySelector('lightning-card');
        expect(card).not.toBeNull();
        expect(card.title).toBe('New Enterprise Account');
    });

    it('renders input fields for account details', () => {
        const element = createElement('c-quick-account-wizard', {
            is: QuickAccountWizard
        });
        document.body.appendChild(element);

        const inputs = element.shadowRoot.querySelectorAll('lightning-input');
        expect(inputs.length).toBeGreaterThan(0);

        const nameInput = element.shadowRoot.querySelector('[data-id="accName"]');
        expect(nameInput).not.toBeNull();
    });

    it('renders the Save Account button', () => {
        const element = createElement('c-quick-account-wizard', {
            is: QuickAccountWizard
        });
        document.body.appendChild(element);

        const button = element.shadowRoot.querySelector('lightning-button');
        expect(button).not.toBeNull();
        expect(button.label).toBe('Save Account');
    });

    it('renders industry combobox with options', () => {
        const element = createElement('c-quick-account-wizard', {
            is: QuickAccountWizard
        });
        document.body.appendChild(element);

        const combos = element.shadowRoot.querySelectorAll('lightning-combobox');
        expect(combos.length).toBeGreaterThan(0);
    });

    it('renders device checkbox groups', () => {
        const element = createElement('c-quick-account-wizard', {
            is: QuickAccountWizard
        });
        document.body.appendChild(element);

        const checkboxGroups = element.shadowRoot.querySelectorAll('lightning-checkbox-group');
        expect(checkboxGroups.length).toBe(2);
    });
});
