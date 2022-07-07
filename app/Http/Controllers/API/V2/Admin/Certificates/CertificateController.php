<?php

namespace App\Http\Controllers\API\V2\Admin\Certificates;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V2\Admin\Certificate\CertificateCollection;
use App\Http\Resources\API\V2\Admin\Certificate\CertificateResource;
use App\Services\Admin\V2\CertificateService;

class CertificateController extends Controller
{
    public function __construct(
        protected CertificateService $certificateService
    ) {
    }

    public function index(): CertificateCollection
    {
        $certificates = $this->certificateService->getCertificates();

        return new CertificateCollection($certificates);
    }

    public function show(string $certificateId): CertificateResource
    {
        $certificate = $this->certificateService->getCertificate($certificateId);

        return new CertificateResource($certificate);
    }
}
