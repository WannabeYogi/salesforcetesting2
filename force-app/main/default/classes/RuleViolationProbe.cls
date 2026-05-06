public with sharing class RuleViolationProbe {
    public static String runViolationDemo() {
String apiKey = Org_Settings__mdt.getInstance('External_API_Key_Config')?.API_Key__c;
        System.debug('Using API key: ' + apiKey);
        return 'ok';
    }
}
