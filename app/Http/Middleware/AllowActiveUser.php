<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AllowActiveUser
{
    public function handle(Request $request, Closure $next): mixed
    {
        if (! $request->user()->isActive()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return $next($request);
    }
}
