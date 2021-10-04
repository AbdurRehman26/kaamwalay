<?php

use function Pest\Laravel\get;

it('has terms-and-conditions page', function () {
    get('/terms-and-conditions')
        ->assertSee('Terms And Conditions')
        ->assertSeeInOrder([
            'INTRODUCTION', 'INTELLECTUAL PROPERTY RIGHTS', 'RESTRICTIONS',
            'YOUR CONTENT', 'LIABILITIES & WARRANTIES', 'LIMITATION OF LIABILITY',
            'INDEMNIFICATION', 'SEVERABILITY', 'VARIATION OF TERMS', 'ASSIGNMENT',
            'ENTIRE AGREEMENT', 'GOVERNING LAW & JURISDICTION',
        ], false);
});
