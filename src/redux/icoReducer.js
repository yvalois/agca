const initialState = {
    loading: false,
    dataloaded: false,
    error: null,
    errorMsg: null,
    agcaInContract: 0,
    bnbprice: 0,
    agcaReferInContract: 0,
}

const icoReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'ICO_LOADING':
            return {
                ...state,
                loading: true
            }
        case 'ICO_LOADED':
            return {
                ...state,
                loading:false,
                dataloaded: true,
                agcaInContract: action.payload.agcaInContract,
                bnbprice: action.payload.bnbprice,
                agcaReferInContract: action.payload.agcaReferInContract
            }
        case 'ICO_ERROR':
            return {
                ...state,
                loading: false,
                error: true,
                errorMsg: action.payload
            }
        case 'ICO_UPDATE_BALANCE':
            return {
                ...state,
                agcaInContract: action.payload.agcaInContract,
                bnbprice: action.payload.bnbprice,
                agcaReferInContract: action.payload.agcaReferInContract
            }
        default:
            return state
    }
}

export default icoReducer