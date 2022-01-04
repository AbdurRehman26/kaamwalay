import Button from '@mui/material/Button';
import Web3 from 'web3';
import contractAbi from '@shared/assets/bscContract.json';
import { getCurrentContract } from '@dashboard/components/PayWithAGS/utils';
import { useAppSelector } from '@dashboard/redux/hooks';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { clearSubmissionState } from '@dashboard/redux/slices/newSubmissionSlice';
import { invalidateOrders } from '@shared/redux/slices/ordersSlice';

// @ts-ignore
const web3: any = new Web3(window?.web3?.currentProvider);
const agsWallet = '0xb2a7F8Ba330ebE430521Eb13F615Bd8F15bf3c4d';

export function PayWithCollectorCoinButton() {
    const grandTotal = useAppSelector((state) => state.newSubmission.grandTotal);
    const totalInAGS = useAppSelector((state) => state.newSubmission.totalInAgs);
    const orderID = useAppSelector((state) => state.newSubmission.orderID);
    const [isLoading, setIsLoading] = useState(false);

    const notifications = useNotifications();
    const navigate = useNavigate();

    async function handleClick() {
        // @ts-ignore
        const currentNetworkID = await web3.eth.net.getId();
        // @ts-ignore

        const currentAccounts = await ethereum.request({ method: 'eth_requestAccounts' });
        // @ts-ignore

        const contract = new web3.eth.Contract(contractAbi, getCurrentContract(currentNetworkID));
        // @ts-ignore

        const balanceResult = await contract.methods.balanceOf(currentAccounts[0]).call();
        // @ts-ignore

        const balance = await web3.utils.fromWei(balanceResult, 'ether');

        if (balance <= grandTotal) {
            notifications.error("You don't have enough AGS to finish the payment");
            return;
        }

        try {
            const tx = {
                // @ts-ignore
                from: currentAccounts[0],
                data: contract.methods.transfer(agsWallet, web3.utils.toWei(String(totalInAGS))).encodeABI(),
                to: getCurrentContract(currentNetworkID),
            };

            web3.eth.sendTransaction(tx, (err: any, txHash: string) => {
                dispatch(clearSubmissionState());
                dispatch(invalidateOrders());
                navigate(`/submissions/${orderID}/collector-coin/confirmation`);
            });
        } catch (error: any) {
            console.log(error);
        }
    }

    return (
        <Button variant={'contained'} disabled={isLoading} onClick={handleClick}>
            {isLoading ? 'Processing Payment...' : 'Pay With Collector Coin'}
        </Button>
    );
}
