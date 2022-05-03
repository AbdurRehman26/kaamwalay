<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $orders = DB::table('orders')->where('order_payment_plan_id', 1)->get();
        $orderPaymentPlans = DB::table('order_payment_plans')->whereNull('created_at')->get();

        foreach ($orders as $index => $order) {
            DB::table('orders')->where('id', $order->id)->update(['order_payment_plan_id' => $orderPaymentPlans[$index]->id]);
        }

        DB::table('order_payment_plans')->whereNull('created_at')->update([
            'created_at' => '2022-05-02 08:30:00',
            'updated_at' => '2022-05-02 08:30:00',
        ]);
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
