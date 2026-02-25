const salesforceLwc = require('@salesforce/eslint-config-lwc');

module.exports = [
    ...salesforceLwc.configs.recommended,
    {
        files: ['force-app/main/default/lwc/**/*.js'],
    }
];
