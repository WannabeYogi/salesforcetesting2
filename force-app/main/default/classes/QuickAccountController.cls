public with sharing class QuickAccountController {
    // UPDATED: Added 'Integer age' parameter
    @AuraEnabled
    public static Account createAccount(String name, String phone, Integer age) {
        try {
            Account newAcc = new Account(Name = name, Phone = phone);
            // In a real app, we would save age here, but for the demo, 
            // just accepting the parameter is enough.
            insert newAcc;
            return newAcc;
        } catch (Exception e) {
            throw new AuraHandledException('Error creating account: ' + e.getMessage());
        }
    }
}