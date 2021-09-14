<?php

use App\Exceptions\API\Admin\IncorrectOrderStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\User;
use App\Services\Admin\OrderStatusHistoryService;
use Database\Seeders\CardCategoriesSeeder;
use Database\Seeders\CardProductSeeder;
use Database\Seeders\CardSeriesSeeder;
use Database\Seeders\CardSetsSeeder;
use Database\Seeders\RolesSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
        CardCategoriesSeeder::class,
        CardSeriesSeeder::class,
        CardSetsSeeder::class,
        CardProductSeeder::class,
    ]);

    $user = User::factory()->withRole(config('permission.roles.admin'))->create();

    $this->orders = Order::factory()->count(5)->state(new Sequence(
        ['order_status_id' => OrderStatus::PLACED],
        ['order_status_id' => OrderStatus::ARRIVED],
        ['order_status_id' => OrderStatus::GRADED],
        ['order_status_id' => OrderStatus::SHIPPED],
        ['order_status_id' => OrderStatus::REVIEWED]
    ))->create();

    $orderStatusHistoryService = resolve(OrderStatusHistoryService::class);
    $this->orders->each(function ($order) use ($orderStatusHistoryService) {
        $orderStatusHistoryService->addStatusToOrder($order->order_status_id, $order->id, $order->user_id);
    });

    OrderItem::factory()->count(2)
        ->state(new Sequence(
            [
                'order_id' => $this->orders[0]->id,
            ],
            [
                'order_id' => $this->orders[1]->id,
            ]
        ))
        ->create([
            'order_id' => $this->orders[0],
        ]);

    $this->sampleAgsResponse = '
        {
            "count": 1,
            "next": null,
            "previous": null,
            "results": [
                {
                    "id": "a099624b-ec8b-483d-afe2-201b452508d4",
                    "certificate_id": "09000000",
                    "scan_version": "/api/v2",
                    "filename": "pidgey2",
                    "grade": {
                        "grade": "7.00",
                        "nickname": "NM"
                    },
                    "final_value_to_compare": "6.62",
                    "card": {
                        "id": 13189,
                        "set_id": 130,
                        "name": "Potion",
                        "rarity": "Common",
                        "card_number": "94/102",
                        "set_name": "Base Set",
                        "image_path": "https://den-cards.pokellector.com/119/Potion.BS.94.png",
                        "card_url": "https://www.pokellector.com/card/Potion-Base-Set-BS-94",
                        "image_bucket_path": "https://wooter-ags-database-cards.s3.amazonaws.com/pokemon_cards_images/cards_images/Potion.BS.94.png",
                        "pokemon_set": {
                            "id": 130,
                            "serie_id": 16,
                            "name": "Base Set",
                            "description": "This is where it all began!",
                            "cards_number": 102,
                            "secret_cards": -1,
                            "release_date": "1999-01-9",
                            "image_path": "https://den-media.pokellector.com/logos/Base-Set.logo.119.png",
                            "image_bucket_path": "https://wooter-ags-database-cards.s3.amazonaws.com/pokemon_cards_images/sets_images/Base-Set.logo.119.png",
                            "set_url": "https://www.pokellector.com/sets/BS-Base-Set"
                        },
                        "pokemon_serie": {
                            "id": 16,
                            "name": "Base Set Series",
                            "image_path": "https://den-media.pokellector.com/logos/Base-Set.logo.119.png",
                            "image_bucket_path": "https://wooter-ags-database-cards.s3.amazonaws.com/pokemon_cards_images/series_images/Base-Set.logo.119.png"
                        }
                    },
                    "front_scan": {
                        "centering_grade": {
                            "grade": "2.00",
                            "nickname": "GOOD"
                        },
                        "corners_grade": {
                            "grade": "8.00",
                            "nickname": "NM-MT"
                        },
                        "edges_grade": {
                            "grade": "6.00",
                            "nickname": "EX-MT"
                        },
                        "surface_grade": {
                            "grade": "10.00",
                            "nickname": "GEM-MT"
                        },
                        "centering_result": {
                            "id": "42ac2be2-465d-480e-817c-667d94381453",
                            "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/centering/centering_front_pidgey2_07h41ZN.jpg",
                            "results": {
                                "dif_x": 0.007968236748444,
                                "dif_y": 0.003674597243426225
                            }
                        },
                        "corners_result": {
                            "id": "0e9d00db-018a-494c-9871-5200774d1fb3",
                            "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/corners/corners_front_pidgey2_iEnWezi.jpg",
                            "results": {
                                "score": 0.028600005040329318,
                                "crease": {
                                    "pct_pixels": 0.0005296285917191323
                                },
                                "scratch": {
                                    "pct_pixels": 0.00012461849216920763
                                },
                                "holo_area": {
                                    "pct_pixels": 0.0
                                },
                                "corner_bend": {
                                    "pct_pixels": 0.0
                                },
                                "major_whitening": {
                                    "severity": 0.6212779863718538,
                                    "pct_pixels": 0.043928018489645684
                                },
                                "major_dirt_spots": {
                                    "severity": 1.0,
                                    "pct_pixels": 0.0
                                }
                            }
                        },
                        "edges_result": {
                            "id": "52e95b77-ae09-49e4-91b7-58fdd2d10ad7",
                            "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/edges/edges_front_pidgey2_lktKWqh.jpg",
                            "results": {
                                "score": 0.22814487692630372,
                                "crease": {
                                    "pct_pixels": 0.0031621942387936434
                                },
                                "scratch": {
                                    "pct_pixels": 0.0018692773825381144
                                },
                                "holo_area": {
                                    "pct_pixels": 0.0
                                },
                                "corner_bend": {
                                    "pct_pixels": 0.0
                                },
                                "major_whitening": {
                                    "severity": 0.6184208916235061,
                                    "pct_pixels": 0.34446108966721095
                                },
                                "major_dirt_spots": {
                                    "severity": 0.457843137254902,
                                    "pct_pixels": 6.230924608460381e-05
                                }
                            }
                        },
                        "surface_result": {
                            "id": "839cf083-1cb1-45fb-b5b2-4b0dfbac0e3e",
                            "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/surface/surface_front_pidgey2_xUnfJNc.jpg",
                            "results": {
                                "score": 0.000551009215375614,
                                "crease": {
                                    "pct_pixels": 0.0
                                },
                                "scratch": {
                                    "pct_pixels": 0.0
                                },
                                "holo_area": {
                                    "pct_pixels": 0.0
                                },
                                "corner_bend": {
                                    "pct_pixels": 0.0
                                },
                                "major_whitening": {
                                    "severity": 0.0,
                                    "pct_pixels": 0.0
                                },
                                "major_dirt_spots": {
                                    "severity": 0.6674065852756197,
                                    "pct_pixels": 0.0008255975106210003
                                }
                            }
                        },
                        "input_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/front/pidgey2_front_VTLLC6k.jpg"
                    },
                    "back_scan": {
                        "centering_grade": {
                            "grade": "2.00",
                            "nickname": "GOOD"
                        },
                        "corners_grade": {
                            "grade": "10.00",
                            "nickname": "GEM-MT"
                        },
                        "edges_grade": {
                            "grade": "5.00",
                            "nickname": "EX"
                        },
                        "surface_grade": {
                            "grade": "10.00",
                            "nickname": "GEM-MT"
                        },
                        "centering_result": {
                            "id": "0ef915a0-e380-40cf-9491-c4662d99c65c",
                            "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/centering/centering_back_pidgey2_0044l8C.jpg",
                            "results": {
                                "dif_x": 0.009273159048511804,
                                "dif_y": 0.0026210234844062973
                            }
                        },
                        "corners_result": {
                            "id": "5009c57d-238f-4503-8594-0813060a965d",
                            "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/corners/corners_back_pidgey2_Kxk1MVo.jpg",
                            "results": {
                                "score": 0.01015534228575234,
                                "crease": {
                                    "pct_pixels": 0.0
                                },
                                "scratch": {
                                    "pct_pixels": 0.0
                                },
                                "holo_area": {
                                    "pct_pixels": 0.0
                                },
                                "corner_bend": {
                                    "pct_pixels": 0.0
                                },
                                "major_whitening": {
                                    "severity": 0.7462395917271016,
                                    "pct_pixels": 0.013608688681672265
                                },
                                "major_dirt_spots": {
                                    "severity": 1.0,
                                    "pct_pixels": 0.0
                                }
                            }
                        },
                        "edges_result": {
                            "id": "5c2a9a26-6c1a-47d8-a416-40ed083c4c57",
                            "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/edges/edges_back_pidgey2_eQTE3c6.jpg",
                            "results": {
                                "score": 0.2869834726502885,
                                "crease": {
                                    "pct_pixels": 6.214013096654002e-05
                                },
                                "scratch": {
                                    "pct_pixels": 0.006944159635510847
                                },
                                "holo_area": {
                                    "pct_pixels": 0.0
                                },
                                "corner_bend": {
                                    "pct_pixels": 0.0
                                },
                                "major_whitening": {
                                    "severity": 0.6997020518195834,
                                    "pct_pixels": 0.38011118112232534
                                },
                                "major_dirt_spots": {
                                    "severity": 1.0,
                                    "pct_pixels": 0.0
                                }
                            }
                        },
                        "surface_result": {
                            "id": "4aac0bcc-b1db-4b30-ab98-d3ad2dc31ea1",
                            "output_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/surface/surface_back_pidgey2_jeHy6fS.jpg",
                            "results": {
                                "score": 0.002057508473659761,
                                "crease": {
                                    "pct_pixels": 0.0
                                },
                                "scratch": {
                                    "pct_pixels": 0.0
                                },
                                "holo_area": {
                                    "pct_pixels": 0.0
                                },
                                "corner_bend": {
                                    "pct_pixels": 0.0
                                },
                                "major_whitening": {
                                    "severity": 0.5267973856209149,
                                    "pct_pixels": 4.6605098224905015e-05
                                },
                                "major_dirt_spots": {
                                    "severity": 0.6261375363542546,
                                    "pct_pixels": 0.0032468218430017166
                                }
                            }
                        },
                        "input_image": "https://s3.us-south.cloud-object-storage.appdomain.cloud/pokemon-statics/media/back/pidgey2_back_kr0SxaD.jpg"
                    },
                    "total_centering_grade": {
                        "grade": "2.00",
                        "nickname": "GOOD"
                    },
                    "total_corners_grade": {
                        "grade": "9.00",
                        "nickname": "MINT"
                    },
                    "total_edges_grade": {
                        "grade": "6.00",
                        "nickname": "EX-MT"
                    },
                    "total_surface_grade": {
                        "grade": "10.00",
                        "nickname": "GEM-MT"
                    },
                    "total_centering_value_to_compare": "2.00",
                    "total_corners_value_to_compare": "9.00",
                    "total_edges_value_to_compare": "5.50",
                    "total_surface_value_to_compare": "10.00",
                    "graded_via": {
                        "username": "robograding",
                        "email": "",
                        "name": "",
                        "date_joined": "2021-09-10 17:28:56"
                    },
                    "timestamp": "2021-09-14 16:50:40",
                    "is_testing": false,
                    "front_centering_human_grade": "8.20",
                    "front_corners_human_grade": "8.40",
                    "front_edges_human_grade": "7.60",
                    "front_surface_human_grade": "8.40",
                    "back_centering_human_grade": "9.50",
                    "back_corners_human_grade": "9.00",
                    "back_edges_human_grade": "8.90",
                    "back_surface_human_grade": "9.00"
                }
            ],
            "app_status": 1,
            "app_message": "OK"
        }';
    $this->actingAs($user);
});

