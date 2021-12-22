<?php

use App\Models\Coupon;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCouponStatsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
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
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('coupon_stats');
    }
}
