import { useState } from 'react'
import { BrowserRouter, Routes,Route, HashRouter } from 'react-router-dom'
import Administrador from './Administrador'

import './App.css'
import Connect from './Connect'
import Form from './Form'
import Ico from './Ico'
import Layout from './Layout'


import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { arbitrum, mainnet, polygon, bsc} from 'wagmi/chains'
import { getWebSocketPublicClient } from '@wagmi/core'
import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from "connectkit"

function App() {

  const chains = [bsc]  

  const wagmiConfig = createConfig(
    getDefaultConfig({
      appName: "Agca",
      alchemyId: "DJywCZ0RyjPY_YdHLaJ67-kRzLVuNc_J", // or infuraId
      walletConnectProjectId: "7ecc030dc52cdc0986c6045ad928b12a",
      chains,
    }),
  );



  return (
    <WagmiConfig config={wagmiConfig}>
      <ConnectKitProvider>

    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
          <Route index  element={<Connect/>}/>
          <Route path="/connect/:refer" element={<Connect/>}/>
          <Route path='/connect' index element={<Connect/>}/>
          <Route path='/form' element={<Form/>}/>
          <Route path="/ico" element={<Ico/>}/>
          <Route path="/admin" element={<Administrador/>}/>
          </Route>
        </Routes>
      </HashRouter>
    </div>
    </ConnectKitProvider>

    </WagmiConfig>
  )
}

export default App
