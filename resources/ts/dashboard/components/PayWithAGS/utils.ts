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

export function getCurrentContract(currentNetworkId: string, incomingSupportedNetworks: string[]) {
    if (!incomingSupportedNetworks.includes(currentNetworkId.toString())) {
        return '';
    }

    return {
        // ETH MainNet
        1: '0x667fd83e24ca1d935d36717d305d54fa0cac991c',
        // ETH TestNet Rinkebys
        4: '0x23863db3e66d94dba2a2ae157de8082cf772b115',
        // BSC MainNet
        56: '0x73ffdf2d2afb3def5b10bf967da743f2306a51db',
        // BSC TestNet
        97: '0xb1f5a876724dcfd6408b7647e41fd739f74ec039',
    }[currentNetworkId];
}

export function shortenWalletAddress(address: string) {
    // ex: 0x7FfcFF7C927e268C2d7Af93E07F37F2449EaFE56 -> 0x7Ff...FE56
    const beginning = address.slice(0, 5);
    const ending = address.slice(address.length - 4, address.length);
    return `${beginning}...${ending}`;
}

export function shortenTxnHash(address: string) {
    // ex: 0x7FfcFF7C927e268C2d7Af93E07F37F2449EaFE56 -> 0x7Ff...FE56
    const beginning = address.slice(0, 10);
    const ending = address.slice(address.length - 8, address.length);
    return `${beginning}...${ending}`;
}

export function openMetaMaskExtensionLink() {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
    const isOpera = navigator.userAgent.toLowerCase().indexOf('opr') > -1;
    const isEdge = navigator.userAgent.toLowerCase().indexOf('edge') > -1;
    const isBrave = navigator.userAgent.toLowerCase().indexOf('brave') > -1;

    if (isChrome || isBrave) {
        window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn', '_blank');
    }
    if (isFirefox) {
        window.open('https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/', '_blank');
    }
    // For Safari MetaMask isn't available, so we'll take the user to the homepage to check the available options
    if (isSafari) {
        window.open('https://metamask.io/', '_blank');
    }
    if (isOpera) {
        window.open('https://addons.opera.com/en/extensions/details/metamask/', '_blank');
    }
    if (isEdge) {
        window.open(
            'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm?hl=en-US',
            '_blank',
        );
    }
}

export function getEthereum() {
    // @ts-ignore
    if (window.ethereum) {
        // @ts-ignore
        return window.ethereum;
    }
}
