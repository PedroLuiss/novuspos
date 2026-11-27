<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401, 'Unauthenticated.');
        }

        if ($roles !== [] && method_exists($user, 'hasAnyRole') && ! $user->hasAnyRole($roles)) {
            abort(403, 'No tienes permisos para realizar esta acción.');
        }

        return $next($request);
    }
}
