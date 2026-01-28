public with sharing class DemoAccountService {
    public static void createDemoAccounts(Integer countToCreate) {
        if (countToCreate == null || countToCreate <= 0) {
            return;
        }

        /* [BRANCH CHANGE] This comment is specific to feature/contact-logic */
        List<Account> accounts = new List<Account>();
        
        for (Integer i = 0; i < countToCreate; i++) {
            accounts.add(new Account(
                Name = 'Demo Account ' + String.valueOf(i + 1)
            ));
        }
        insert accounts;

        // --- NEW DEPENDENCY ADDED IN THIS BRANCH ---
        // This line creates a graph edge: DemoAccountService -> USES -> DemoContactService
        DemoContactService.createRelatedContacts(accounts); 
    }
}