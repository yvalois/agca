import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BNB from './assets/bnb.png'
import BUSD from './assets/busd.png'
import USDT from './assets/usdt.png'
import metamask from './assets/MetaMask.png'
import { contract } from './redux/blockchainRoutes'
import { loadIco } from './redux/icoActions'
import { ethers } from 'ethers'
import Swal from 'sweetalert2'
import { buyToken, createReferCode } from './redux/userAction'
import { useNavigate } from 'react-router-dom'

const Ico = () => {

    const navigate = useNavigate()
    const router = contract()
    const dispatch = useDispatch()
    const { accountAddress, usdtBalance, busdBalance, agcaBalance, bnbBalance, instance, icoContract, icoReferContract, usdtContract, busdContract, AgcaPrice } = useSelector(state => state.blockchain)
    const { user, formValiddated, referal, referer } = useSelector(state => state.user)
    const { dataloaded, agcaInContract, bnbprice, agcaReferInContract } = useSelector(state => state.ico)
    useEffect(() => {
        if (!formValiddated) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ingrese una cuenta validada para continuar',

            })
            setTimeout(() => {
                navigate('/connect')
            }, 2000)
        }
    }, [formValiddated])

    const [choiceToken, setChoiceToken] = useState('')
    const [amount, setAmount] = useState(0)
    const [calculatePrice, setCalculatePrice] = useState(0)
    const [busdAllowance, setBusdAllowance] = useState(0)
    const [usdtAllowance, setUsdtAllowance] = useState(0)
    const [busdRefAllowance, setBusdRefAllowance] = useState(0)
    const [usdtRefAllowance, setUsdtRefAllowance] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!dataloaded) {
            dispatch(loadIco())
        }
    }, [dataloaded])

    const choice = (token) => {
        setChoiceToken(token)
    }

    const url = () => {
        const aux = window.location.href.split("ico")
        return aux[0] + 'connect/'
    }

    const AGCA_PRICE = AgcaPrice;
    const AGCA_MAX_SUPPLY = 38000000;

    const calcAmount = () => {
        if (choiceToken === 'bnb') {
            const price = AGCA_PRICE * amount / bnbprice
            setCalculatePrice(price.toFixed(4))

        } else if (choiceToken === 'busd') {
            const price = AGCA_PRICE * amount
            setCalculatePrice(price.toFixed(2))

        } else if (choiceToken === 'usdt') {
            const price = AGCA_PRICE * amount
            setCalculatePrice(price.toFixed(2))

        }
    }

    useEffect(() => {
        calcAmount()
    }, [amount, choiceToken])

    const handleAddTokenToMetamask = async () => {
        const tokenAddress = router.agcaContract;
        const tokenSymbol = "AGCA";
        const tokenDecimals = 18;
        try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            const wasAdded = await instance.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20", // Initially only supports ERC20, but eventually more!
                    options: {
                        address: tokenAddress, // The address that the token is at.
                        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                        decimals: tokenDecimals, // The number of decimals in the token

                    },
                },
            });

            if (wasAdded) {
                console.log("Thanks for your interest!");
            } else {
                console.log("Your loss!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const verifyApprove = async () => {
        const busdAllowance = await busdContract.allowance(accountAddress, icoContract.address)
        const busdAllowanceInEth = parseFloat(ethers.utils.formatEther(busdAllowance))
        setBusdAllowance(busdAllowanceInEth)

        const busdRefAllownace = await busdContract.allowance(accountAddress, icoReferContract.address)
        const busdRefAllownaceInEth = parseFloat(ethers.utils.formatEther(busdRefAllownace))
        setBusdRefAllowance(busdRefAllownaceInEth)


        const usdtAllowance = await usdtContract.allowance(accountAddress, icoContract.address)
        const usdtAllowanceInEth = parseFloat(ethers.utils.formatEther(usdtAllowance))
        setUsdtAllowance(usdtAllowanceInEth)

        const usdtRefAllowance = await usdtContract.allowance(accountAddress, icoReferContract.address)
        const usdtRefAllowanceInEth = parseFloat(ethers.utils.formatEther(usdtRefAllowance))
        setUsdtRefAllowance(usdtRefAllowanceInEth)
    }



    useEffect(() => {
        if (accountAddress) {
            verifyApprove()
        }
    }, [accountAddress])


    const handleBuy = async () => {
        setLoading(true)
        if (accountAddress) {
            try {
                if (choiceToken === 'bnb') {
                    const price = AGCA_PRICE * amount / bnbprice
                    const priceInWei = ethers.utils.parseEther(price.toString())
                    const tx = await icoContract.buyWithBnb({ value: priceInWei })
                    await tx.wait()
                    Swal.fire({
                        icon: 'success',
                        title: 'Exito',
                        text: 'Compra realizada con exito',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    dispatch(loadIco())
                    dispatch(buyToken(amount, accountAddress))
                } else if (choiceToken === 'busd') {
                    const price = AGCA_PRICE * amount
                    const priceInWei = ethers.utils.parseEther(price.toString())
                    const tx = await icoContract.buy(priceInWei, busdContract.address)
                    await tx.wait()
                    Swal.fire({
                        icon: 'success',
                        title: 'Exito',
                        text: 'Compra realizada con exito',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    dispatch(loadIco())
                    dispatch(buyToken(amount, accountAddress))
                } else if (choiceToken === 'usdt') {
                    const price = AGCA_PRICE * amount
                    const priceInWei = ethers.utils.parseEther(price.toString())
                    const tx = await icoContract.buy(priceInWei, usdtContract.address)
                    await tx.wait()
                    Swal.fire({
                        icon: 'success',
                        title: 'Exito',
                        text: 'Compra realizada con exito',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    dispatch(loadIco())
                    dispatch(buyToken(amount, accountAddress))
                }
                setLoading(false)
            } catch (error) {
                setLoading(false)
                if (error.reason) {

                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.reason,
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se ha detectado una cuenta de metamask',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const handleBuyRefer = async () => {
        setLoading(true)
        if (accountAddress) {
            try {
                if (choiceToken === 'bnb') {
                    const price = AGCA_PRICE * amount / bnbprice
                    const priceInWei = ethers.utils.parseEther(price.toString())
                    const tx = await icoReferContract.buyWithBnb(referer, { value: priceInWei })
                    await tx.wait()
                    Swal.fire({
                        icon: 'success',
                        title: 'Exito',
                        text: 'Compra realizada con exito',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    dispatch(loadIco())
                    dispatch(buyToken(amount, accountAddress, referer))
                } else if (choiceToken === 'busd') {
                    const price = AGCA_PRICE * amount
                    const priceInWei = ethers.utils.parseEther(price.toString())
                    const tx = await icoReferContract.buy(priceInWei, busdContract.address)
                    await tx.wait()
                    Swal.fire({
                        icon: 'success',
                        title: 'Exito',
                        text: 'Compra realizada con exito',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    dispatch(loadIco())
                    dispatch(buyToken(amount, accountAddress, referer))
                } else if (choiceToken === 'usdt') {
                    const price = AGCA_PRICE * amount
                    const priceInWei = ethers.utils.parseEther(price.toString())
                    const tx = await icoReferContract.buy(priceInWei, usdtContract.address)
                    await tx.wait()
                    Swal.fire({
                        icon: 'success',
                        title: 'Exito',
                        text: 'Compra realizada con exito',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    dispatch(loadIco())
                    dispatch(buyToken(amount, accountAddress))
                }
                setLoading(false)
            } catch (error) {
                setLoading(false)
                if (error.reason) {

                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.reason,
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se ha detectado una cuenta de metamask',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }


    const handleApproveBusd = async () => {
        try {
            setLoading(true)
            const approve = await busdContract.approve(icoContract.address, ethers.utils.parseEther('9999'))
            await approve.wait()
            setBusdAllowance(9999)
            Swal.fire({
                icon: 'success',
                title: 'Exito',
                text: 'Aprobacion realizada con exito',
                showConfirmButton: false,
                timer: 1500
            })
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            if (e.reason) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: e.reason,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }

    }

    const handleApproveUsdt = async () => {
        try {
            setLoading(true)
            const approve = await usdtContract.approve(icoContract.address, ethers.utils.parseEther('9999'))
            await approve.wait()
            setUsdtAllowance(9999)
            Swal.fire({
                icon: 'success',
                title: 'Exito',
                text: 'Aprobacion realizada con exito',
                showConfirmButton: false,
                timer: 1500
            })
            setLoading(false)
        } catch (e) {
            console.log(e)
            if (e.reason)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: e.reason,
                    showConfirmButton: false,
                    timer: 1500
                })
            setLoading(false)
        }

    }

    const handleApproveBusdRefer = async () => {
        try {
            setLoading(true)
            const approve = await busdContract.approve(icoReferContract.address, ethers.utils.parseEther('9999'))
            await approve.wait()
            setBusdRefAllowance(9999)
            Swal.fire({
                icon: 'success',
                title: 'Exito',
                text: 'Aprobacion realizada con exito',
                showConfirmButton: false,
                timer: 1500
            })
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            if (e.reason) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: e.reason,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }

    }

    const handleApproveUsdtRefer = async () => {
        try {
            setLoading(true)
            const approve = await usdtContract.approve(icoReferContract.address, ethers.utils.parseEther('9999'))
            await approve.wait()
            setUsdtRefAllowance(9999)
            Swal.fire({
                icon: 'success',
                title: 'Exito',
                text: 'Aprobacion realizada con exito',
                showConfirmButton: false,
                timer: 1500
            })
            setLoading(false)
        } catch (e) {
            console.log(e)
            if (e.reason)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: e.reason,
                    showConfirmButton: false,
                    timer: 1500
                })
            setLoading(false)
        }

    }



    const testFunction = async () => {
        dispatch(buyToken(amount, accountAddress))
    }

    const getVerifycode = () => {
        dispatch(createReferCode())
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(link + referal.referCode)
        Swal.fire({
            icon: 'success',
            title: 'Exito',
            text: 'Codigo copiado con exito',
            showConfirmButton: false,
            timer: 1500
        })
    }
    const link = url();


    return (
        <div className='container'>
            <div className='ico-title text-center my-5'>
                <h1>Elegir Opcion de Compra</h1>
            </div>
            <div>
                <div className='row tokens-row'>
                    <div className='col-sm-4'>
                        <div className='d-flex border-token align-items-center justify-content-center'
                            onClick={() => choice('bnb')}
                        >
                            <div >
                                <img src={BNB} alt='BNB' width="80" height="80" />
                            </div>
                            <div>
                                <h3>BNB</h3>
                                <p>Balance: {bnbBalance}</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-4'>
                        <div className='d-flex border-token align-items-center justify-content-center'
                            onClick={() => choice('usdt')}
                        >
                            <div>
                                <img src={USDT} alt='USDT' width="80" height="80" />
                            </div>
                            <div >
                                <h3>USDT</h3>
                                <p>Balance: {usdtBalance}</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-4'>
                        <div className='d-flex border-token align-items-center justify-content-center'
                            onClick={() => choice('busd')}
                        >
                            <div>
                                <img src={BUSD} alt='BUSD' width="80" height="80" />
                            </div>
                            <div>
                                <h3>BUSD</h3>
                                <p>Balance: {busdBalance}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-center my-5 flex-column'>
                    {accountAddress &&
                        <button className='addtoken btn border d-flex justify-content-center fw-bold'
                            onClick={handleAddTokenToMetamask}
                        >Agregar AGCA <img src={metamask} alt='metamas' width="30" height="30"
                            /> </button>
                    }
                    <div className='text-center my-2'>
                        <p style={{ color: 'red' }}>Cuenta con 1200 tokens AGCA para generar tu enlace de referido *</p>
                        <p style={{ color: 'red' }}>Minimo 500.000 Agca para hacer el cambio</p>
                        Balance: {agcaBalance} AGCA
                        <div>
                            {agcaBalance > 1500 ?
                                <>
                                    {/* {referal.referCode === null &&
             
                                    }
                                    <br /> */}
                                    {referal ?
                                        (<button
                                            onClick={copyToClipboard}
                                            className='btn btn-primary my-2'
                                        >copiar: {link + referal.referCode}</button>)
                                        :
                                        (<button className='btn btn-primary'
                                            onClick={getVerifycode} >
                                            Generar enlace de Referido
                                        </button>)
                                    }
                                </>
                                :
                                <>
                                    <button
                                        className='btn btn-secundary' disabled>
                                        Generar enlace de Referido
                                    </button>
                                </>
                            }
                        </div>
                    </div>
                </div>
                <div className='my-4'>
                    <h3>Cantidad: </h3>
                    <input type="text" className="form-control" id="amount" placeholder="Cantidad"
                        onChange={(e) => setAmount(e.target.value)}
                        value={amount}

                    /><br />
                    <h6> AGCA disponibles: {referer ? agcaReferInContract : agcaInContract}</h6>
                    <div className='d-flex justify-content-center'>

                        {!referer && choiceToken === 'busd' && busdAllowance <= amount && amount > 0 &&
                            <button className='btn btn-warning fw-bold' onClick={handleApproveBusd}>
                                {loading ?
                                    <div className="spinner-border text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    :
                                    `Aprobar BUSD`
                                }
                            </button>
                        }
                        {referer && choiceToken === 'busd' && busdRefAllowance <= amount && amount > 0 &&
                            <button className='btn btn-warning fw-bold' onClick={handleApproveBusdRefer}>
                                {loading ?
                                    <div className="spinner-border text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    :
                                    `Aprobar BUSD`
                                }
                            </button>
                        }
                        {!referer && choiceToken === 'usdt' && usdtAllowance <= amount && amount > 0 &&
                            <button className='btn btn-success fw-bold' onClick={handleApproveUsdt}>
                                {loading ?
                                    <div className="spinner-border text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    :
                                    `Aprobar USDT`
                                }
                            </button>
                        }
                        {referer && choiceToken === 'usdt' && usdtRefAllowance <= amount && amount > 0 &&
                            <button className='btn btn-success fw-bold' onClick={handleApproveUsdtRefer}>
                                {loading ?
                                    <div className="spinner-border text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    :
                                    `Aprobar USDT`
                                }
                            </button>
                        }


                        {!referer && choiceToken === 'bnb' &&
                            <button className={`btn  px-5 py-2 fw-bold btn-dark`}
                                onClick={handleBuy}>
                                {loading ? <div className="spinner-border text-light" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                    :
                                    `Comprar ${calculatePrice} en BNB`
                                }
                            </button>
                        }

                        {referer && choiceToken === 'bnb' &&
                            <button className={`btn  px-5 py-2 fw-bold btn-dark`}
                                onClick={handleBuy}>
                                {loading ? <div className="spinner-border text-light" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                    :
                                    `Comprar ${calculatePrice} en BNB`
                                }
                            </button>
                        }

                        {!referer && choiceToken === 'busd' && busdAllowance >= amount &&
                            <button className={`btn  px-5 py-2 fw-bold btn-warning`}
                                onClick={handleBuy}>
                                {loading ?
                                    <div className="spinner-border text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    :
                                    `Comprar ${calculatePrice} en BUSD`
                                }
                            </button>
                        }

                        {referer && choiceToken === 'busd' && busdRefAllowance >= amount &&
                            <button className={`btn  px-5 py-2 fw-bold btn-warning`}
                                onClick={handleBuy}>
                                {loading ?
                                    <div className="spinner-border text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    :
                                    `Comprar ${calculatePrice} en BUSD`
                                }
                            </button>
                        }

                        {!referer && choiceToken === 'usdt' && usdtAllowance >= amount &&
                            <button className={`btn  px-5 py-2 fw-bold btn-success`}
                                onClick={handleBuy}>
                                {loading ?
                                    <div className="spinner-border text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    :
                                    `Comprar ${calculatePrice} en USDT`
                                }

                            </button>
                        }

                        {referer && choiceToken === 'usdt' && usdtRefAllowance >= amount &&
                            <button className={`btn  px-5 py-2 fw-bold btn-success`}
                                onClick={handleBuy}>
                                {loading ?
                                    <div className="spinner-border text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    :
                                    `Comprar ${calculatePrice} en USDT`
                                }

                            </button>
                        }

                        {choiceToken === '' &&
                            <button className={`btn  px-5 py-2 fw-bold btn-secondary`} disabled>
                                Seleccionar Moneda
                            </button>
                        }


                    </div>
                    {/* <button className='btn btn-primary fw-bold' onClick={testFunction}>Test</button> */}
                </div>
            </div>

        </div>
    )
}

export default Ico