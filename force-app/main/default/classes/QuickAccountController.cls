public with sharing class QuickAccountController {
    /**
     * AuraHandledException only surfaces its message to LWC/Aura clients when setMessage() is called.
     * Without it, the client shows a generic "Script-thrown exception".
     */
    /**
     * Apex does not treat a void call as always throwing; callers append `return null` so the outer
     * method satisfies return type Account. At runtime throw e runs first, so that return never executes.
     */
    private static void throwAuraMessage(String message) {
        String safe = String.isNotBlank(message) ? message : 'An unexpected error occurred.';
        AuraHandledException e = new AuraHandledException(safe);
        e.setMessage(safe);
        throw e;
    }

    /** Default country only — no state/address from the wizard (avoids picklist/trigger conflicts). */
    private static void applyDefaultBillingCountryOnly(Account acc) {
        Schema.DescribeFieldResult codeDesc = Account.BillingCountryCode.getDescribe();
        if (codeDesc != null && codeDesc.isCreateable() && codeDesc.getType() == Schema.DisplayType.Picklist) {
            acc.BillingCountryCode = 'US';
            return;
        }
        Schema.DescribeFieldResult textDesc = Account.BillingCountry.getDescribe();
        if (textDesc != null && textDesc.isCreateable()) {
            acc.BillingCountry = 'United States';
        }
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
            }
            throwAuraMessage('Error: ' + sr.getErrors()[0].getMessage());
            return null;

        } catch (AuraHandledException e) {
            throw e;
        } catch (DmlException e) {
            throwAuraMessage(e.getDmlMessage(0));
            return null;
        } catch (Exception e) {
            throwAuraMessage(e.getMessage());
            return null;
        }
    }

    @AuraEnabled
    public static Account createSimpleAccount(String name, String phone, String website, String industry) {
        try {
            Database.DMLOptions dml = new Database.DMLOptions();
            dml.DuplicateRuleHeader.allowSave = true;
            dml.DuplicateRuleHeader.runAsCurrentUser = true;

            Account full = new Account(Name = name);
            if (String.isNotBlank(phone)) {
                full.Phone = phone;
            }
            if (String.isNotBlank(website)) {
                full.Website = website;
            }
            if (String.isNotBlank(industry)) {
                full.Industry = industry;
            }
            applyDefaultBillingCountryOnly(full);

            Account phoneOnly = new Account(Name = name);
            if (String.isNotBlank(phone)) {
                phoneOnly.Phone = phone;
            }
            applyDefaultBillingCountryOnly(phoneOnly);

            Account countryOnly = new Account(Name = name);
            applyDefaultBillingCountryOnly(countryOnly);

            Account nameOnly = new Account(Name = name);

            Account[] attempts = new List<Account>{ full, phoneOnly, countryOnly, nameOnly };
            Database.SaveResult lastSr;

            for (Account candidate : attempts) {
                lastSr = Database.insert(candidate, dml);
                if (lastSr.isSuccess()) {
                    return candidate;
                }
            }

            throwAuraMessage('Error: ' + lastSr.getErrors()[0].getMessage());
            return null;
        } catch (AuraHandledException e) {
            throw e;
        } catch (DmlException e) {
            throwAuraMessage(e.getDmlMessage(0));
            return null;
        } catch (Exception e) {
            throwAuraMessage(e.getMessage());
            return null;
        }
    }
}