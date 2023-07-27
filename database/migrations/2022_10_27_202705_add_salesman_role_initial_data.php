<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Role::findOrCreate(config('permission.roles.salesman'), 'api');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
