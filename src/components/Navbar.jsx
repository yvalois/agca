import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { loadAdmin } from '../redux/adminActions'
import { connectWallet } from '../redux/blockchainAction'
import { signMessage } from '../redux/userAction'

const Navbar = () => {
  const { accountAddress } = useSelector(state => state.blockchain)
 const {isAdmin} = useSelector(state => state.admin)
  const { userLoaded } = useSelector(state => state.user)

  const dispatch = useDispatch()
  const handleConnect = () => {
    dispatch(connectWallet())
  }


  const [address, setAddress] = useState('')



  useEffect(() => {
    if (accountAddress) {
      //slice the address to show only the first 6 and last 4 characters
      const slicedAddress = accountAddress.slice(0, 6) + '...' + accountAddress.slice(-4)
      setAddress(slicedAddress)
    }
  }, [accountAddress])

  useEffect(() => {
    if(accountAddress && !userLoaded) {
      dispatch(signMessage(accountAddress))
    }
  }, [accountAddress, userLoaded])

  useEffect(() => {
    if (accountAddress && userLoaded) {
      dispatch(loadAdmin())
    }
  }, [accountAddress, userLoaded])


  return (
    <nav className="navbar navbar-expand-md bg-dark navbar-dark">
      <div className="container">
        <a className="navbar-brand fw-bold" href="#">AGCA</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"  aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAdmin && (
              <>
          <li className="nav-item">
              <NavLink className="nav-link" to="/">Formulario</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/ico">ICO</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin">Administrador</NavLink>
            </li>
            </>
            )}
            <li className="nav-item">
              {accountAddress && userLoaded ? (
                <p className="nav-link">{address}</p>
              ) : (
                <button
                  onClick={handleConnect}
                  className='btn btn-primary nav-link'> Connect </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar