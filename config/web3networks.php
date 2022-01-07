<?php

return [
    1 => [
        'chain_id' => '0x1',
        'chain_name' => 'Ethereum Mainnet',
        'native_currency' => [
            'name' => 'Eth',
            'symbol' => 'ETH',
            'decimals' => 18,
        ],
        'rpc_urls' => ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
        'is_testnet' => false,
        'collector_coin_token' => '0x667fd83e24ca1d935d36717d305d54fa0cac991c',
        'collector_coin_wallet' => env('ETH_WALLET'),
    ],
    4 => [
        'chain_id' => '0x4',
        'chain_name' => 'Rinkeby Test Network',
        'native_currency' => [
            'name' => 'Eth',
            'symbol' => 'ETH',
            'decimals' => 18,
        ],
        'rpc_urls' => ['https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
        'block_explorer_urls' => ['https://rinkeby.etherscan.io'],
        'is_testnet' => true,
        'collector_coin_token' => '0x23863db3e66d94dba2a2ae157de8082cf772b115',
        'collector_coin_wallet' => env('TEST_WALLET'),
    ],
    56 => [
        'chain_id' => '0x38',
        'chain_name' => 'Binance Smart Chain',
        'native_currency' => [
            'name' => 'Bnb',
            'symbol' => 'BNB',
            'decimals' => 18,
        ],
        'rpc_urls' => ['https://bsc-dataseed.binance.org/'],
        'block_explorer_urls' => ['https://bscscan.com'],
        'is_testnet' => false,
        'collector_coin_token' => '0x73ffdf2d2afb3def5b10bf967da743f2306a51db',
        'collector_coin_wallet' => env('BSC_WALLET'),
    ],
    97 => [
        'chain_id' => '0x61',
        'chain_name' => 'Binance Smart Chain - Testnet',
        'native_currency' => [
            'name' => 'tBnb',
            'symbol' => 'tBNB',
            'decimals' => 18,
        ],
        'rpc_urls' => ['https://data-seed-prebsc-1-s1.binance.org:8545'],
        'block_explorer_urls' => ['https://testnet.bscscan.com'],
        'is_testnet' => true,
        'collector_coin_token' => '0xb1f5a876724dcfd6408b7647e41fd739f74ec039',
        'collector_coin_wallet' => env('TEST_WALLET'),
    ],

];
