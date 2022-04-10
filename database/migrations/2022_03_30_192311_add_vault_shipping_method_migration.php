<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('shipping_methods')->insert([
            [
                'name' => 'Vault Storage',
                'code' => 'vault_storage',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('shipping_methods')
            ->where('code', 'vault_storage')
            ->delete();
    }
};