it('returns orders list for admin', function () {
    $this->getJson('/api/admin/orders')
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                [
                    'id',
                    'order_number',
                    'arrived',
                    'created_at',
                ],
            ],
        ]);
})->group('admin', 'admin_orders');

it('returns order details', function () {
    $this->getJson('api/admin/orders/1?include=customer')
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                'id',
                'order_number',
                'created_at',
                'customer',
                'order_items',
            ],
        ]);
})->group('admin', 'admin_orders');

test('orders throws error for roles other than admin', function () {
    $this->actingAs(User::factory()->withRole(config('permission.roles.customer'))->create())
        ->getJson('api/admin/orders/1')
        ->assertForbidden();
})->group('admin', 'admin_orders');

test('order details throws error for roles other than admin', function () {
    $this->actingAs(User::factory()->withRole(config('permission.roles.customer'))->create())
        ->getJson('api/admin/orders/1')
        ->assertForbidden();
})->group('admin', 'admin_orders');

it('filters orders by id', function () {
    $this->getJson('/api/admin/orders?filter[order_id]=' . $this->orders[0]->id)
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'id' => $this->orders[0]->id,
        ]);
})->group('admin', 'admin_orders');

it('returns only placed orders', function () {
    $this->getJson('/api/admin/orders?include=order_status_history&filter[status]=placed')
        ->assertOk()
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::PLACED,
        ]);
})->group('admin', 'admin_orders');

