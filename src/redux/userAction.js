import axios from 'axios';
import { ethers } from 'ethers';
import store from './store';

 const api = import.meta.env.VITE_APP_NODE_ENV === 'production' ? 'https://stingray-app-dnzz9.ondigitalocean.app' : 'http://localhost:3000';


const userloading = () => {
    return {
        type: 'USER_LOADING'
    }
}

const userloaded = (payload) => {
    return {
        type: 'USER_LOADED',
        payload
    }
}

const referalLoaded = (payload) => {
    return {
        type: 'REFERAL_LOADED',
        payload
    }
}

const usererror = (payload) => {
    return {
        type: 'USER_ERROR',
        payload
    }
}

export const resetError = () => {
    return {
        type: 'SET_ERROR_FALSE'
    }
}

export const signMessage = (metaAddress) => async (dispatch) => {
    dispatch(userloading())
    try {
     
        const getMessage = await axios.get(`${api}/user/auth/${metaAddress.toLowerCase()}`)

        const message = getMessage.data
      
        const { accountAddress, instance, provider, signer } = store.getState().blockchain

        const signature = await instance.request({
            method: "eth_signTypedData",
            params: [message, accountAddress],
            from: accountAddress,
        });

        const res = await axios.get(`${api}/user/verify/${message[1].value}/${signature}`)  


        dispatch(userloaded({
            user: res.data.user, 
            formValiddated: res.data.formValiddated,
            referal: res.data.reference,
            referer: res.data.referer
        }))

        //save token to local storage
        if (res.data.token) {
            localStorage.setItem('token', res.data.token)
        }
    } catch (err) {
        dispatch(usererror(err))
        console.log(err)
    }
}

export const saveData = (address, data) => async (dispatch) => {
    dispatch(userloading())
    try {
        const res = await axios.post(`${api}/user/savedata/${address}`, data)
        console.log("data received fomr save", res.data)
        dispatch(userloaded({
            user: res.data.user,
            formValiddated: res.data.formValiddated,
            referal: res.data.reference
        }))
    } catch (err) {
        dispatch(usererror(err.request.response))
    }
}


export const buyToken = (amount) => async (dispatch) => {
    dispatch(userloading())
    console.log("amount", amount)
    try {
        const token = localStorage.getItem('token')
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        const res = await axios.post(`${api}/user/buyTokens`, { amount }, { headers })
        dispatch(userloaded(res.data))
    } catch (err) {
        dispatch(usererror(err))
        console.log(err)
    }
}

export const createReferCode =() => async (dispatch) => {
    dispatch(userloading())
    try {
        console.log("create refer code")
        const token = localStorage.getItem('token')
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        const res = await axios.post(`${api}/refer/createReferCode`, {}, { headers })
        console.log("refer code", res.data)
        dispatch(referalLoaded(res.data))
    } catch (err) {
        dispatch(usererror(err))
        console.log(err)
    }
}

export const verifyRefer = (referCode) => async (dispatch) => {
    dispatch(userloading())
    try {
        const token = localStorage.getItem('token')
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        const res = await axios.post(`${api}/refer/signInByRefer`, { referCode }, { headers })
        dispatch(referalLoaded(res.data))
    } catch (err) {
        dispatch(usererror(err.response.data))
        console.log(err)
    }
}