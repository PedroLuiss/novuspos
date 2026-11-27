<?php

namespace App\Http\Resources\Api\V1;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin User
 */
class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $role = method_exists($this->resource, 'getRoleNames')
            ? $this->resource->getRoleNames()->first()
            : null;

        return [
            'id' => (string) $this->id,
            'email' => $this->email,
            'organizationName' => $this->organization_name ?? $this->name,
            'role' => $role ?? 'client',
        ];
    }
}