it('returns only reviewed orders', function () {
    $this->getJson('/api/admin/orders?include=order_status_history&filter[status]=reviewed')
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::REVIEWED,
        ]);
})->group('admin', 'admin_orders');

it('returns only graded orders', function () {
    $this->getJson('/api/admin/orders?include=order_status_history&filter[status]=graded')
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::GRADED,
        ]);
})->group('admin', 'admin_orders');

it('returns only shipped orders', function () {
    $this->getJson('/api/admin/orders?include=order_status_history&filter[status]=shipped')
        ->assertOk()
        ->assertJsonCount(1, ['data'])
        ->assertJsonFragment([
            'order_status_id' => OrderStatus::SHIPPED,
        ]);
})->group('admin', 'admin_orders');

it('returns orders order by asc grand_total', function () {
    $response = $this->getJson('/api/admin/orders?sort=grand_total')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('grand_total')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
})->group('admin', 'admin_orders');

it('returns orders order by desc grand_total', function () {
    $response = $this->getJson('/api/admin/orders?sort=-grand_total')
        ->assertOk();
    $this->assertEquals(
        Order::orderBy('grand_total', 'DESC')->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
})->group('admin', 'admin_orders');

test('orders are filterable by customer first name', function () {
    $user = $this->orders[0]->user;
    $this->getJson('/api/admin/orders?include=customer&filter[customer_name]=' . $user->first_name)
        ->assertOk()
        ->assertJsonCount($user->orders->count(), ['data'])
        ->assertJsonFragment([
            'email' => $user->email,
        ]);
})->group('admin', 'admin_orders');

test('orders are filterable by customer ID', function () {
    $user = $this->orders[0]->user;
    $this->getJson('/api/admin/orders?include=customer&filter[customer_id]=' . $user->id)
        ->assertOk()
        ->assertJsonCount($user->orders->count(), ['data'])
        ->assertJsonFragment([
            'email' => $user->email,
        ]);
})->group('admin', 'admin_orders');

test('an admin can update order notes', function () {
    $response = $this->putJson('/api/admin/orders/' . $this->orders[0]->id . '/notes', [
        'notes' => 'Lorem Ipsum',
    ])->assertOk();
})->group('admin', 'admin_orders');

test('a customer can not update order notes', function () {
    $customerUser = User::factory()->withRole(config('permission.roles.customer'))->create();

    $this->actingAs($customerUser);

    $response = $this->putJson('/api/admin/orders/' . $this->orders[0]->id . '/notes', [
        'notes' => 'Lorem Ipsum',
    ])->assertForbidden();
})->group('admin', 'admin_orders');

test('an admin can get order cards grades', function () {
    Http::fake(['*' => Http::response($this->sampleAgsResponse, 200, [])]);
    $this->getJson('/api/admin/orders/' . $this->orders[1]->id . '/grades')
    ->assertOk();
});

test('a customer can not get order cards grades', function () {
    $customerUser = User::factory()->withRole(config('permission.roles.customer'))->create();

    $this->actingAs($customerUser);

    Http::fake(['*' => Http::response($this->sampleAgsResponse, 200, [])]);

    $this->getJson('/api/admin/orders/' . $this->orders[1]->id . '/grades')
    ->assertForbidden();
});

it('can not get order grades if order is not reviewed', function () {
    Http::fake(['*' => Http::response($this->sampleAgsResponse, 200, [])]);
    $response = $this->getJson('/api/admin/orders/' . $this->orders[0]->id . '/grades');
    $response->assertJsonStructure([ 'error' ]);
    $response->assertJsonPath('error', (new IncorrectOrderStatus)->getMessage());
});
