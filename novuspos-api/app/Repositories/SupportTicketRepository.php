<?php

namespace App\Repositories;

use App\Contracts\Repositories\SupportTicketRepositoryInterface;
use App\Models\SupportTicket;

class SupportTicketRepository implements SupportTicketRepositoryInterface
{
    public function create(array $attributes): SupportTicket
    {
        return SupportTicket::query()->create($attributes);
    }
}
