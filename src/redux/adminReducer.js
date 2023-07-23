const initialState = {
    loading: false,
    dataloaded: false,
    error: null,
    errorMsg: null,
    isAdmin: false,
    data: null
}

const adminReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'ADMIN_LOADING':
            return {
                ...state,
                loading: true
            }
        case 'ADMIN_LOADED':
            return {
                ...state,
                loading:false,
                dataloaded: true,
                isAdmin: action.payload.isAdmin,
                data: action.payload.data
            }
        case 'ADMIN_ERROR':
            return {
                ...state,
                loading: false,
                error: true,
                errorMsg: action.payload
            }
        case 'ADMIN_CHANGE':
            return {
                initialState,
            }
        default:
            return state
    }
}

export default adminReducer