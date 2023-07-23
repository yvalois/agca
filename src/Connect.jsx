import React, { useEffect, useState } from 'react'
import { connectWallet } from './redux/blockchainAction'
import { signMessage, verifyRefer } from './redux/userAction'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'
const api = import.meta.env.VITE_APP_NODE_ENV === 'production' ? 'https://stingray-app-dnzz9.ondigitalocean.app' : 'http://localhost:3000';


const Connect = () => {
  const navigate = useNavigate()
  const {refer} = useParams()
  const { userLoaded, formValiddated, loading } = useSelector(state => state.user)
  const {referal} = useSelector(state => state.user)
 
  const dispatch = useDispatch()
  const handleConnect = () => {
    dispatch(connectWallet())
  }



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
            onClick={handleConnect}
            >Conectar</button>
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