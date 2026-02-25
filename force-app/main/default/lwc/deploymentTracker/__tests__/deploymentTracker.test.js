import { createElement } from 'lwc';
import DeploymentTracker from 'c/deploymentTracker';

jest.mock(
    '@salesforce/apex/DemoAccountService.createDemoAccounts',
    () => ({ default: jest.fn() }),
    { virtual: true }
);

jest.mock(
    'lightning/platformShowToastEvent',
    () => ({ ShowToastEvent: jest.fn() }),
    { virtual: true }
);

describe('c-deployment-tracker', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders the CI/CD Monitor card', () => {
        const element = createElement('c-deployment-tracker', {
            is: DeploymentTracker
        });
        document.body.appendChild(element);

        const card = element.shadowRoot.querySelector('lightning-card');
        expect(card).not.toBeNull();
    });

    it('renders the Run Smoke Test button', () => {
        const element = createElement('c-deployment-tracker', {
            is: DeploymentTracker
        });
        document.body.appendChild(element);

        const button = element.shadowRoot.querySelector('lightning-button');
        expect(button).not.toBeNull();
        expect(button.label).toBe('Run Smoke Test');
    });

    it('renders pipeline progress bar at 100%', () => {
        const element = createElement('c-deployment-tracker', {
            is: DeploymentTracker
        });
        document.body.appendChild(element);

        const progressBar = element.shadowRoot.querySelector('lightning-progress-bar');
        expect(progressBar).not.toBeNull();
        expect(progressBar.value).toBe('100');
    });

    it('renders pipeline status items', () => {
        const element = createElement('c-deployment-tracker', {
            is: DeploymentTracker
        });
        document.body.appendChild(element);

        const items = element.shadowRoot.querySelectorAll('.slds-item');
        expect(items.length).toBe(3);
    });
});
