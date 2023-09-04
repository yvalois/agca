export const contract = () => {
    if (import.meta.env.VITE_APP_NODE_ENV === 'development') {
        return (
            {
                usdtContract: '0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684',
                busdContract: '0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7',
                agcaContract: '0x1396E44eF33bb15970dED3084A4A33E22BE69f48',
                icoContract: '0xE896961B9545727dd07BdF95a7DDF195abe31a82',
                icoReferContract: '0xB1BD8642dC1C181Da813044631096289C3F2710e',
                RPC_URL: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
            })}
    
    if (import.meta.env.VITE_APP_NODE_ENV === 'production') {
        return (
            {
                usdtContract: '0x55d398326f99059fF775485246999027B3197955',
                busdContract: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
                agcaContract: '0x8d5209FFa362a9A759437464eD61647Bb9C85Bb2',
                icoContract: '0x8C87D08A4d501E63A688D01cc4981299CDCdfcF4',
                RPC_URL: 'https://bsc-dataseed1.ninicoin.io',
            })}
}
