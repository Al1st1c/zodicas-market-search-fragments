const axios = require('axios')
const fs = require('fs')
const colors = require('colors')

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

var fragmentosBaratos = []
var fragmentoBaratoTemp = []

async function findFragmentForPages(sessionBody, carro) {
        try{
            console.log('[ 📀 ] - Lendo página (' + sessionBody.page + ')'.green)
            const consulta = await axios.post('https://8za04rmw3eb0.grandmoralis.com:2053/server/functions/marketplace_getItemsOnSale', sessionBody)
            const resultados = consulta.data.result.results

            const fragmento1 = resultados.filter(x=> x.fragment.name == `${carro}-1`)
            const fragmento2 = resultados.filter(x=> x.fragment.name == `${carro}-2`)
            const fragmento3 = resultados.filter(x=> x.fragment.name == `${carro}-3`)
            const fragmento4 = resultados.filter(x=> x.fragment.name == `${carro}-4`)
            const fragmento5 = resultados.filter(x=> x.fragment.name == `${carro}-5`)
            const fragmento6 = resultados.filter(x=> x.fragment.name == `${carro}-6`)

            if(
                fragmento1.length <= 0 && 
                fragmento2.length <= 0 &&
                fragmento3.length <= 0 &&
                fragmento4.length <= 0 &&
                fragmento5.length <= 0 &&
                fragmento6.length <= 0
            ) return { error: 1, status: 100}

            if(fragmento1.length > 0){
                // Procura pelo fragmento-1 mais barato
                for(let fragmento of fragmento1){
                    const achaIndiceFragmento1 = fragmentoBaratoTemp.findIndex(x => x.fragmentName == `${carro}-1`)
                    if(achaIndiceFragmento1 < 0){
                        fragmentoBaratoTemp.push({fragmentName: fragmento.fragment.name, price: fragmento.selling.price, page: sessionBody.page, userId: fragmento.userId})
                    }else{
                        if(fragmentoBaratoTemp[achaIndiceFragmento1].price < fragmento.selling.price) continue;
                        fragmentoBaratoTemp[achaIndiceFragmento1] = {fragmentName: fragmento.fragment.name, price: fragmento.selling.price, page: sessionBody.page, userId: fragmento.userId}
                    }
                }
            }
            
            if(fragmento2.length > 0){
                // Procura pelo fragmento-2 mais barato
                for(let fragmento of fragmento2){
                    const achaIndiceFragmento = fragmentoBaratoTemp.findIndex(x => x.fragmentName == `${carro}-2`)
                    if(achaIndiceFragmento < 0){
                        fragmentoBaratoTemp.push({fragmentName: fragmento.fragment.name, price: fragmento.selling.price, page: sessionBody.page, userId: fragmento.userId})
                    }else{
                        if(fragmentoBaratoTemp[achaIndiceFragmento].price < fragmento.selling.price) continue;
                        fragmentoBaratoTemp[achaIndiceFragmento] = {fragmentName: fragmento.fragment.name, price: fragmento.selling.price, page: sessionBody.page, userId: fragmento.userId}
                    }
                }
            }

            if(fragmento3.length > 0){
                // Procura pelo fragmento-3 mais barato
                for(let fragmento of fragmento3){
                    const achaIndiceFragmento = fragmentoBaratoTemp.findIndex(x => x.fragmentName == `${carro}-3`)
                    if(achaIndiceFragmento < 0){
                        fragmentoBaratoTemp.push({fragmentName: fragmento.fragment.name, price: fragmento.selling.price, page: sessionBody.page, userId: fragmento.userId})
                    }else{
                        if(fragmentoBaratoTemp[achaIndiceFragmento].price < fragmento.selling.price) continue;
                        fragmentoBaratoTemp[achaIndiceFragmento] = {fragmentName: fragmento.fragment.name, price: fragmento.selling.price, page: sessionBody.page, userId: fragmento.userId}
                    }
                }
            }

            if(fragmento4.length > 0){
                // Procura pelo fragmento-4 mais barato
                for(let fragmento of fragmento4){
                    const achaIndiceFragmento = fragmentoBaratoTemp.findIndex(x => x.fragmentName == `${carro}-4`)
                    if(achaIndiceFragmento < 0){
                        fragmentoBaratoTemp.push({fragmentName: fragmento.fragment.name, price: fragmento.selling.price, page: sessionBody.page, userId: fragmento.userId})
                    }else{
                        if(fragmentoBaratoTemp[achaIndiceFragmento].price < fragmento.selling.price) continue;
                        fragmentoBaratoTemp[achaIndiceFragmento] = {fragmentName: fragmento.fragment.name, price: fragmento.selling.price, page: sessionBody.page, userId: fragmento.userId}
                    }
                }
            }

            if(fragmento5.length > 0){
                // Procura pelo fragmento-5 mais barato
                for(let fragmento of fragmento5){
                    const achaIndiceFragmento = fragmentoBaratoTemp.findIndex(x => x.fragmentName == `${carro}-5`)
                    if(achaIndiceFragmento < 0){
                        fragmentoBaratoTemp.push({fragmentName: fragmento.fragment.name, price: fragmento.selling.price, page: sessionBody.page, userId: fragmento.userId})
                    }else{
                        if(fragmentoBaratoTemp[achaIndiceFragmento].price < fragmento.selling.price) continue;
                        fragmentoBaratoTemp[achaIndiceFragmento] = {fragmentName: fragmento.fragment.name, price: fragmento.selling.price, page: sessionBody.page, userId: fragmento.userId}
                    }
                }
            }

            if(fragmento6.length > 0){
                // Procura pelo fragmento-6 mais barato
                for(let fragmento of fragmento6){
                    const achaIndiceFragmento = fragmentoBaratoTemp.findIndex(x => x.fragmentName == `${carro}-6`)
                    if(achaIndiceFragmento < 0){
                        fragmentoBaratoTemp.push({fragmentName: fragmento.fragment.name, price: fragmento.selling.price, page: sessionBody.page, userId: fragmento.userId})
                    }else{
                        if(fragmentoBaratoTemp[achaIndiceFragmento].price < fragmento.selling.price) continue;
                        fragmentoBaratoTemp[achaIndiceFragmento] = {fragmentName: fragmento.fragment.name, price: fragmento.selling.price, page: sessionBody.page, userId: fragmento.userId}
                    }
                }
            }

            // console.log(fragmentoBaratoTemp)
            return {status: 200, fragmentoBaratoTemp}
        }catch(error){
            return {error: 1, status: 300}
        }
        // console.log(sessionBody)
   
}

