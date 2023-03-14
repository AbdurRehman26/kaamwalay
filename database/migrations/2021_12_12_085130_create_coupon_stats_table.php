<?php

use App\Models\Coupon;
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
        Schema::create('coupon_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Coupon::class)
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->unsignedInteger('times_used')
                ->default(0);
            $table->unsignedDecimal('total_discount', 10)
                ->default(0.0);
            $table->unsignedDecimal('total_revenue', 10)
                ->default(0.0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupon_stats');
    }
};
