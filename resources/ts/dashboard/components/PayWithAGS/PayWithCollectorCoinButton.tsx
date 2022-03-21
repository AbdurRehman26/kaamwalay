import Button from '@mui/material/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import contractAbi from '@shared/assets/bscContract.json';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import { useNotifications } from '@shared/hooks/useNotifications';
import { invalidateOrders } from '@shared/redux/slices/ordersSlice';
import { getCurrentContract, getEthereum } from '@dashboard/components/PayWithAGS/utils';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { clearSubmissionState, verifyOrderStatus } from '@dashboard/redux/slices/newSubmissionSlice';

// @ts-ignore
const web3: any = new Web3(window?.web3?.currentProvider);

export function PayWithCollectorCoinButton() {
    const grandTotal = useAppSelector((state) => state.newSubmission.grandTotal);
    const totalInAGS = useAppSelector((state) => state.newSubmission.totalInAgs);
    const orderID = useAppSelector((state) => state.newSubmission.orderID);
    const [isLoading, setIsLoading] = useState(false);
    const configs = useConfiguration();
    const dispatch = useAppDispatch();
    const wallets = {
        // Prod eth mainnet wallet
        ethWallet: configs?.web3EthWallet,
        // Prod binance smart chain wallet
        bscWallet: configs?.web3BscWallet,
        // Staging wallet
        testWallet: configs?.web3TestWallet,
    };
    const notifications = useNotifications();
    const navigate = useNavigate();
    const supportedNetworks = configs?.web3SupportedNetworks.split(',');

    function getRecipientWalletFromNetwork(networkID: number) {
        switch (networkID) {
            case 1:
                return wallets.ethWallet;
            case 4:
                return wallets.testWallet;
            case 56:
                return wallets.bscWallet;
            case 97:
                return wallets.testWallet;
            default:
                return wallets.ethWallet;
        }
    }

    async function handleClick() {
        setIsLoading(true);

        // @ts-ignore
        const currentNetworkID = await web3.eth.net.getId();
        const currentAccounts = await getEthereum().request({ method: 'eth_requestAccounts' });
        const contract = new web3.eth.Contract(contractAbi, getCurrentContract(currentNetworkID, supportedNetworks));
        const balanceResult = await contract.methods.balanceOf(currentAccounts[0]).call();
        const balance = await web3.utils.fromWei(balanceResult, 'ether');

        if (balance <= grandTotal) {
            notifications.error("You don't have enough AGS to finish the payment");
            return;
        }

        try {
            const tx = {
                from: currentAccounts[0],
                data: contract.methods
                    .transfer(getRecipientWalletFromNetwork(currentNetworkID), web3.utils.toWei(String(totalInAGS)))
                    .encodeABI(),
                to: getCurrentContract(currentNetworkID, supportedNetworks),
            };

            web3.eth.sendTransaction(tx, async (err: any, txHash: string) => {
                if (err) {
                    setIsLoading(false);
                    return;
                }
                setIsLoading(true);
                setTimeout(async () => {
                    try {
                        await dispatch(verifyOrderStatus({ orderID, txHash: txHash })).unwrap();
                        dispatch(clearSubmissionState());
                        dispatch(invalidateOrders());
                        setIsLoading(false);
                        navigate(`/submissions/${orderID}/collector-coin/confirmation`);
                    } catch (error: any) {
                        setIsLoading(false);
                        notifications.error('Order payment information is incorrect');
                    }
                }, 8000);
            });
        } catch (error: any) {
            setIsLoading(false);
        }
    }

    return (
        <Button variant={'contained'} disabled={isLoading} onClick={handleClick}>
            {isLoading ? 'Processing Payment...' : 'Pay With Collector Coin'}
        </Button>
    );
}
