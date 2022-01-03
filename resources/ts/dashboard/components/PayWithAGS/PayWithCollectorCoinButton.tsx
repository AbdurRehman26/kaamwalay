import Button from '@mui/material/Button';
import Web3 from 'web3';
import contractAbi from '@shared/assets/bscContract.json';
import { getCurrentContract } from '@dashboard/components/PayWithAGS/utils';

// @ts-ignore
const web3: any = new Web3(window?.web3?.currentProvider);
const agsWallet = '0xb2a7F8Ba330ebE430521Eb13F615Bd8F15bf3c4d';

export function PayWithCollectorCoinButton() {
    async function handleClick() {
        const currentNetworkID = await web3.eth.net.getId();
        const contract = new web3.eth.Contract(contractAbi, getCurrentContract(currentNetworkID));
        try {
            const tx = {
                // @ts-ignore
                from: ethereum.selectedAddress,
                data: contract.methods.transfer(agsWallet, web3.utils.toWei('1')).encodeABI(),
                to: getCurrentContract(currentNetworkID),
            };
            web3.eth.sendTransaction(tx);
            console.log('success');
        } catch (error: any) {
            console.log(error);
        }
    }

    return (
        <Button variant={'contained'} onClick={handleClick}>
            Pay With Collector Coin
        </Button>
    );
}
