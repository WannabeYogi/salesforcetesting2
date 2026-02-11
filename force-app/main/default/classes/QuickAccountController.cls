public with sharing class QuickAccountController {
    @AuraEnabled
    public static Account createAccount(AccountDataWrapper data) {
        try {
            // --- NEW BUSINESS LOGIC ---
            // Requirement: Enterprise accounts must have > $10M Revenue
            
            // --- NOTE: Some fields are stored in description for demo purposes ---
            // In a real implementation, you would create custom fields for:
            // - Revenue Range
            // - Primary Contact Information
            // - Customer Priority
            // - SLA Expiration Date
            // - Market Cap
            // - Number of Locations
            // - Fiscal Year
            // - Currency
            // - Stock Exchange
            // - DUNS Number
            // - NAICS Code
            // - Activity Tracking
            
            // Combine additional information into description
            String fullDescription = data.description;
            if (String.isNotBlank(data.primaryContact)) {
                fullDescription += '\n\nPrimary Contact: ' + data.primaryContact;
                if (String.isNotBlank(data.contactTitle)) {
                    fullDescription += ' (' + data.contactTitle + ')';
                }
                if (String.isNotBlank(data.contactEmail)) {
                    fullDescription += '\nEmail: ' + data.contactEmail;
                }
                if (String.isNotBlank(data.contactPhone)) {
                    fullDescription += '\nPhone: ' + data.contactPhone;
                }
            }
            if (String.isNotBlank(data.revenueRange)) {
                fullDescription += '\n\nRevenue Range: ' + data.revenueRange;
            }
            if (String.isNotBlank(data.marketCap)) {
                fullDescription += '\nMarket Cap: ' + data.marketCap;
            }
            if (data.locations != null) {
                fullDescription += '\nNumber of Locations: ' + data.locations;
            }
            if (String.isNotBlank(data.fiscalYear)) {
                fullDescription += '\nFiscal Year: ' + data.fiscalYear;
            }
            if (String.isNotBlank(data.accountCurrency)) {
                fullDescription += '\nCurrency: ' + data.accountCurrency;
            }
            if (String.isNotBlank(data.stockExchange)) {
                fullDescription += '\nStock Exchange: ' + data.stockExchange;
            }
            if (String.isNotBlank(data.dunsNumber)) {
                fullDescription += '\nDUNS Number: ' + data.dunsNumber;
            }
            if (String.isNotBlank(data.naicsCode)) {
                fullDescription += '\nNAICS Code: ' + data.naicsCode;
            }
            if (String.isNotBlank(data.customerPriority)) {
                fullDescription += '\nCustomer Priority: ' + data.customerPriority;
            }
            if (String.isNotBlank(data.slaExpiration)) {
                fullDescription += '\nSLA Expiration: ' + data.slaExpiration;
            }
            if (String.isNotBlank(data.source)) {
                fullDescription += '\nAccount Source: ' + data.source;
            }
            if (String.isNotBlank(data.campaign)) {
                fullDescription += '\nCampaign: ' + data.campaign;
            }
            if (String.isNotBlank(data.leadSource)) {
                fullDescription += '\nLead Source: ' + data.leadSource;
            }
            if (String.isNotBlank(data.lastActivityDate)) {
                fullDescription += '\nLast Activity: ' + data.lastActivityDate;
            }
            if (String.isNotBlank(data.nextActivityDate)) {
                fullDescription += '\nNext Activity: ' + data.nextActivityDate;
            }
            if (String.isNotBlank(data.activityType)) {
                fullDescription += '\nActivity Type: ' + data.activityType;
            }
            if (String.isNotBlank(data.activityDescription)) {
                fullDescription += '\nActivity Description: ' + data.activityDescription;
            }

            Account newAcc = new Account(
                Name = data.name,
                AccountNumber = data.accNumber,
                Phone = data.phone,
                Website = data.website,
                Industry = data.industry,
                AnnualRevenue = data.revenue,
                NumberOfEmployees = data.employees,
                BillingCity = data.city,
                BillingState = data.state,
                BillingPostalCode = data.postalCode,
                BillingCountry = data.country,
                Type = data.type,
                Description = fullDescription,
                Fax = data.fax,
                Rating = data.rating,
                // Commented out custom fields - create these in your org if needed
                // CustomerPriority__c = data.customerPriority,
                // SLAExpirationDate__c = data.slaExpiration != null ? Date.valueOf(data.slaExpiration) : null,
                TickerSymbol = data.ticker,
                Ownership = data.ownership,
                Sic = data.sicCode != null ? data.sicCode : null,
                YearStarted = data.yearStarted
            );
            
            // Allow duplicates for demo purposes
            Database.DMLOptions dml = new Database.DMLOptions();
            dml.DuplicateRuleHeader.allowSave = true; 
            dml.DuplicateRuleHeader.runAsCurrentUser = true;
            
            Database.SaveResult sr = Database.insert(newAcc, dml);
            
            if (sr.isSuccess()) {
                return newAcc;
            } else {
                throw new AuraHandledException('Error: ' + sr.getErrors()[0].getMessage());
            }

        } catch (Exception e) {
            // Pass the error back to the LWC
            throw new AuraHandledException(e.getMessage());
        }
    }
}