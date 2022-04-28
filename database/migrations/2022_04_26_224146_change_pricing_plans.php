<?php

use App\Models\PaymentPlan;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $newPricings = [
            ['id' => 1, 'price' => 20, 'max_protection_amount' => 500, 'turnaround' => '20-25 Days'],
            ['id' => 2, 'price' => 40, 'max_protection_amount' => 1000, 'turnaround' => '12-15 Days'],
            ['id' => 3, 'price' => 60, 'max_protection_amount' => 2500, 'turnaround' => '5-7 Days'],
            ['id' => 4, 'price' => 100, 'max_protection_amount' => 10000, 'turnaround' => '2-3 Days'],
            ['id' => 5, 'price' => 200, 'max_protection_amount' => 50000, 'turnaround' => 'Same Day'],
            ['id' => 6, 'price' => 1000, 'max_protection_amount' => 250000, 'turnaround' => 'Same Day'],
        ];

        foreach ($newPricings as $pricing) {
            $paymentPlan = PaymentPlan::find($pricing['id']);
            $paymentPlan->fill($pricing);
            $paymentPlan->save();
        }

        $paymentPlan = PaymentPlan::find(7);
        $paymentPlan->delete();

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
