<?php

namespace App\Notifications\Concerns;

/**
 * Shapes the broadcast payload to match NotificationResource (id/type/data/read_at/created_at),
 * so the frontend handles the initial fetch and the real-time push the same way.
 */
trait BroadcastsResourceShape
{
    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->id,
            'type' => class_basename($this),
            'data' => $this->toArray(),
            'read_at' => false,
            'created_at' => now()->format('Y-m-d H:i:s'),
        ];
    }
}
