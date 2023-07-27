<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('payment_methods')->where('code', 'collector_coin')->update([
            'handles_handshake' => true,
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

    }
};
