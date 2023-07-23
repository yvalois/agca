import { ethers } from "ethers";
import icoAbi from "../abi/ico.json";
import icoReferAbi from "../abi/abiIcoRefer.json";
import erc20Abi from "../abi/abiERC20.json";
import {contract} from "./blockchainRoutes";

const router = contract();
const ICO_ADDRESS = router.icoContract;
const ICO_REFER_ADDRESS = router.icoReferContract;
const AGCA_ADDRESS = router.agcaContract;
const RPC = router.RPC_URL;

const icoLoading = () => {
    return {
        type: "ICO_LOADING",
    };
}

const icoLoaded = (payload) => {
    return {
        type: "ICO_LOADED",
        payload,
    };
}

const icoError = (payload) => {
    return {
        type: "ICO_ERROR",
        payload,
    };
}

const icoUpdateBalance = (payload) => {
    return {
        type: "ICO_UPDATE_BALANCE",
        payload,
    };
}

export const loadIco = () => {
    return async (dispatch, getState) => {
        dispatch(icoLoading());
        try {
        const provider = new ethers.providers.JsonRpcProvider(RPC);
        const icocontract = new ethers.Contract(ICO_ADDRESS, icoAbi, provider);
        const icoReferContract = new ethers.Contract(ICO_ADDRESS, icoReferAbi, provider);
        const agcacontract = new ethers.Contract(AGCA_ADDRESS, erc20Abi, provider);
        const agcaBalance = await agcacontract.balanceOf(ICO_ADDRESS);
        const agcaReferBalance = await agcacontract.balanceOf(ICO_ADDRESS);

        const bnbprice = await icocontract.fetchPrice()
        const agcaInContract = parseFloat(ethers.utils.formatUnits(agcaBalance, 18));
        const agcaReferInContract = parseFloat(ethers.utils.formatUnits(agcaReferBalance, 18));
        const bnbpriceInContract = parseFloat(ethers.utils.formatUnits(bnbprice, 8));

        dispatch(icoLoaded({
            agcaInContract: agcaInContract,
            agcaReferInContract: agcaReferInContract,
            bnbprice: bnbpriceInContract
        }
        ));

        }catch(error) {
            dispatch(icoError(error));
        }
    }
}
