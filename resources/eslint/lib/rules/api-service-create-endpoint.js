/**
 * @fileoverview API Service Create endpoint method
 * @author Dumitrana Alinus
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
    meta: {
        type: 'problem', // `problem`, `suggestion`, or `layout`
        docs: {
            description: 'API Service Create endpoint method',
            category: 'code-style',
            recommended: false,
            url: null, // URL to the documentation page for this rule
        },
        fixable: null, // Or `code` or `whitespace`
        schema: [], // Add a schema if the rule has options
    },

    create(context) {
        // variables should be defined here
        const filename = context.getFilename();

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        // any helper functions should go here or else delete this section

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            // visitor functions for different types of nodes
            MemberExpression(node) {
                const [, tail] = filename.split('resources');
                const left = node.object.name;
                const right = node.property.name;

                if (/api(Service)?/i.test(left) && /createEndpoint/i.test(right)) {
                    if (!/^\/ts\/(.*)\/(repositories|redux)/i.test(tail)) {
                        context.report({
                            node: node,
                            message:
                                'API Service Create endpoint method should be used outside repositories or redux directories',
                            type: node.type,
                        });
                    }
                }
            },
        };
    },
};
