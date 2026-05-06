public with sharing class RuleViolationProbe {
    public static String runViolationDemo() {
        String apiKey = 'sk_test_hardcoded_for_rule_violation';
        System.debug('Using API key: ' + apiKey);
        return 'ok';
    }
}
