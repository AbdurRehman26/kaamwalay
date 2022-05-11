<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AllowActiveUser
{
    public function handle(Request $request, Closure $next): mixed
    {
        $user = $request->user();
        if (! $user->is_active) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return $next($request);
    }
}
