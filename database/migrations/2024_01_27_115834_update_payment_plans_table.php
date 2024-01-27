<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('payment_plans')->where('id', '=', 2)->update(['turnaround' => '10 Business Days']);
    }

    public function down(): void
    {
        DB::table('payment_plans')->where('id', '=', 2)->update(['turnaround' => '5 Business Days']);
    }
};
