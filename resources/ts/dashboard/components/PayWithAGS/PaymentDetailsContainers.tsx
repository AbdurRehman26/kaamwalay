import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';
import contractAbi from '@shared/assets/bscContract.json';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import { useAppDispatch } from '@dashboard/redux/hooks';
import { getEthereum, networksMap, openMetaMaskExtensionLink, shortenWalletAddress } from './utils';

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

function getCurrentContract(currentNetworkId: string, incomingSupportedNetworks: string[]) {
    if (incomingSupportedNetworks.includes(currentNetworkId)) {
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
export function AGSPaymentDetailsContainers() {
    const dispatch = useAppDispatch();
    const classes = useStyles();
    const [metamaskStatus, setMetamaskStatus] = useState<metamaskStatuses>(metamaskStatuses.notConnected);
    const [currentNetworkID, setCurrentNetworkID] = useState<number>(0);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [agsBalance, setAgsBalance] = useState(0);
    const configs = useConfiguration();
    let detailsChildren;
    const supportedNetworks = configs?.web3SupportedNetworks.split(',');

    const updateAgsBalance = useCallback(
        async (walletAddress: string) => {
            const currentNetworkID = await web3.eth.net.getId();
            const destinationContract = getCurrentContract(String(currentNetworkID), supportedNetworks);
            if (destinationContract) {
                const contract = new web3.eth.Contract(contractAbi, destinationContract);
                const result = await contract.methods.balanceOf(walletAddress).call();
                const balance = await web3.utils.fromWei(result, 'ether');
                setAgsBalance(balance);
                setCurrentNetworkID(currentNetworkID);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const handleMetamaskConnect = useCallback(async () => {
        const metamaskAccounts = await getEthereum().request({ method: 'eth_requestAccounts' });
        if (metamaskAccounts.length > 0) {
            setSelectedAccount(metamaskAccounts[0]);
            setMetamaskStatus(metamaskStatuses.connected);
            updateAgsBalance(metamaskAccounts[0]);
        }
    }, [updateAgsBalance]);

    if (metamaskStatus === metamaskStatuses.connected) {
        if (!agsBalance) {
            detailsChildren = <CircularProgress />;
        } else {
            detailsChildren = (
                <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'} padding={'16px'}>
                    <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'}>
                        <Typography variant={'caption'} sx={{ fontWeight: 'bold' }}>
                            Connected Wallet:{' '}
                        </Typography>
                        <Chip label={shortenWalletAddress(selectedAccount)} />
                    </Box>

                    <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'} marginTop={'12px'}>
                        <Typography variant={'caption'} sx={{ fontWeight: 'bold' }}>
                            AGS Balance:
                        </Typography>
                        <Chip label={agsBalance} />
                    </Box>

                    <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'} marginTop={'12px'}>
                        <Typography variant={'caption'} sx={{ fontWeight: 'bold' }}>
                            Selected Blockchain:
                        </Typography>
                        <Chip label={networksMap[currentNetworkID]?.chainName} />
                    </Box>
                </Box>
            );
        }
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

    if (!getEthereum()) {
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
            if (!getEthereum()) {
                setMetamaskStatus(metamaskStatuses.notInstalled);
                return;
            }
            // @ts-ignore
            if (window.ethereum.selectedAddress) {
                setMetamaskStatus(metamaskStatuses.connected);
                handleMetamaskConnect();
            } else {
                setMetamaskStatus(metamaskStatuses.notConnected);
            }
        }
        checkIfMetamaskIsConnected();
    }, [dispatch, metamaskStatus, handleMetamaskConnect]);

    if (getEthereum()) {
        // @ts-ignore
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
                setMetamaskStatus(metamaskStatuses.connected);
                handleMetamaskConnect();
            } else {
                setMetamaskStatus(metamaskStatuses.notConnected);
            }
        });

        getEthereum().on('chainChanged', () => {
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
                {!supportedNetworks?.includes(String(currentNetworkID)) &&
                metamaskStatus === metamaskStatuses.connected &&
                currentNetworkID !== 0 ? (
                    <Alert severity="error" sx={{ width: '100%' }}>
                        Collector Coin is only available on Binance Smart Chain & Ethereum
                    </Alert>
                ) : null}
            </Box>
            <Box className={classes.detailsContainer}>{detailsChildren}</Box>
        </Paper>
    );
}
