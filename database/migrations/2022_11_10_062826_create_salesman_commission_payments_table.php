<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('salesman_commission_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class, 'salesman_id')->constrained('users');
            $table->foreignIdFor(User::class, 'added_by_id')->constrained('users');
            $table->decimal('amount', 10, 2);
            $table->string('file_url')->nullable();
            $table->string('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('salesman_commission_payments');
    }
};
