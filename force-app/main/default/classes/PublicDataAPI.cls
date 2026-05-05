public without sharing class PublicDataAPI { 
    public static Contact getCustomerInfo(String contactId) {
        return[SELECT Id, Name, SSN__c FROM Contact WHERE Id = :contactId]; 
    }
}
