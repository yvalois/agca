const initialState = {
    loading: false,
    dataloaded: false,
    error: null,
    errorMsg: null,
    usdtContract: null,
    busdContract: null,
    accountAddress: null,
    bnbBalance: 0,
    usdtBalance: 0,
    busdBalance: 0,
    agcaBalance: 0,
    instance: null,
    provider: null,
    signer: null,
    icoContract: null,
    icoReferContract: null,
    AgcaPrice:0
}

const blockchainReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'LOADING':
            return {
                ...state,
                loading: true
            }
        case 'DATA_LOADED':
            return {
                ...state,
                loading:false,
                dataloaded: true,
                usdtContract: action.payload.usdtContract,
                busdContract: action.payload.busdContract,
                accountAddress: action.payload.accountAddress,
                bnbBalance: action.payload.bnbBalance,
                usdtBalance: action.payload.usdtBalance,
                busdBalance: action.payload.busdBalance,
                agcaBalance: action.payload.agcaBalance,
                instance: action.payload.instance,
                provider: action.payload.provider,
                signer: action.payload.signer,
                icoContract: action.payload.icoContract,
                icoReferContract: action.payload.icoReferContract,
                AgcaPrice:action.payload.AgcaPrice
            }
        case 'ERROR':
            return {
                ...state,
                loading: false,
                error: true,
                errorMsg: action.payload
            }
        case 'UPDATE_BALANCE':
            return {
                ...state,
                bnbBalance: action.payload.bnbBalance,
                usdtBalance: action.payload.usdtBalance,
                busdBalance: action.payload.busdBalance,
                agcaBalance: action.payload.agcaBalance,
                accountAddress: action.payload.accountAddress
            }
        case 'LOGOUT':
            return {
                initialState
            }
        default:
            return state
    }
}

export default blockchainReducer

 