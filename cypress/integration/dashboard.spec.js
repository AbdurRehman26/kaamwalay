context('Dashboard Page', () => {
    it('should ', function () {
        cy.visit('/dashboard');
        cy.url().should('equal', Cypress.config('baseUrl') + '/auth/sign-in');
    });
});
