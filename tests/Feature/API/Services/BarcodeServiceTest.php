<?php

namespace Tests\Feature\API\Services;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Services\BarcodeService;
use CodeItNow\BarcodeBundle\Utils\BarcodeGenerator;

class BarcodeServiceTest extends TestCase
{
    /** @test */
    public function it_can_generate_barcode()
    {
        $barcode = BarcodeService::generate('RG000000001', BarcodeGenerator::Code39 , '', 2);

        $barcode->assertStatus($barcode instanceof string);
    }
}
