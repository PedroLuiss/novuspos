<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Notificaciones en tiempo real: avisos globales y avisos dirigidos a un
| usuario. Solo usuarios autenticados pueden suscribirse; los dirigidos
| validan que el id del canal coincida con el usuario autenticado.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id): bool {
    return (string) $user->id === (string) $id;
}, ['guards' => ['sanctum']]);

Broadcast::channel('notifications.all', function ($user): bool {
    return $user !== null;
}, ['guards' => ['sanctum']]);

Broadcast::channel('notifications.{id}', function ($user, $id): bool {
    return (string) $user?->id === (string) $id;
}, ['guards' => ['sanctum']]);
