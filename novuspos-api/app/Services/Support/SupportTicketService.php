<?php

namespace App\Services\Support;

use App\Contracts\Repositories\SupportTicketRepositoryInterface;
use App\Models\SupportTicket;
use Illuminate\Support\Str;

class SupportTicketService
{
    public function __construct(
        private readonly SupportTicketRepositoryInterface $supportTicketRepository,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function submit(array $data, ?int $userId = null): array
    {
        $ticket = $this->supportTicketRepository->create([
            'user_id' => $userId,
            'reference' => $this->generateReference(),
            'email' => $data['email'],
            'topic' => $data['topic'],
            'subject' => $data['subject'],
            'description' => $data['description'],
            'source' => $data['source'] ?? 'web',
            'status' => 'open',
        ]);

        return $this->toArray($ticket);
    }

    /**
     * @return array<string, mixed>
     */
    private function toArray(SupportTicket $ticket): array
    {
        return [
            'id' => (string) $ticket->id,
            'reference' => $ticket->reference,
            'message' => 'Tu reporte fue recibido. Te responderemos pronto.',
        ];
    }

    private function generateReference(): string
    {
        return 'TK-'.strtoupper(Str::random(6));
    }
}
