<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\OrderAdminStatus;

class SetOrderAdminStatusesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('orders')
            ->whereIn('order_status_id',[1,2,6])
            ->update(['order_admin_status_id' => OrderAdminStatus::PENDING_STATUS]);

        DB::table('orders')
            ->where('order_status_id',3)
            ->update(['order_admin_status_id' => OrderAdminStatus::REVIEWED_STATUS]);

        DB::table('orders')
            ->where('order_status_id',4)
            ->update(['order_admin_status_id' => OrderAdminStatus::GRADED_STATUS]);

        DB::table('orders')
            ->where('order_status_id',5)
            ->update(['order_admin_status_id' => OrderAdminStatus::SHIPPED_STATUS]);
    }
}
