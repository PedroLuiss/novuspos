<?php

namespace App\Contracts\Repositories;

use App\Models\SupportTicket;

interface SupportTicketRepositoryInterface
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): SupportTicket;
}
