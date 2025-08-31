<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->string('brand');
            $table->string('model');
            $table->integer('year');
            $table->integer('mileage'); // in kilometers
            $table->enum('fuel_type', ['petrol', 'diesel', 'electric', 'hybrid', 'cng']);
            $table->enum('transmission', ['manual', 'automatic', 'cvt']);
            $table->decimal('price', 12, 2);
            $table->string('currency', 3)->default('INR');
            $table->string('location');
            $table->string('city');
            $table->string('state');
            $table->string('country')->default('India');
            $table->text('description');
            $table->json('features')->nullable(); // JSON array of features
            $table->json('images'); // JSON array of image URLs
            $table->string('video_url')->nullable();
            $table->enum('status', ['available', 'sold', 'pending'])->default('available');
            $table->boolean('is_featured')->default(false);
            $table->integer('views_count')->default(0);
            $table->integer('inquiries_count')->default(0);
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes for better performance
            $table->index(['brand', 'model']);
            $table->index(['price', 'status']);
            $table->index(['city', 'state']);
            $table->index('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
