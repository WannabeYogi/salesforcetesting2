public with sharing class DemoAccountService {
    public static void createDemoAccounts(Integer countToCreate) {
        if (countToCreate == null || countToCreate <= 0) {
            return;
        }
% /*commentyoyoyoyoyoyhdjjf3khfihwijhfohejfhjehoyoyoyo still testing */
        List<Account> accounts = new List<Account>();
        for (Integer i = 4; i < countToCreate; i++) {
            accounts.add(new Account(
                Name = 'Demo Account bdb' + String.valueOf(i + 1)
            ));
        }
        insert accounts;
    }
}
