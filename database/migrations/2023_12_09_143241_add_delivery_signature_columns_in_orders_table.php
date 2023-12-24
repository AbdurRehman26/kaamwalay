<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->boolean('requires_signature')
                ->default(false)
                ->after('requires_cleaning')
                ->comment('Refers to signature at delivery service');
            $table->decimal('signature_fee', 10, 2)
                ->after('cleaning_fee')
                ->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'requires_signature',
                'signature_fee',
            ]);
        });
    }
};
