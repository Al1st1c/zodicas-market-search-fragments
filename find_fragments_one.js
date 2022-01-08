const axios = require('axios')
const fs = require('fs')

// DICIONARIO DE STATUS
// 100 - NÃO ENCONTRADO NA PAGINA
// 200 - ENCONTRADO
// 300 - REFAZER FUNÇÃO

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Get config file
const config = fs.readFileSync(`./config.txt`, 'utf-8').toString();
const session = JSON.parse(config.split('=')[1])

var fragmentoBarato = {fragmentName: '', price: 999999999999999999999999, page: 0, userId: ''}

async function findFragmentForPages(sessionBody, fragmentId) {
        try{
            console.log('Consultando na página :' + sessionBody.page)
            const consulta = await axios.post('https://8za04rmw3eb0.grandmoralis.com:2053/server/functions/marketplace_getItemsOnSale', sessionBody)
            const resultados = consulta.data.result.results

            const fragmentoCorreto = resultados.filter(x=> x.fragmentId == fragmentId)
            if(fragmentoCorreto.length <= 0) return { error: 1, status: 100}

            let fragmentoBaratoTemp = {}
            for(let fragmento of fragmentoCorreto){
                if(fragmentoBarato.price < fragmento.selling.price) continue;
                fragmentoBaratoTemp = {fragmentName: fragmento.fragment.name, price: fragmento.selling.price, page: sessionBody.page, userId: fragmento.userId}
            }
            return {status: 200, ...fragmentoBaratoTemp}
        }catch(error){
            return {error: 1, status: 300}
        }
        // console.log(sessionBody)
   
}

async function intermediador(sessionBody, fragmentId){
    const fragmento = await findFragmentForPages(sessionBody, fragmentId)
    // console.log(fragmento)
    if(fragmento?.status == 300) return intermediador(sessionBody, fragmentId)
    if(fragmento.status == 200) fragmentoBarato = fragmento

    return fragmento
}


async function start(){
    const carId = 8
    const totalPages = 89
    const fragmentId = 53 // meio snake

    // Procura pelo fragmento passando as config
    for(let itera = 1; itera <= totalPages; itera++){
        const sessionBody = {
            page: itera,
            itemType: "fragment",
            filterMine: false,
            carTypeId: carId,
            starRange: [6,0],
            sortBy: "price-desc",
            ...session
        }
        await intermediador(sessionBody, fragmentId)
    }

    console.log('Fragmento mais barato encontrado: \n\n')
    console.log(fragmentoBarato)
}

start();