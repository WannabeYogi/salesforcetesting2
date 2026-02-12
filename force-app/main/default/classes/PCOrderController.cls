public with sharing class PCOrderController {
    
    @AuraEnabled
    public static PC_Order__c createPCOrder(String orderData) {
        try {
            // Parse the JSON order data
            Map<String, Object> orderMap = (Map<String, Object>)JSON.deserializeUntyped(orderData);
            
            // Create PC Order record
            PC_Order__c newOrder = new PC_Order__c();
            newOrder.Company_Name__c = (String)orderMap.get('companyName');
            newOrder.Department__c = (String)orderMap.get('department');
            newOrder.Contact_Email__c = (String)orderMap.get('contactEmail');
            newOrder.Additional_Requirements__c = (String)orderMap.get('additionalRequirements');
            newOrder.Status__c = 'Pending';
            newOrder.Order_Date__c = Date.today();
            
            // Generate order number
            newOrder.Order_Number__c = generateOrderNumber();
            
            // Insert the order
            insert newOrder;
            
            // Create order line items for each device
            List<Object> devices = (List<Object>)orderMap.get('devices');
            List<PC_Order_Line_Item__c> lineItems = new List<PC_Order_Line_Item__c>();
            
            for (Object deviceObj : devices) {
                Map<String, Object> device = (Map<String, Object>)deviceObj;
                
                PC_Order_Line_Item__c lineItem = new PC_Order_Line_Item__c();
                lineItem.PC_Order__c = newOrder.Id;
                lineItem.Device_Type__c = (String)device.get('label');
                lineItem.Device_Code__c = (String)device.get('key');
                lineItem.Quantity__c = (Integer)device.get('quantity');
                lineItem.Unit_Price__c = getDevicePrice((String)device.get('key'));
                
                lineItems.add(lineItem);
            }
            
            if (!lineItems.isEmpty()) {
                insert lineItems;
            }
            
            return newOrder;
            
        } catch (Exception e) {
            throw new AuraHandledException('Error creating PC Order: ' + e.getMessage());
        }
    }
    
    private static String generateOrderNumber() {
        // Generate unique order number with prefix
        String prefix = 'PCO';
        String dateStr = DateTime.now().format('yyyyMMdd');
        String timeStr = String.valueOf(DateTime.now().getTime()).right(4);
        return prefix + '-' + dateStr + '-' + timeStr;
    }
    
    private static Decimal getDevicePrice(String deviceCode) {
        // Return default prices for devices (in a real implementation, 
        // this might come from a Price Book or custom setting)
        Map<String, Decimal> devicePrices = new Map<String, Decimal>{
            'macbook_air_m2' => 999.00,
            'macbook_pro_m2' => 1499.00,
            'mac_studio' => 1999.00,
            'imac_24' => 1299.00,
            'mac_mini' => 599.00,
            'dell_latitude' => 899.00,
            'hp_elitebook' => 999.00,
            'lenovo_thinkpad' => 1099.00,
            'dell_optiplex' => 799.00,
            'hp_elite_desktop' => 899.00
        };
        
        return devicePrices.get(deviceCode) != null ? devicePrices.get(deviceCode) : 0.00;
    }
}
