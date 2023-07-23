import React from 'react'
import { NavLink } from 'react-router-dom'

const Breadcrumb = () => {
    return (
        <nav className='d-flex justify-content-center  my-1 nav-bcrumb'>
            <NavLink to={'/connect'}>Conectar</NavLink>
            <div className='divider'>---</div>
            <NavLink to={'form'}>Formulario</NavLink>
            <div className='divider'>---</div>
            <NavLink to={'ico'}>Comprar</NavLink>
        </nav>
    )
}

export default Breadcrumb