import Button from '@mui/material/Button';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import contractAbi from '@shared/assets/bscContract.json';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import { useNotifications } from '@shared/hooks/useNotifications';
import { invalidateOrders } from '@shared/redux/slices/ordersSlice';
import { getCurrentContract, getEthereum } from '@dashboard/components/PayWithAGS/utils';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { clearSubmissionState, getTotalInAGS, verifyOrderStatus } from '@dashboard/redux/slices/newSubmissionSlice';

// @ts-ignore
const web3: any = new Web3(window?.ethereum);

export function PayWithCollectorCoinButton() {
    const paymentMethodId = useAppSelector((state) => state.newSubmission.step04Data.paymentMethodId);
    const orderID = useAppSelector((state) => state.newSubmission.orderID);
    const [isLoading, setIsLoading] = useState(false);
    const configs = useConfiguration();
    const dispatch = useAppDispatch();
    const discountedValue = useAppSelector(
        (state) => state.newSubmission.couponState.appliedCouponData.discountedAmount,
    );
    const isCouponApplied = useAppSelector((state) => state.newSubmission.couponState.isCouponApplied);

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
    const supportedNetworks = configs?.web3SupportedNetworks?.split(',') ?? [];
    const appliedCredit = useAppSelector((state) => state.newSubmission.appliedCredit);

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

    async function initiateTransaction(totalInAGS: number) {
        setIsLoading(true);
        // @ts-ignore
        const currentChainId = await web3.eth.net.getId();
        const currentAccounts = await getEthereum().request({ method: 'eth_requestAccounts' });
        const contract = new web3.eth.Contract(contractAbi, getCurrentContract(currentChainId, supportedNetworks));
        const balanceResult = await contract.methods.balanceOf(currentAccounts[0]).call();
        const balance = await web3.utils.fromWei(balanceResult, 'ether');

        if (balance <= totalInAGS) {
            notifications.error("You don't have enough AGS to finish the payment");
            setIsLoading(false);

            return;
        }

        try {
            const tx = {
                from: currentAccounts[0],
                data: contract.methods
                    .transfer(getRecipientWalletFromNetwork(currentChainId), web3.utils.toWei(String(totalInAGS)))
                    .encodeABI(),
                to: getCurrentContract(currentChainId, supportedNetworks),
            };

            web3.eth.sendTransaction(tx, async (err: any, txHash: string) => {
                if (err) {
                    setIsLoading(false);
                    return;
                }
                setIsLoading(true);
                setTimeout(async () => {
                    try {
                        await dispatch(
                            verifyOrderStatus({
                                orderID,
                                txHash: txHash,
                                paymentByWallet: 0,
                                paymentBlockchainNetwork: currentChainId,
                                paymentMethod: {
                                    id: paymentMethodId,
                                },
                            }),
                        ).unwrap();
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
    const fetchTotalInAGS = useCallback(async () => {
        const currentChainId = await web3.eth.net.getId();
        if (currentChainId) {
            return dispatch(
                getTotalInAGS({
                    orderID,
                    chainID: currentChainId,
                    paymentByWallet: appliedCredit,
                    discountedAmount: isCouponApplied ? discountedValue : 0,
                }),
            );
        }

        return dispatch(
            getTotalInAGS({
                orderID,
                chainID: 1,
                paymentByWallet: appliedCredit,
                discountedAmount: isCouponApplied ? discountedValue : 0,
            }),
        );
    }, [appliedCredit, discountedValue, dispatch, isCouponApplied, orderID]);

    const handleClick = () => {
        fetchTotalInAGS().then((result: any) => initiateTransaction(result.payload));
    };

    useEffect(() => {
        fetchTotalInAGS();
    }, [dispatch, orderID, appliedCredit, discountedValue, isCouponApplied, fetchTotalInAGS]);

    return (
        <Button variant={'contained'} disabled={isLoading} onClick={handleClick}>
            {isLoading ? 'Processing Payment...' : 'Pay With Collector Coin'}
        </Button>
    );
}
