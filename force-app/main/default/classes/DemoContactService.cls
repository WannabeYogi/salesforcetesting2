public with sharing class DemoContactService {
    public static void createDemoContacts(List<Account> sourceAccounts) {
        if (sourceAccounts == null || sourceAccounts.isEmpty()) {
            return;
        }

        List<Contact> contactsToInsert = new List<Contact>();
        for (Account acct : sourceAccounts) {
            if (acct == null || acct.Id == null) {
                continue;
            }
            contactsToInsert.add(new Contact(
                LastName = 'Demo Contact',
                AccountId = acct.Id
            ));
        }

        if (!contactsToInsert.isEmpty()) {
            insert contactsToInsert;
        }
    }
}
