<?php

use App\Models\OrderPaymentPlan;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $orders = DB::table('orders')->whereNotNull('payment_plan_id')->get();
        $paymentPlans = DB::table('payment_plans')->get();

        foreach ($orders as $order) {
            $paymentPlan = $paymentPlans->first(function ($item, $key) use ($order) {
                return $item->id === $order->payment_plan_id;
            });
            $orderPaymentPlan = OrderPaymentPlan::create([
                'price' => $paymentPlan->price,
                'max_protection_amount' => $paymentPlan->max_protection_amount,
                'turnaround' => $paymentPlan->turnaround,
            ]);

            DB::table('orders')->where('id', $order->id)->update(['order_payment_plan_id' => $orderPaymentPlan->id]);
        }
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
