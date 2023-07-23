import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { connectWallet } from './redux/blockchainAction';
import { BsCheckLg } from 'react-icons/bs'
import { resetError, saveData, signMessage } from './redux/userAction';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Form = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { accountAddress } = useSelector(state => state.blockchain);
  const { user, userLoaded, formValiddated, loading, error, errorMsg } = useSelector(state => state.user);
  const [address, setAddress] = useState('')
  const [addressVerified, setAddressVerified] = useState(false)

  const [name, setName] = useState(null)
  const [secondName, setSecondName] = useState(null)
  const [email, setEmail] = useState(null)
  const [phone, setPhone] = useState(null)
  const [prefix, setPrefix] = useState(null)
  const [direction, setDirection] = useState(null)
  const [city, setCity] = useState(null)
  const [country, setCountry] = useState(null)
  const [zip, setZip] = useState(null)
  const [wallet, setWallet] = useState(null)
  const [imgDocument, setImgDocument] = useState(null)
  const [imgSelfie, setImgSelfie] = useState(null)



  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const handleSubmit = async () => {
    if (addressVerified) {
      try{
      const data = {
        name,
        lastName: secondName,
        email,
        phone: prefix + phone,
        direction,
        city,
        country,
        zip,
        wallet: accountAddress,
        dni: imgDocument
      }
      if (name || secondName || email || phone || prefix || direction || city || country || zip || wallet || imgDocument) {
        dispatch(saveData(accountAddress, data))
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'completa todos los campos',
        })
      }
    }catch(error){
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'completa todos los campos',
      })
      
    }
  }
    else {
      setErrorMsg('Please verify your wallet')
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please verify your wallet',
      })
    }
  }

  const connect = () => {
    dispatch(connectWallet())
  }


  const verifyAddress = () => {
    dispatch(signMessage(accountAddress))
  }

  
  useEffect(() => {
    if (accountAddress) {
      //slice the address
      const sliceAddress = accountAddress.slice(0, 6) + '...' + accountAddress.slice(-4)
      setAddress(sliceAddress)
    }
  }, [accountAddress])

  useEffect(() => {
    if (userLoaded) {
      if (user.verifyWallet) {
        setAddressVerified(true)
      }
    }
  }, [userLoaded])



  useEffect(() => {
    if(userLoaded && formValiddated){
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Formulario enviado correctamente',
        showConfirmButton: false,
        timer: 1500
      })
      setTimeout(() => {
        navigate('/ico')
      }, 1500)

    }
  }, [formValiddated])

  useEffect(() => {
    if (error) {
      
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMsg,
      })
      dispatch(resetError())
    }
  }, [error])


  console.log(errorMsg)


  return (
    <div>
      <header className="App-header text-center my-3">
        <h1> Formulario de Compra AGCA</h1>
      </header>
      <main>
        <div className="container">
          <form className='py-3'>
            <div className='row'>
              <div className="form-group col-6">
                <label htmlFor="name">Nombre</label>
                <input type="text" className="form-control" id="name" placeholder="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={true}
                />
              </div>
              <div className="form-group col-6">
                <label htmlFor="name">Apellido</label>
                <input type="text" className="form-control" id="name" placeholder="Apellido"
                  value={secondName}
                  onChange={(e) => setSecondName(e.target.value)}
                  required={true}
                />
              </div>
            </div>
            <div className='row'>
              <div className="form-group col-6">
                <label htmlFor="email">Email</label>
                <input type="email" className="form-control" id="email" placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={true}
                />
              </div>
              <div className="form-group col-2">
                <label htmlFor="phone">Prefix</label>
                <input type="text" className="form-control" id="phone" placeholder="+57"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  required={true}
                />
              </div>
              <div className="form-group col-4">
                <label htmlFor="phone">Teléfono</label>
                <input type="text" className="form-control" id="phone" placeholder="Teléfono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required={true}
                />
              </div>
            </div>
            <div className='row'>
              <div className="form-group col-12">
                <div className="form-group">
                  <label htmlFor="address">Dirección</label>
                  <input type="text" className="form-control" id="address" placeholder="Dirección"
                    value={direction}
                    onChange={(e) => setDirection(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className="form-group col-6">
                <div className="form-group">
                  <label htmlFor="city">Ciudad</label>
                  <input type="text" className="form-control" id="city" placeholder="Ciudad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}

                  />
                </div>
              </div>
              <div className="form-group col-6">
                <div className="form-group">
                  <label htmlFor="country">País</label>
                  <input type="text" className="form-control" id="country" placeholder="País"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}

                  />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className="form-group col-6">
                <div className="form-group">
                  <label htmlFor="zip">Código Postal</label>
                  <input type="text" className="form-control" id="zip" placeholder="Código Postal"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group col-6">
                <div className="form-group">
                  <label htmlFor="state">Wallet</label>
                  <br />
                  {accountAddress ? (
                    <div className='d-flex'>
                      <p className='mt-2'>{address}</p>
                      {addressVerified ? (
                        <BsCheckLg
                          style={{ color: "green", marginLeft: "10px" }}
                        />) : (
                        <div onClick={verifyAddress}
                          className='btn btn-primary'>verificar</div>
                      )
                      }
                    </div>
                  ) : (


                    <button
                      onClick={connect}
                      type="button" className="btn btn-primary">Connect Wallet
                    </button>

                  )}
                </div>
              </div>
              {/* kyc */}
              <div className='row'>
                <div className="form-group col-6">
                  <div className="form-group">
                    <label htmlFor="kyc">Documento de identidad</label>
                    {imgDocument ? (
                      <div className='d-flex img-upload'>
                        <img src={imgDocument} alt="imgDocument" width='100px' />
                        <div onClick={() => setImgDocument('')}
                          className='btn btn-danger'>X</div>
                      </div>
                    ) : (

                    <input type="file" className="form-control" id="kyc" placeholder="Documento de identidad"
                      onChange={(e) => convertImageToBase64(e.target.files[0]).then((result) => setImgDocument(result))}
                    />
                    )}
                  </div>

                </div>
                {/* <div className="form-group col-6">
                  <div className="form-group">
                    <label htmlFor="kyc">Foto de rostro </label>
                    {imgSelfie ? (
                      <div className='d-flex img-upload'>
                        <img src={imgSelfie} alt="imgSelfie" width='100px' />
                        <div onClick={() => setImgSelfie('')}
                          className='btn btn-danger'>X</div>
                      </div>
                    ) : (
                    <input type="file" className="form-control" id="kyc" placeholder="Documento de identidad"
                      onChange={(e) => convertImageToBase64(e.target.files[0]).then((result) => setImgSelfie(result))}
                    />
                    )}
                  </div>
                </div> */}
              </div>

              <div className='row py-3 d-flex justify-content-center align-item-center w-100'>
                <div className="form-group col-12 w-100 d-flex justify-content-center align-item-center">
                  <button 
                  type="submit" className="btn btn-success w-100"
                  onClick={(e) => {e.preventDefault(); handleSubmit() }}
                  >
                   
                    {loading ? ( <div className="spinner-border text-light ml-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>)
                    : 'Enviar'}
                    
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Form