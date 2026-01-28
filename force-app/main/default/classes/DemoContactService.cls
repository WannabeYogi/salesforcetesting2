public with sharing class DemoContactService {
    // This class only exists in the 'feature/contact-logic' branch
    public static void createRelatedContacts(List<Account> accounts) {
        List<Contact> newContacts = new List<Contact>();

        for(Account acc : accounts) {
            newContacts.add(new Contact(
                FirstName = 'Test',
                LastName = 'User',
                AccountId = acc.Id
            ));
        }

        if(!newContacts.isEmpty()) {
            insert newContacts;
        }
    }
}