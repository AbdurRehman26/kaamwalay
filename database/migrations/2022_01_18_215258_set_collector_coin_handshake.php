<?php

use App\Models\PaymentMethod;
use Illuminate\Database\Migrations\Migration;

class SetCollectorCoinHandshake extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('payment_methods')->where('code', 'collector_coin')->update([
            'handles_handshake' => true
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

    }
}
