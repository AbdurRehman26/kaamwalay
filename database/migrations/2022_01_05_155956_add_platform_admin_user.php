<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPlatformAdminUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        User::factory()
            ->admin()
            ->withRole(config('permission.roles.admin'))
            ->create([
                'first_name' => 'Robograding',
                'last_name' => 'Platform',
                'email' => 'platform@robograding.com',
                'username' => 'robograding.platform'
            ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
}
