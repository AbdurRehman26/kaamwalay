<?php

namespace App\Http\Controllers\API\V3\Customer;

use App\Http\Controllers\API\V2\Customer\PushNotificationController as V2PushNotificationController;
use App\Http\Resources\API\V3\Customer\PushNotificationResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Notifications\DatabaseNotification;

class PushNotificationController extends V2PushNotificationController
{
    public function index(): AnonymousResourceCollection
    {
        $notifications = auth()->user()->notifications()->paginate();

        return PushNotificationResource::collection($notifications);
    }

    public function markAsRead(DatabaseNotification $notification): PushNotificationResource
    {
        abort_if($notification->notifiable_id !== auth()->user()->id, 403);

        $notification->markAsRead();

        return new PushNotificationResource($notification);
    }

    public function markAllAsRead(): JsonResponse
    {
        auth()->user()->unreadNotifications()->update(['read_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'All notifications have been marked as read.'
        ]);
    }
}