async function intermediador(sessionBody, carro){
    const fragmento = await findFragmentForPages(sessionBody, carro)
    // console.log(fragmento)
    if(fragmento?.status == 300) return intermediador(sessionBody, carro)
    if(fragmento.status == 200) fragmentosBaratos = fragmento.fragmentoBaratoTemp

    return fragmento
}


async function start(){
    const totalPages = 200
    //Info carro
    const carros = [
        {id: 0, name: 'dog'},
        {id: 1, name: 'mouse'},
        {id: 2, name: 'goat'},
        {id: 3, name: 'chicken'},
        {id: 4, name: 'tiger'},
        {id: 5, name: 'monkey'},
        {id: 6, name: 'pig'},
        {id: 7, name: 'horse'},
        {id: 8, name: 'snake'},
        {id: 9, name: 'dragon'},
        {id: 10, name: 'rabbit'},
        {id: 11, name: 'buffalo'}
    ]

    for(const carro of carros){
        // Procura pelo fragmento passando as config
        for(let itera = 1; itera <= totalPages; itera++){
            const sessionBody = {
                page: itera,
                itemType: "fragment",
                filterMine: false,
                carTypeId: carro.id,
                starRange: [6,0],
                sortBy: "price-asc",
                ...session
            }
            await intermediador(sessionBody, carro.name)
        }

    }

    fragmentosBaratos.map(x=>{
        fs.appendFile('@RESULTADO.txt', `[${x.fragmentName}] | PREÇO: ${x.price} | PAGE: ${x.page} | USERID: ${x.userId}` + '\n', () => { })  
    })


    for(const xyz of carros){
        let totalZDC = 0
        const procuraCarro = fragmentosBaratos.filter(x=> x.fragmentName.includes(xyz.name))
        procuraCarro.map(x=> { totalZDC += x.price; return totalZDC})
    
        fs.appendFile('@TOTAL.txt', `[ ${xyz.name} ] TOTAL: ${totalZDC} ZDC` + '\n', () => { })
    }
    console.log('Finished!')
    // fs.appendFile('@TOTAL.txt', `[${carro.name} - ${carro.id}] TOTAL: ${totalZDC} ZDC` + '\n', () => { })

}

start();