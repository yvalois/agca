import axios from 'axios';

const api = import.meta.env.VITE_APP_NODE_ENV === 'production' ? 'https://stingray-app-dnzz9.ondigitalocean.app' : 'http://localhost:3000';

const adminLoading = () => {
    return {
        type: 'ADMIN_LOADING'
    };
}

const adminLoaded = (payload) => {
    return {
        type: 'ADMIN_LOADED',
        payload,
    };
}

const adminError = (payload) => {
    return {
        type: 'ADMIN_ERROR',
        payload,
    };
}

export const loadAdmin = () => async(dispatch, getState) => {
    dispatch(adminLoading());
    try{
    const token = localStorage.getItem('token')
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    const res = await axios.get(`${api}/user/getAllUsers`, {headers})

    dispatch(adminLoaded({
        isAdmin: res.data.isAdmin,
        data : res.data.users
    }))
    }
    catch(err){
        dispatch(adminError(err.response.data));
        console.log(err)
    }
    }



