<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\OrderItemStatus;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $userCardIds = DB::table('user_cards')
            ->join('order_items','order_items.id','user_cards.order_item_id')
            ->where('order_items.order_item_status_id',OrderItemStatus::NOT_ACCEPTED)
            ->select('user_cards.id as id')
            ->get()->pluck('id')->flatten();

        DB::table('user_card_certificates')->whereIn('user_card_id',$userCardIds)->delete();
        DB::table('user_cards')->whereIn('id',$userCardIds)->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
