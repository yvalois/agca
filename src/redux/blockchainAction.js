import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { contract } from "./blockchainRoutes";
import erc20Abi from '../abi/abiERC20.json';
import icoAbi from '../abi/ico.json';
import icoReferAbi from '../abi/abiIcoRefer.json';


const router = contract();

const BUSD_ADDRESS = router.busdContract;
const USDT_ADDRESS = router.usdtContract;
const AGCA_ADDRESS = router.agcaContract;
const ICO_ADDRESS = router.icoContract;
const ICO_REFER_ADDRESS = router.icoReferContract;
const RPC_URL = router.RPC_URL;

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            rpc: {
                56: RPC_URL,
                97: RPC_URL
            },
        },
    },
};

const web3Modal = new Web3Modal({
    disableInjectedProvider: false,
    cacheProvider: true,
    providerOptions
});

const loading = () => ({
    type: 'LOADING'
})

const dataLoaded = (payload) => ({
    type: 'DATA_LOADED',
    payload
})

const error = (payload) => ({
    type: 'ERROR',
    payload
})

const updateBalance = (payload) => ({
    type: 'UPDATE_BALANCE',
    payload
})

const userChange = () => ({
    type: 'USER_CHANGE',

})

const adminChange = () => ({
    type: 'ADMIN_CHANGE',
})

export const connectWallet = () => async (dispatch) => {
    dispatch(loading())
    try {
        const instance = await web3Modal.connect(providerOptions);
        const provider = new ethers.providers.Web3Provider(instance);
        const signer = provider.getSigner();
        
        const accounts = await provider.listAccounts();

        const networkId = await provider.getNetwork();

        if (import.meta.env.VITE_APP_NODE_ENV === 'production' && networkId.chainId === 56 ||
        import.meta.env.VITE_APP_NODE_ENV === 'development' && networkId.chainId === 97) {

            const busdContract = new ethers.Contract(BUSD_ADDRESS, erc20Abi, signer);
            const usdtContract = new ethers.Contract(USDT_ADDRESS, erc20Abi, signer);
            const agcaContract = new ethers.Contract(AGCA_ADDRESS, erc20Abi, signer);
            const icoContract = new ethers.Contract(ICO_ADDRESS, icoAbi, signer);
            //const icoReferContract = new ethers.Contract(ICO_REFER_ADDRESS, icoReferAbi, signer);

            

            const busdBalance = await busdContract.balanceOf(accounts[0]);
            const usdtBalance = await usdtContract.balanceOf(accounts[0]);
            const agcaBalance = await agcaContract.balanceOf(accounts[0]);

            const bnbBalance = await provider.getBalance(accounts[0]);

            const busdBalanceFormatted = parseFloat(ethers.utils.formatUnits(busdBalance, 18)).toFixed(4);
            const usdtBalanceFormatted = parseFloat(ethers.utils.formatUnits(usdtBalance, 18)).toFixed(4);
            const agcaBalanceFormatted = parseFloat(ethers.utils.formatUnits(agcaBalance, 18)).toFixed(4);
            const bnbBalanceFormatted = parseFloat(ethers.utils.formatUnits(bnbBalance, 18)).toFixed(4);
            const AgcaPrice = await icoContract.AGCA_PRICE()
            dispatch(dataLoaded({
                usdtContract,
                busdContract,
                accountAddress: accounts[0],
                bnbBalance: bnbBalanceFormatted,
                usdtBalance: usdtBalanceFormatted,
                busdBalance: busdBalanceFormatted,
                agcaBalance: agcaBalanceFormatted,
                instance: instance,
                provider: provider,
                signer: signer,
                icoContract: icoContract,
                AgcaPrice
                //icoReferContract: icoReferContract,
            }))
        
            instance.on('accountsChanged', async(accounts) => {
                const busdBalance = await busdContract.balanceOf(accounts[0]);
                const usdtBalance = await usdtContract.balanceOf(accounts[0]);
                const bnbBalance = await provider.getBalance(accounts[0]);
                const agcaBalance = await agcaContract.balanceOf(accounts[0]);
                

                const busdBalanceFormatted = parseFloat(ethers.utils.formatUnits(busdBalance, 18)).toFixed(4);
                const usdtBalanceFormatted = parseFloat(ethers.utils.formatUnits(usdtBalance, 18)).toFixed(4);
                const bnbBalanceFormatted = parseFloat(ethers.utils.formatUnits(bnbBalance, 18)).toFixed(4);
                const agcaBalanceFormatted = parseFloat(ethers.utils.formatUnits(agcaBalance, 18)).toFixed(4);


                dispatch(updateBalance({
                    bnbBalance: bnbBalanceFormatted,
                    usdtBalance: usdtBalanceFormatted,
                    busdBalance: busdBalanceFormatted,
                    accountAddress: accounts[0],
                    agcaBalance: agcaBalanceFormatted

                }))
                dispatch(userChange())
                dispatch(adminChange())
            })
        } else {
            if (import.meta.env.VITE_APP_NODE_ENV === 'production') {
                try {
                    await provider.provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: `0x${Number(56).toString(16)}` }],
                    })
                } catch (switchError) {
                    if (switchError.code === 4902) {
                        try {
                            await provider.provider.request({
                                method: 'wallet_addEthereumChain',
                                params: [{
                                    chainId: `0x${Number(56).toString(16)}`,
                                    chainName: 'Binance Smart Chain Mainnet',
                                    nativeCurrency: {
                                        name: 'BNB',
                                        symbol: 'bnb',
                                        decimals: 18,
                                    },
                                    rpcUrls: [RPC_URL],
                                    blockExplorerUrls: ['https://bscscan.com'],
                                }],
                            })
                        } catch (addError) {
                            console.log(addError)
                        }
                    }
                }
            }
            if (import.meta.env.VITE_APP_NODE_ENV === 'development') {
                try {
                    await provider.provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: `0x${Number(97).toString(16)}` }],
                    })
                } catch (switchError) {
                    if (switchError.code === 4902) {
                        try {
                            await provider.provider.request({
                                method: 'wallet_addEthereumChain',
                                params: [{
                                    chainId: `0x${Number(97).toString(16)}`,
                                    chainName: 'Binance Smart Chain Testnet',
                                    nativeCurrency: {
                                        name: 'BNB',
                                        symbol: 'bnb',
                                        decimals: 18,
                                    },
                                    rpcUrls: [RPC_URL],
                                    blockExplorerUrls: ['https://testnet.bscscan.com'],
                                }],
                            })
                        } catch (addError) {
                            console.log(addError)
                        }
                    }
                }
            }
        }
    } catch (err) {
        dispatch(error(err))
    }
}



