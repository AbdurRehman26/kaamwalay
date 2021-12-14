<?php

use App\Models\CouponStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use App\Models\CouponApplicable;

class CreateCouponsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)
                ->comment('person who adds the coupon')
                ->constrained()
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignIdFor(CouponStatus::class)
                ->comment('current status')
                ->constrained()
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->string('code')->index();
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->unsignedInteger('max_usage_allowed')->nullable();
            $table->unsignedInteger('usage_allowed_per_user')->nullable();
            $table->unsignedTinyInteger('type')
                ->comment('0 => percentage, 1 => fixed');
            $table->unsignedDecimal('discount_value', 10);
            $table->boolean('is_capped')->default(false);
            $table->unsignedDecimal('capped_amount', 10)->nullable();
            $table->dateTime('available_from');
            $table->dateTime('available_till')
                ->nullable()
                ->comment('if its null then the coupon is permanent');
            $table->foreignIdFor(CouponApplicable::class)
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('coupons');
    }
}
