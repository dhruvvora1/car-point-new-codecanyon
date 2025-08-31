<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SellerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_name',
        'business_type',
        'business_address',
        'city',
        'state',
        'postal_code',
        'country',
        'business_phone',
        'business_email',
        'website',
        'description',
        'license_number',
        'registration_document',
        'profile_image',
        'is_verified',
    ];

    protected function casts(): array
    {
        return [
            'is_verified' => 'boolean',
        ];
    }

    /**
     * Get the user that owns the seller profile
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get cars listed by this seller
     */
    public function cars()
    {
        return $this->hasMany(Car::class, 'seller_id', 'user_id');
    }
}
