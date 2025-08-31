<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dispute extends Model
{
    use HasFactory;

    const STATUS_OPEN = 'open';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_RESOLVED = 'resolved';
    const STATUS_CLOSED = 'closed';

    const PRIORITY_LOW = 'low';
    const PRIORITY_MEDIUM = 'medium';
    const PRIORITY_HIGH = 'high';
    const PRIORITY_URGENT = 'urgent';

    protected $fillable = [
        'dispute_id',
        'complainant_id',
        'respondent_id',
        'car_id',
        'transaction_id',
        'subject',
        'description',
        'category',
        'priority',
        'status',
        'evidence_files',
        'resolution',
        'resolution_type',
        'resolved_at',
        'resolved_by',
    ];

    protected $casts = [
        'evidence_files' => 'array',
        'resolved_at' => 'datetime',
    ];

    public function complainant()
    {
        return $this->belongsTo(User::class, 'complainant_id');
    }

    public function respondent()
    {
        return $this->belongsTo(User::class, 'respondent_id');
    }

    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function resolvedBy()
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    public function isOpen()
    {
        return $this->status === self::STATUS_OPEN;
    }

    public function isResolved()
    {
        return $this->status === self::STATUS_RESOLVED;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($dispute) {
            $dispute->dispute_id = 'DP' . strtoupper(uniqid());
        });
    }
}
