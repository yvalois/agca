import React, { useEffect, useState } from 'react'
import { connectWallet } from './redux/blockchainAction'
import { signMessage, verifyRefer } from './redux/userAction'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'
import { useWeb3Modal } from '@web3modal/react'
import { useAccount, useConnect, useDisconnect, useSignMessage, useNetwork, useSwitchNetwork  } from 'wagmi'
import {getEthersProvider,getEthersSigner } from './utils/ethers.js'
import {  getPublicClient, getWalletClient } from '@wagmi/core'


const api = import.meta.env.VITE_APP_NODE_ENV === 'production' ? 'https://stingray-app-dnzz9.ondigitalocean.app' : 'http://localhost:3000';


const Connect = () => {
  const navigate = useNavigate()
  const {refer} = useParams()
  const { userLoaded, formValiddated, loading } = useSelector(state => state.user)
  const { accountAddress } = useSelector(state => state.blockchain)

  const {referal} = useSelector(state => state.user)
  const [is, setIs] = useState(false)
  const dispatch = useDispatch()





  const [referAddress, setReferAddress] = useState('')
  const getreferAccount = async () => {
    const { data } = await axios.get(`${api}/refer/getReferAccount/${refer}`)
    setReferAddress(data)

  }
  useEffect(() => {
    if(refer){
      getreferAccount()
    }
  }, [refer])



  useEffect(() => {
    if (userLoaded && refer) {
      dispatch(verifyRefer(refer))
    }
  }, [userLoaded])

  useEffect(() => {
  
    if(userLoaded && formValiddated){
      Swal.fire({
        title: 'Formulario validado',
        text: 'Puedes continuar con la compra',
        icon: 'success',
        confirmButtonText: 'Ok'
    })
    setTimeout(() => {
    navigate('/ico')
    }, 2000)
    }
    if(userLoaded && !formValiddated){
      Swal.fire({
        title: 'Login exitoso',
        text: 'Debes validar el formulario para continuar',
        icon: 'success',
        confirmButtonText: 'Ok'
    })
    setTimeout(() => {
    navigate('/form')
    }, 2000)
    }

  }, [userLoaded, formValiddated])


  
  const { isOpen, open, close, setDefaultChain } = useWeb3Modal() 
  const { address, isConnecting, isDisconnected, isConnected } = useAccount()

  const {connect, connectors, error, isLoading, pendingConnector} = useConnect()
  const { disconnect } = useDisconnect()
  const {chain} = useNetwork()

const handleConnect = async() => {
  const signer = await getEthersSigner(chain?.id)
  const provider =  getEthersProvider(chain?.id)
  dispatch(connectWallet(accountAddress, signer, provider))
  window.localStorage.removeItem("wc@2:core:0.3//keychain")

}


  const switchChain = async()=> {
    const walletClient = await getWalletClient(chain?.id)
    await walletClient?.switchChain({ id: 56 })

  }


  const abrir =()=>{
    if(!isConnected){
      open()
    }
  }


  return (
    <div className='container-fluid'>
        <div className='text-center my-3'>
            <h1>Alejandria Glamping Club ICO - AGCA</h1>
        </div>
        <div className='text-center my-4'>
            <h2>Conecta tu wallet</h2>
            <br/>
            {loading && 
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            }
            {!loading &&
            <button className='btn btn-primary'
            onClick={abrir}
            >{isConnected && accountAddress === null ? 'Conectando...' : 'Conectar'}</button>
            }
        </div>
        {refer &&   
        <div>
            <p>Referido por: <strong>{referAddress}</strong></p> 
        </div>
        }
    </div>
  )
}

export default Connect