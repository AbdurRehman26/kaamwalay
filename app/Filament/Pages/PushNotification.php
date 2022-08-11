<?php

namespace App\Filament\Pages;

use Filament\Forms;
use Filament\Pages\Actions\Action;
use Filament\Pages\Page;
use Pusher\PushNotifications\PushNotifications;

class PushNotification extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-bell';

    protected static string $view = 'filament.pages.push-notification';

    protected static ?string $navigationGroup = 'Marketing';

    /**
     * @throws \Exception
     */
    protected function getActions(): array
    {
        return [
            Action::make('push')
                ->action(function (array $data): void {
                    $config = config('services.pusher');

                    $beamsClient = new PushNotifications([
                        'instanceId' => $config['beams_instance_id'],
                        'secretKey' => $config['beams_secret_key'],
                    ]);

                    $beamsClient->publishToInterests([$data['interest']], [
                        'apns' => [
                            'aps' => [
                                'alert' => [
                                    'title' => $data['title'],
                                    'body' => $data['message'],
                                ],
                            ],
                        ],
                        'fcm' => [
                            'notification' => [
                                'title' => $data['title'],
                                'body' => $data['message'],
                            ],
                        ],
                    ]);
                })
                ->label('Send Push Notification')
                ->size('lg')
                ->form([
                    Forms\Components\Select::make('interest')
                        ->options([
                            'general' => 'general',
                            'debug-general' => 'debug-general',
                        ])
                        ->required(),
                    Forms\Components\TextInput::make('title')
                        ->required(),
                    Forms\Components\Textarea::make('message')
                        ->required(),
                ]),
        ];
    }
}
