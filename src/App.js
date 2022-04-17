import './App.css';
import {useEffect, useState} from "react";
import {ethers} from "ethers";
import {abi} from "./abi";
import {contractAddress} from "./contractAddress";

function App() {
    const [currentAccount, setCurrentAccount] = useState(null);
    const checkWalletIsConnected = () => {
        const {ethereum} = window;
        if (!ethereum) {
            console.log('not connect');
        } else {
            console.log('connected');
        }
    }

    const connectWalletHandler = async () => {
        const {ethereum} = window;
        if (!ethereum) console.log('please install metamask');
        else {
            try {
                const accounts = await ethereum.request({method: 'eth_requestAccounts'});
                console.log('accounts connect: ', accounts[0]);
                setCurrentAccount(accounts[0]);
            } catch (err) {
                console.log(err);
            }
        }
    }

    const connectContract = () => {
        const {ethereum} = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            return new ethers.Contract(contractAddress, abi, signer);
        }
        return false;
    }

    const mintNftHandler = async () => {
        try {
            const nftContract = connectContract();
            let nfttx = await nftContract.addNewItem('0x7dF0E91495a750e460B445700C49a423058b2b6B', 1);
            await nfttx.wait();
            console.log(`https://rinkeby.etherscan.io/tx/${nfttx.hash}`);
        } catch (err) {
            console.log(err);
        }
    }

    const allowBuyNftHandler = async () => {
        try {
            const nftContract = connectContract();
            let nfttx = await nftContract.allowBuy(1, 333);
            await nfttx.wait();
            console.log(`https://rinkeby.etherscan.io/tx/${nfttx.hash}`);
        } catch (err) {
            console.log(err);
        }
    }

    const buyNftHandler = async () => {
        try {
            const nftContract = connectContract();
            let nfttx = await nftContract.buy(1, {value: 333});
            await nfttx.wait();
            console.log(`https://rinkeby.etherscan.io/tx/${nfttx.hash}`);
        } catch (err) {
            console.log(err);
        }
    }

    const getOnwerNftHandler = async () => {
        try {
            const nftContract = connectContract();
            let nfttx = await nftContract.ownerOf(1);
            console.log(`Owner of NFT ID=1 is ${nfttx}`);
        } catch (err) {
            console.log(err);
        }
    }

    const connectWalletButton = () => {
        return (
            <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
                Connect Wallet
            </button>
        )
    }

    const mintNftButton = () => {
        return (
            <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
                Mint NFT
            </button>
        )
    }

    const buyNftButton = () => {
        return (
            <button onClick={buyNftHandler} className='cta-button mint-nft-button'>
                buy NFT from other account
            </button>
        )
    }
    const allowBuyNftButton = () => {
        return (
            <button onClick={allowBuyNftHandler} className='cta-button mint-nft-button'>
                allow buy NFT from other account
            </button>
        )
    }
    const getOwnerNftButton = () => {
        return (
            <button onClick={getOnwerNftHandler} className='cta-button mint-nft-button'>
                get owner
            </button>
        )
    }

    useEffect(() => {
        checkWalletIsConnected();
    }, [])
    return (
        <div className="App">
            <header className="App-header">
                {currentAccount ? mintNftButton() : connectWalletButton()}
                {currentAccount && allowBuyNftButton()}
                {currentAccount && buyNftButton()}
                {currentAccount && getOwnerNftButton()}
            </header>
        </div>
    );
}

export default App;
