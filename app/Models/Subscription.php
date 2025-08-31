<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Subscription extends Model
{
    use HasFactory;

    const STATUS_ACTIVE = 'active';
    const STATUS_EXPIRED = 'expired';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_PENDING = 'pending';

    const PLAN_BASIC = 'basic';
    const PLAN_PREMIUM = 'premium';
    const PLAN_ENTERPRISE = 'enterprise';

    protected $fillable = [
        'user_id',
        'plan_type',
        'status',
        'starts_at',
        'expires_at',
        'price',
        'currency',
        'features',
        'auto_renew',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected $casts = [
        'features' => 'array',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'auto_renew' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function isActive()
    {
        return $this->status === self::STATUS_ACTIVE && 
               $this->expires_at > now();
    }

    public function isExpired()
    {
        return $this->expires_at <= now();
    }

    public function daysRemaining()
    {
        if ($this->isExpired()) {
            return 0;
        }
        
        return Carbon::now()->diffInDays($this->expires_at);
    }

    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE)
                    ->where('expires_at', '>', now());
    }

    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', now());
    }
}
