<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarAttribute extends Model
{
    use HasFactory;

    const TYPE_BODY_TYPE = 'body_type';
    const TYPE_FUEL = 'fuel';
    const TYPE_TRANSMISSION = 'transmission';
    const TYPE_COLOR = 'color';
    const TYPE_FEATURES = 'features';

    protected $fillable = [
        'type',
        'name',
        'value',
        'description',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public static function getByType($type)
    {
        return static::where('type', $type)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }
}
