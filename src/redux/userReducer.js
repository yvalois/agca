const initialState = {
    user: [],
    loading: false,
    error: false,
    errorMsg: null,
    userLoaded: false,
    formValiddated: false,
    referal: [],
    referer: null
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'USER_LOADING':
            return {
                ...state,
                loading: true
            }
        case 'USER_LOADED':
            return {
                ...state,
                user: action.payload.user,
                loading: false,
                userLoaded: true,
                formValiddated: action.payload.formValiddated,
                referal: action.payload.referal,
                referer: action.payload.referer
            }
        case 'REFERAL_LOADED':
            return {
                ...state,
                referal: action.payload
            }
        case 'USER_ERROR':
            return {
                ...state,
                errorMsg: action.payload,
                loading: false,
                error: true
            }
        case 'SET_ERROR_FALSE':
            return {
                ...state,
                error: false,
                errorMsg: null
            }
        case 'USER_CHANGE':
            return {
                initialState,
            }
        default:
            return state
    }
}

export default userReducer