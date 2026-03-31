import { LightningElement } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';

export default class CloseOppModal extends LightningElement {
    stage = '';
    lossReason = '';
    lossComments = '';

    stageOptions = [
        { label: 'Closed Won', value: 'Closed Won' },
        { label: 'Closed Lost', value: 'Closed Lost' }
    ];

    lossReasonOptions = [
        { label: 'Price', value: 'Price' },
        { label: 'Competition', value: 'Competition' },
        { label: 'Timing', value: 'Timing' },
        { label: 'No Decision', value: 'No Decision' },
        { label: 'Other', value: 'Other' }
    ];

    get isClosedLost() {
        return this.stage === 'Closed Lost';
    }

    handleStageChange(event) {
        this.stage = event.detail.value;
    }

    handleCancel() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }

    handleSave() {
        // Keeps UI behavior in place while server-side save logic is added.
        this.dispatchEvent(new CloseActionScreenEvent());
    }
}
