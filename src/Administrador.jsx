import React from 'react'
import { useSelector } from 'react-redux'

const Administrador = () => {
    const {data, dataloaded} = useSelector(state => state.admin)

    const openPicture = (picture) => {
        //open in other tab
        window.open(picture)
    }

    const sliceWalletAddress = (address) => {
        return address.slice(0, 6) + '...' + address.slice(-4)
    }

    const busd = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
    const sbwy = '0x49A19A277C463F26f6a85B9aa009cBF9894B7f03'

    // const fetchBLpPrice = async () => {
    //     const response  = await fetch(
    //         `https://api.1inch.exchange/v3.0/56/quote?fromTokenAddress=${sbwy}&toTokenAddress=${busd}&amount=1`
    //     )
    //     const data = await response.json()
    //     console.log('data', data)
    // }




  return (
    <div className='container'>
        <div className='title-admin my-2 text-center'>
            <h3>Registro de compras</h3>
      
        </div>
        <div className='container-admin'>
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th scope='col'>#</th>
                        <th scope='col'>Nombre</th>
                        <th scope='col'>wallet</th>
                        <th scope='col'>Correo</th>
                        <th scope='col'>Dirección</th>
                        <th scope='col'>Pais</th>
                        <th scope='col'>Teléfono</th>
                        <th scope='col'>AGCA</th>
                        <th scope='col'>dni</th>
                    </tr>
                </thead>
                <tbody>
                    {dataloaded && data.map((user, index) => (
                        <tr key={index}>
                            <th scope='row'>{index + 1}</th>
                            <td>{user.name +' '+ user.lastName}</td>
                            <td>{sliceWalletAddress(user.wallet)}</td>
                            <td>{user.email}</td>
                            <td>{user.direction}</td>
                            <td>{user.country}</td>
                            <td>{user.phone}</td>
                            <td>{user.tokensBuyed}</td>
                            <td>{<button className='btn btn-primary' onClick={() => openPicture(user.dni)}>Ver</button>}</td>
                  
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default Administrador