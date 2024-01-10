<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('autograph_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('autograph_category_id');
            $table->unsignedBigInteger('autograph_type_id');
            $table->string('certificate_number');
            $table->string('name');
            $table->string('image_url');
            $table->string('signed_by');
            $table->timestamp('signed_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('autograph_products');
    }
};
