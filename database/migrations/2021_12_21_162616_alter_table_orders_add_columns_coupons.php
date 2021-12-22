<?php

use App\Models\Coupon;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableOrdersAddColumnsCoupons extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignIdFor(Coupon::class)
                ->after('shipping_method_id')
                ->nullable()
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->decimal('discounted_amount', 10)->default(0)->after('grand_total')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('discounted_amount');
            $table->dropConstrainedForeignId('coupon_id');
        });
    }
}
