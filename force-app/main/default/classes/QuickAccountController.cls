public with sharing class QuickAccountController {
    /**
     * AuraHandledException only surfaces its message to LWC/Aura clients when setMessage() is called.
     * Without it, the client shows a generic "Script-thrown exception".
     */
    private static void throwAuraMessage(String message) {
        String safe = String.isNotBlank(message) ? message : 'An unexpected error occurred.';
        AuraHandledException e = new AuraHandledException(safe);
        e.setMessage(safe);
        throw e;
    }

    @AuraEnabled
    public static Account createAccount(
        String name, 
        String accNumber, 
        String phone, 
        String website, 
        String industry, 
        Decimal revenue,
        String revenueRange,
        Integer employees, 
        String city,
        String state,
        String postalCode,
        String country,
        String type,
        String description,
        String primaryContact,
        String contactTitle,
        String contactEmail,
        String contactPhone,
        String fax,
        String rating,
        String customerPriority,
        String slaExpiration,
        String ticker,
        String ownership,
        String sicCode,
        String yearStarted
    ) {
        try {
            //testing functionality
            // --- NEW BUSINESS LOGIC ---
            // Requirement: Enterprise accounts must have > $10M Revenue
            
            // --- NOTE: Some fields are stored in description for demo purposes ---
            // In a real implementation, you would create custom fields for:
            // - Revenue Range
            // - Primary Contact Information
            // - Customer Priority
            // - SLA Expiration Date
            
            // Combine additional information into description
            String fullDescription = description;
            if (String.isNotBlank(primaryContact)) {
                fullDescription += '\n\nPrimary Contact: ' + primaryContact;
                if (String.isNotBlank(contactTitle)) {
                    fullDescription += ' (' + contactTitle + ')';
                }
                if (String.isNotBlank(contactEmail)) {
                    fullDescription += '\nEmail: ' + contactEmail;
                }
                if (String.isNotBlank(contactPhone)) {
                    fullDescription += '\nPhone: ' + contactPhone;
                }
            }
            if (String.isNotBlank(revenueRange)) {
                fullDescription += '\n\nRevenue Range: ' + revenueRange;
            }
            if (String.isNotBlank(customerPriority)) {
                fullDescription += '\nCustomer Priority: ' + customerPriority;
            }
            if (String.isNotBlank(slaExpiration)) {
                fullDescription += '\nSLA Expiration: ' + slaExpiration;
            }

            Account newAcc = new Account(
                Name = name,
                AccountNumber = accNumber,
                Phone = phone,
                Website = website,
                Industry = industry,
                AnnualRevenue = revenue,
                NumberOfEmployees = employees,
                BillingCity = city,
                BillingState = state,
                BillingPostalCode = postalCode,
                BillingCountry = country,
                Type = type,
                Description = fullDescription,
                Fax = fax,
                Rating = rating,
                // Commented out custom fields - create these in your org if needed
                // CustomerPriority__c = customerPriority,
                // SLAExpirationDate__c = slaExpiration != null ? Date.valueOf(slaExpiration) : null,
                TickerSymbol = ticker,
                Ownership = ownership,
                Sic = sicCode != null ? sicCode : null,
                YearStarted = yearStarted
            );
            
            // Allow duplicates for demo purposes
            Database.DMLOptions dml = new Database.DMLOptions();
            dml.DuplicateRuleHeader.allowSave = true; 
            dml.DuplicateRuleHeader.runAsCurrentUser = true;
            
            Database.SaveResult sr = Database.insert(newAcc, dml);
            
            if (sr.isSuccess()) {
                return newAcc;
            } else {
                throwAuraMessage('Error: ' + sr.getErrors()[0].getMessage());
            }

        } catch (AuraHandledException e) {
            throw e;
        } catch (DmlException e) {
            throwAuraMessage(e.getDmlMessage(0));
        } catch (Exception e) {
            throwAuraMessage(e.getMessage());
        }
    }

    @AuraEnabled
    public static Account createSimpleAccount(
        String name,
        String phone,
        String website,
        String industry
    ) {
        try {
            Account newAcc = new Account(
                Name = name,
                Phone = phone,
                Website = website,
                Industry = industry
            );
            
            // Allow duplicates for demo purposes
            Database.DMLOptions dml = new Database.DMLOptions();
            dml.DuplicateRuleHeader.allowSave = true; 
            dml.DuplicateRuleHeader.runAsCurrentUser = true;
            
            Database.SaveResult sr = Database.insert(newAcc, dml);
            
            if (sr.isSuccess()) {
                return newAcc;
            } else {
                throwAuraMessage('Error: ' + sr.getErrors()[0].getMessage());
            }

        } catch (AuraHandledException e) {
            throw e;
        } catch (DmlException e) {
            throwAuraMessage(e.getDmlMessage(0));
        } catch (Exception e) {
            throwAuraMessage(e.getMessage());
        }
    }
}