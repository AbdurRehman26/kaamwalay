<?php

use App\Models\User;
use App\Services\SerialNumberService\SerialNumberService;
use Illuminate\Database\Migrations\Migration;

class AssignCustomerNumberToUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        // Skip running migration when db it's sqlite
        // CONCAT function used as expression from
        if (config('database.default') !== 'sqlite') {
            User::query()->whereNull('customer_number')->update([
                'customer_number' => SerialNumberService::customer()->toSql(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
    }
}
