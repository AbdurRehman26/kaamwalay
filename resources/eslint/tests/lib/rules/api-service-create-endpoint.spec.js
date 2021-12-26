/**
 * @fileoverview API Service Create endpoint method
 * @author Dumitrana Alinus
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/api-service-create-endpoint');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const ruleTester = new RuleTester();
ruleTester.run('api-service-create-endpoint', rule, {
    valid: [
        {
            filename: '/home/code/src/resources/ts/shared/repositories/TestRepository.ts',
            code: "apiService.createEndpoint('/test')",
        },
        {
            filename: '/home/code/src/resources/ts/shared/repositories/TestRepository.ts',
            code: "api.createEndpoint('/test')",
        },
    ],

    invalid: [
        {
            filename: '/home/code/src/resources/ts/dashboard/components/TestComponent.tsx',
            code: "apiService.createEndpoint('/api/v1/test')",
            errors: [
                {
                    message:
                        'API Service Create endpoint method should be used outside repositories or redux directories',
                    type: 'MemberExpression',
                },
            ],
        },
        {
            filename: '/home/code/src/resources/ts/dashboard/components/TestComponent.tsx',
            code: "api.createEndpoint('/api/v1/test')",
            errors: [
                {
                    message:
                        'API Service Create endpoint method should be used outside repositories or redux directories',
                    type: 'MemberExpression',
                },
            ],
        },
    ],
});
