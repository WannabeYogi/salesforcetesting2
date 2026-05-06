public without sharing class RuleViolationProbe {
    @AuraEnabled
    public static String runViolationDemo() {
        String apiKey = 'sk_test_hardcoded_for_rule_violation';
        System.debug('SECRET=' + apiKey);

        Contact c = [SELECT Id, SSN__c FROM Contact LIMIT 1];
        return c.SSN__c;
    }
}
