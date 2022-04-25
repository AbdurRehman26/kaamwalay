<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Order;
use App\Models\OrderPaymentPlan;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $orders = Order::whereNotNull('payment_plan_id')->get();

        foreach ($orders as $order) {
            $orderPaymentPlan = OrderPaymentPlan::create([
                'price' => $order->paymentPlan->price,
                'max_protection_amount' => $order->paymentPlan->max_protection_amount,
                'turnaround' => $order->paymentPlan->turnaround,
            ]);

            $order->order_payment_plan_id = $orderPaymentPlan->id;
            $order->save();
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
