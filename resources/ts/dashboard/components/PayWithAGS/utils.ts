export const supportedNetworks = [1, 4, 56, 97]; // This will be different on staging & prod

export const networksMap: any = {
    1: {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
    },
    4: {
        chainId: '0x4',
        chainName: 'Rinkeby Test Network',
        nativeCurrency: {
            name: 'Eth',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: ['https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
        blockExplorerUrls: ['https://rinkeby.etherscan.io'],
    },
    56: {
        chainId: '0x38',
        chainName: 'Binance Smart Chain',
        nativeCurrency: {
            name: 'Bnb',
            symbol: 'BNB',
            decimals: 18,
        },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com'],
    },
    97: {
        chainId: '0x61',
        chainName: 'Binance Smart Chain - Testnet',
        nativeCurrency: {
            name: 'tBnb',
            symbol: 'tBNB',
            decimals: 18,
        },
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
        blockExplorerUrls: ['https://testnet.bscscan.com'],
    },
};

export function getCurrentContract(currentNetworkId: number) {
    if (supportedNetworks.includes(currentNetworkId)) {
        return {
            // ETH MainNet
            1: '0x667fd83e24ca1d935d36717d305d54fa0cac991c',
            // ETH TestNet Rinkeby
            4: '0x23863db3e66d94dba2a2ae157de8082cf772b115',
            // BSC MainNet
            56: '0x73ffdf2d2afb3def5b10bf967da743f2306a51db',
            // BSC TestNet
            97: '0xb1f5a876724dcfd6408b7647e41fd739f74ec039',
        }[currentNetworkId];
    } else {
        return '';
    }
}
