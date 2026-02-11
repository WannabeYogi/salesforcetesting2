trigger AccountBeforeInsert on Account (before insert) {
    if (Trigger.isBefore && Trigger.isInsert) {
        DemoAccountTriggerHandler.handleBeforeInsert(Trigger.new);
    }
}