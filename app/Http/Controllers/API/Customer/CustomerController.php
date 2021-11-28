<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Customer\UpdateCustomerRequest;
use App\Models\User;
use App\Services\Customer\CustomerProfileService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CustomerController extends Controller
{
    public function updateProfile(UpdateCustomerRequest $request, CustomerProfileService $customerProfileService): void
    {
        $data = $request->safe()->only([
            'first_name',
            'last_name',
            'username',
            'phone',
            'customer_number',
        ]);

        /** @var User $user */
        $user = auth()->user();

        $customerProfileService->updateCustomer($user, $data);

        try {
        } catch (\Exception $e) {
        }
    }

    public function uploadFile()
    {
        dd(request()->file);
    }


    protected function uploadToCloud(string $pdfData): string
    {
        $filePath = 'invoice/' . Str::uuid() . '.pdf';

        if (Storage::disk('s3')->put($filePath, $pdfData)) {
            return Storage::disk('s3')->url($filePath);
        }

    }
}
