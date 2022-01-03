import makeStyles from '@mui/styles/makeStyles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@dashboard/redux/hooks';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import contractAbi from '@shared/assets/bscContract.json';
import Web3 from 'web3';
import { Alert } from '@mui/material';
import { networksMap, supportedNetworks } from './utils';
const useStyles = makeStyles(
    () => {
        return {
            mainContainer: {},
            containerHeader: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
                borderBottomStyle: 'solid',
                padding: '16px',
                borderBottomWidth: '1px',
                borderBottomColor: '#E0E0E0',
            },
            detailsContainer: {
                padding: '16px',
                marginTop: '6px',
            },
            metamaskInfo: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                padding: '16px',
                backgroundColor: '#F5F5F5',
            },
            metamaskDescriptionText: {
                fontSize: '14px',
            },
            metamaskIcon: {
                width: '250px',
                height: '250px',
            },
        };
    },
    { name: 'PaymentDetailsContainers' },
);

enum metamaskStatuses {
    notInstalled,
    notConnected,
    connected,
}

// @ts-ignore
const web3: any = new Web3(window?.web3?.currentProvider);

function openMetaMaskExtensionLink() {
    // note: all these conditions are generated using Github Copilot
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

function shortenWalletAddress(address: string) {
    // ex: 0x7FfcFF7C927e268C2d7Af93E07F37F2449EaFE56 -> 0x7Ff...FE56
    const beginning = address.slice(0, 5);
    const ending = address.slice(address.length - 4, address.length);
    return `${beginning}...${ending}`;
}

export function AGSPaymentDetailsContainers() {
    const dispatch = useAppDispatch();

    const classes = useStyles();
    const [metamaskStatus, setMetamaskStatus] = useState<metamaskStatuses>(metamaskStatuses.notConnected);
    const [currentNetworkID, setCurrentNetworkID] = useState<number>(0);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [agsBalance, setAgsBalance] = useState(0);
    let detailsChildren;

    function getCurrentContract(currentNetworkId: number) {
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

    async function updateAgsBalance(walletAddress: string) {
        const currentNetworkID = await web3.eth.net.getId();
        const contract = new web3.eth.Contract(contractAbi, getCurrentContract(currentNetworkID));
        const result = await contract.methods.balanceOf(walletAddress).call();
        let balance = await web3.utils.fromWei(result, 'ether');
        console.log(currentNetworkID, 'currentNetwork');
        setAgsBalance(balance);
        setCurrentNetworkID(currentNetworkID);
    }

    async function handleMetamaskConnect() {
        // @ts-ignore
        const metamaskAccounts = await ethereum.request({ method: 'eth_requestAccounts' });
        if (metamaskAccounts.length > 0) {
            setSelectedAccount(metamaskAccounts[0]);
            setMetamaskStatus(metamaskStatuses.connected);
            updateAgsBalance(metamaskAccounts[0]);
        }
    }

    if (metamaskStatus === metamaskStatuses.connected) {
        detailsChildren = (
            <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'} padding={'16px'}>
                <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'}>
                    <Typography variant={'caption'} sx={{ fontWeight: 'bold' }}>
                        Connected Wallet:{' '}
                    </Typography>
                    <Chip label={shortenWalletAddress(selectedAccount)}></Chip>
                </Box>

                <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'} marginTop={'12px'}>
                    <Typography variant={'caption'} sx={{ fontWeight: 'bold' }}>
                        AGS Balance:
                    </Typography>
                    <Chip label={agsBalance}></Chip>
                </Box>

                <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'} marginTop={'12px'}>
                    <Typography variant={'caption'} sx={{ fontWeight: 'bold' }}>
                        Selected Blockchain:
                    </Typography>
                    <Chip label={networksMap[currentNetworkID]?.chainName}></Chip>
                </Box>
            </Box>
        );
    }

    if (metamaskStatus === metamaskStatuses.notConnected) {
        detailsChildren = (
            <Box className={classes.metamaskInfo}>
                <Avatar src={'https://i.imgur.com/LqNzDWH.png'} sx={{ width: '50px', height: '50px' }} />
                <Typography variant={'subtitle1'} sx={{ fontWeight: 'bold', marginTop: '6px', marginBottom: '6px' }}>
                    Your MetaMask wallet is not connected.
                </Typography>
                <Typography variant={'caption'} className={classes.metamaskDescriptionText}>
                    Please connect your MetaMask wallet to continue.
                </Typography>
                <Button variant={'contained'} onClick={handleMetamaskConnect} sx={{ marginTop: '6px' }}>
                    Connect MetaMask
                </Button>
            </Box>
        );
    }

    // @ts-ignore
    if (!window.ethereum) {
        detailsChildren = (
            <Box className={classes.metamaskInfo}>
                <Avatar
                    src={
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmQsIzCnsojWdCj5hQDYHzFA9mbRUSrZAT8lSoEOTji-Zxavev7NealxycsU_hkXabt_4&usqp=CAU'
                    }
                />
                <Typography variant={'subtitle1'} sx={{ fontWeight: 'bold', marginTop: '6px', marginBottom: '6px' }}>
                    No Metamask Wallet
                </Typography>
                <Typography variant={'caption'} className={classes.metamaskDescriptionText}>
                    Get a MetaMask crypto wallet to pay with Collector Coin
                </Typography>
                <Button variant={'contained'} onClick={openMetaMaskExtensionLink} sx={{ marginTop: '6px' }}>
                    Get MetaMask
                </Button>
            </Box>
        );
    }

    useEffect(() => {
        async function checkIfMetamaskIsConnected() {
            // Check if metamask is installed
            // @ts-ignore
            if (!window.ethereum) {
                setMetamaskStatus(metamaskStatuses.notInstalled);
                return;
            }

            // Check if metamask is connected
            // @ts-ignore
            if (window.ethereum.selectedAddress) {
                setMetamaskStatus(metamaskStatuses.connected);
                handleMetamaskConnect();
            } else {
                setMetamaskStatus(metamaskStatuses.notConnected);
            }
        }
        checkIfMetamaskIsConnected();
    }, [dispatch, metamaskStatus]);

    // @ts-ignore
    if (window.ethereum) {
        // @ts-ignore
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
                setMetamaskStatus(metamaskStatuses.connected);
                handleMetamaskConnect();
            } else {
                setMetamaskStatus(metamaskStatuses.notConnected);
            }
        });

        // @ts-ignore
        window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload();
        });
    }

    return (
        <Paper variant={'outlined'} className={classes.mainContainer}>
            <Box className={classes.containerHeader}>
                <Typography variant={'subtitle1'} sx={{ fontWeight: 'bold' }}>
                    Pay with Collector Coin
                </Typography>
                <Typography variant={'caption'}>
                    For information on Collector Coin and how to buy it visit collectorcoin.com
                </Typography>
                {!supportedNetworks.includes(currentNetworkID) && metamaskStatus === metamaskStatuses.connected ? (
                    <Alert severity="error" sx={{ width: '100%' }}>
                        Collector Coin is only available on Binance Smart Chain & Ethereum
                    </Alert>
                ) : null}
            </Box>
            {/* @ts-ignore*/}
            <Box className={classes.detailsContainer}>{detailsChildren}</Box>
        </Paper>
    );
}
