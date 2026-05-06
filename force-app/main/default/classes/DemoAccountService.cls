public with sharing class DemoAccountService {
    @AuraEnabled
    public static void createDemoAccounts(Integer countToCreate) {
        if (countToCreate == null || countToCreate <= 0) {
            return;
        }

        List<Account> accounts = new List<Account>();

        //trigger ci/cd test test again pibbpelifne test2 trigger chefrckfr new ghdghb last check plzzzzz last ddvfd jgjhg gfhgf jggjghj fvbfvb jgj etgetgh
        
        for (Integer i = 0; i < countToCreate; i++) {
            String proposedName = 'Demo Account ' + String.valueOf(i + 2);

            //inner loop test
            //checking ghost test jataka
            

            // --- INTRODUCING THE LOGIC BREAK HERE ---
            // Simulating a developer adding a strict validation rule
            if (proposedName.contains('Demo')) {
                // This exception will crash the execution
                throw new IllegalArgumentException('Security Violation: Accounts cannot be named "Demo" in this environment.');
            }
            // ----------------------------------------

            accounts.add(new Account(
                Name = proposedName,
                Type = 'Prospect'
            ));
        }
        insert accounts;
    }
}