<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Car extends Model
{
    use HasFactory, SoftDeletes;

    const STATUS_AVAILABLE = 'available';
    const STATUS_SOLD = 'sold';
    const STATUS_PENDING = 'pending';

    const FUEL_TYPE_PETROL = 'petrol';
    const FUEL_TYPE_DIESEL = 'diesel';
    const FUEL_TYPE_ELECTRIC = 'electric';
    const FUEL_TYPE_HYBRID = 'hybrid';
    const FUEL_TYPE_CNG = 'cng';

    const TRANSMISSION_MANUAL = 'manual';
    const TRANSMISSION_AUTOMATIC = 'automatic';
    const TRANSMISSION_CVT = 'cvt';

    protected $fillable = [
        'seller_id',
        'brand',
        'model',
        'year',
        'mileage',
        'fuel_type',
        'transmission',
        'price',
        'currency',
        'location',
        'city',
        'state',
        'country',
        'description',
        'features',
        'images',
        'video_url',
        'status',
        'is_featured',
        'views_count',
        'inquiries_count',
    ];

    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'mileage' => 'integer',
            'price' => 'decimal:2',
            'features' => 'array',
            'images' => 'array',
            'is_featured' => 'boolean',
            'views_count' => 'integer',
            'inquiries_count' => 'integer',
        ];
    }

    /**
     * Get the seller that owns the car
     */
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Get the seller profile
     */
    public function sellerProfile()
    {
        return $this->hasOneThrough(SellerProfile::class, User::class, 'id', 'user_id', 'seller_id');
    }

    /**
     * Scope for available cars
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', self::STATUS_AVAILABLE);
    }

    /**
     * Scope for featured cars
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope for cars by seller
     */
    public function scopeBySeller($query, $sellerId)
    {
        return $query->where('seller_id', $sellerId);
    }

    /**
     * Get formatted price
     */
    public function getFormattedPriceAttribute()
    {
        return $this->currency . ' ' . number_format($this->price, 2);
    }

    /**
     * Get primary image
     */
    public function getPrimaryImageAttribute()
    {
        return $this->images[0] ?? null;
    }
}
