<?php

namespace Tests\Feature\API\Services;

use App\Services\BarcodeService;
use CodeItNow\BarcodeBundle\Utils\BarcodeGenerator;
use Tests\TestCase;

class BarcodeServiceTest extends TestCase
{
    /** @test */
    public function it_can_generate_barcode()
    {
        $this->markTestIncomplete('Syntax error on package code.');

        $barcode = BarcodeService::generate('RG000000001', BarcodeGenerator::Code39, '', 2);

        $barcode->assertStatus($barcode instanceof string);
    }
}
