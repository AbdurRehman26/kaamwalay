<?php

use App\Models\AutographProduct;

use function Pest\Laravel\get;

it('has autograph listing page', function () {
    get(route('authentication.index'))->assertOk();
});

it('has autograph detail page', function () {
    $autographProduct = AutographProduct::factory()->create();
    get(route('authentication.view', ['autographProduct' => $autographProduct->certificate_number]))
        ->assertSee([
            $autographProduct->certificate_number,
            $autographProduct->getLongName(),
            $autographProduct->name,
            $autographProduct->image_url,
            $autographProduct->autographCategory->name,
            $autographProduct->autographType->name,
            $autographProduct->signed_by,
            $autographProduct->signed_at->format('M d, Y'),
            $autographProduct->created_at->format('M d, Y'),
        ]);
});

it('redirects to listing page if certificate does not exist', function () {
    get(route('authentication.view', ['autographProduct' => '12345']))->assertRedirectToRoute('authentication.index');
});
