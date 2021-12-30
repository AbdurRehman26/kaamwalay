import Button from '@mui/material/Button';
import Web3 from 'web3';
import contractAbi from '../../shared/assets/bscContract.json';

const contractAddress = '0x73ffdf2d2afb3def5b10bf967da743f2306a51db';
const agsWallet = '0xb2a7F8Ba330ebE430521Eb13F615Bd8F15bf3c4d';

// @ts-ignore
const web3: any = new Web3(window.web3.currentProvider);
const contract = new web3.eth.Contract(contractAbi, contractAddress);

export function PayWithAGSButton() {
    const tx = {
        // @ts-ignore
        from: ethereum.selectedAddress,
        data: contract.methods.transfer(agsWallet, web3.utils.toWei('1')).encodeABI(),
        to: contractAddress,
    };

    console.log(tx, 'tx');
    async function handleClick() {
        // @ts-ignore
        // @ts-ignore
        ethereum.request({ method: 'eth_requestAccounts' });

        // @ts-ignore
        console.log('address', ethereum.selectedAddress);
        // @ts-ignore
        if (window.ethereum.chainId === '0x38') {
            // @ts-ignore
            try {
                const trans = await web3.eth.sendTransaction(tx);
                console.log(trans, 'trans');
                console.log(trans);
            } catch (error: any) {
                console.log(error);
            }
        } else {
            // @ts-ignore
            ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x38' }] });
        }
    }

    return (
        <Button variant={'contained'} onClick={handleClick}>
            Pay with CC
        </Button>
    );
}
