// aula 05
// criar a variável modalKey sera global
let modalKey = 0

// variavel para controlar a quantidade inicial de pastel na modal
let quantPasteis = 1

let cart = [] // carrinho
// /aula 05

// funcoes auxiliares ou uteis
const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}

const abrirModal = () => {
    seleciona('.pastelWindowArea').style.opacity = 0 // transparente
    seleciona('.pastelWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.pastelWindowArea').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.pastelWindowArea').style.opacity = 0 // transparente
    setTimeout(() => seleciona('.pastelWindowArea').style.display = 'none', 500)
}

const botoesFechar = () => {
    // BOTOES FECHAR MODAL
    selecionaTodos('.pastelInfo--cancelButton, .pastelInfo--cancelMobileButton').forEach( (item) => item.addEventListener('click', fecharModal) )
}

const preencheDadosDosPasteis = (pastelItem, item, index) => {
    // aula 05
    // setar um atributo para identificar qual elemento foi clicado
	pastelItem.setAttribute('data-key', index)
    pastelItem.querySelector('.pastel-item--img img').src = item.img
    pastelItem.querySelector('.pastel-item--price').innerHTML = formatoReal(item.price[2])
    pastelItem.querySelector('.pastel-item--name').innerHTML = item.name
    pastelItem.querySelector('.pastel-item--desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
    seleciona('.pastelBig img').src = item.img
    seleciona('.pastelInfo h1').innerHTML = item.name
    seleciona('.pastelInfo--desc').innerHTML = item.description
    seleciona('.pastelInfo--actualPrice').innerHTML = formatoReal(item.price[2])
}

// aula 05
const pegarKey = (e) => {
    // .closest retorna o elemento mais proximo que tem a class que passamos
    // do .pizza-item ele vai pegar o valor do atributo data-key
    let key = e.target.closest('.pastel-item').getAttribute('data-key')
    console.log('Pastel clicada ' + key)
    console.log(pastelJson[key])

    // garantir que a quantidade inicial de pastel é 1
    quantPasteis = 1

    // Para manter a informação de qual pizza foi clicada
    modalKey = key

    return key
}

const preencherTamanhos = (key) => {
    // tirar a selecao de tamanho atual e selecionar o tamanho grande
    seleciona('.pastelInfo--size.selected').classList.remove('selected')

    // selecionar todos os tamanhos
    selecionaTodos('.pastelInfo--size').forEach((size, sizeIndex) => {
        // selecionar o tamanho grande
        (sizeIndex == 2) ? size.classList.add('selected') : ''
        size.querySelector('span').innerHTML = pastelJson[key].sizes[sizeIndex]
    })
}

const escolherTamanhoPreco = (key) => {
    // Ações nos botões de tamanho
    // selecionar todos os tamanhos
    selecionaTodos('.pastelInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {
            // clicou em um item, tirar a selecao dos outros e marca o q vc clicou
            // tirar a selecao de tamanho atual e selecionar o tamanho grande
            seleciona('.pastelInfo--size.selected').classList.remove('selected')
            // marcar o que vc clicou, ao inves de usar e.target use size, pois ele é nosso item dentro do loop
            size.classList.add('selected')

            // mudar o preço de acordo com o tamanho
            seleciona('.pastelInfo--actualPrice').innerHTML = formatoReal(pastelJson[key].price[sizeIndex])
        })
    })
}

const mudarQuantidade = () => {
    // Ações nos botões + e - da janela modal
    seleciona('.pastelInfo--qtmais').addEventListener('click', () => {
        quantPasteis++
        seleciona('.pastelInfo--qt').innerHTML = quantPasteis
    })

    seleciona('.pastelInfo--qtmenos').addEventListener('click', () => {
        if(quantPasteis > 1) {
            quantPasteis--
            seleciona('.pastelInfo--qt').innerHTML = quantPasteis	
        }
    })
}

const adicionarNoCarrinho = () => {
    seleciona('.pastelInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

        // pegar dados da janela modal atual
    	// qual pastel? pegue o modalKey para usar pastelJson[modalKey]
    	console.log("Pastel " + modalKey)
    	// tamanho
	    let size = seleciona('.pastelInfo--size.selected').getAttribute('data-key')
	    console.log("Tamanho " + size)
	    // quantidade
    	console.log("Quant. " + quantPasteis)
        // preco
        let price = seleciona('.pastelInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')
    
        // crie um identificador que junte id e tamanho
	    // concatene as duas informacoes separadas por um símbolo, vc escolhe
	    let identificador = pastelJson[modalKey].id+'t'+size

        // antes de adicionar verifique se ja tem aquele codigo e tamanho
        // para adicionarmos a quantidade
        let key = cart.findIndex( (item) => item.identificador == identificador )
        console.log(key)

        if(key > -1) {
            // se encontrar aumente a quantidade
            cart[key].qt += quantPasteis
        } else {
            // adicionar objeto pastel no carrinho
            let pastel = {
                identificador,
                id: pastelJson[modalKey].id,
                size, // size: size
                qt: quantPasteis,
                price: parseFloat(price) // price: price
            }
            cart.push(pastel)
            console.log(pastel)
            console.log('Sub total R$ ' + (pastel.qt * pastel.price).toFixed(2))
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()

        
    })
}

const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + cart.length)
    if(cart.length > 0) {
        // mostrar o carrinho
	    seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex' // mostrar barra superior
    }

    // exibir aside do carrinho no modo mobile
    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

const fecharCarrinho = () => {
    // fechar o carrinho com o botão X no modo mobile
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw' // usando 100vw ele ficara fora da tela
        seleciona('header').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
    // exibir número de itens no carrinho
	seleciona('.menu-openner span').innerHTML = cart.length
	
	// mostrar ou nao o carrinho
	if(cart.length > 0) {

		// mostrar o carrinho
		seleciona('aside').classList.add('show')

		// zerar meu .cart para nao fazer insercoes duplicadas
		seleciona('.cart').innerHTML = ''

        // crie as variaveis antes do for
		let subtotal = 0
		let desconto = 0
		let total    = 0

        // para preencher os itens do carrinho, calcular subtotal
		for(let i in cart) {
			// use o find para pegar o item por id
			let pastelItem = pastelJson.find( (item) => item.id == cart[i].id )
			console.log(pastelItem)

            // em cada item pegar o subtotal
        	subtotal += cart[i].price * cart[i].qt
            //console.log(cart[i].price)

			// fazer o clone, exibir na telas e depois preencher as informacoes
			let cartItem = seleciona('.models .cart--item').cloneNode(true)
			seleciona('.cart').append(cartItem)

			let pastelSizeName = cart[i].size

			let pastelName = `${pastelItem.name} (${pastelSizeName})`

			// preencher as informacoes
			cartItem.querySelector('img').src = pastelItem.img
			cartItem.querySelector('.cart--item-nome').innerHTML = pastelName
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

			// selecionar botoes + e -
			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				console.log('Clicou no botão mais')
				// adicionar apenas a quantidade que esta neste contexto
				cart[i].qt++
				// atualizar a quantidade
				atualizarCarrinho()
			})

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				console.log('Clicou no botão menos')
				if(cart[i].qt > 1) {
					// subtrair apenas a quantidade que esta neste contexto
					cart[i].qt--
				} else {
					// remover se for zero
					cart.splice(i, 1)
				}

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''

				// atualizar a quantidade
				atualizarCarrinho()
			})

			seleciona('.cart').append(cartItem)

		} // fim do for

		// fora do for
		// calcule desconto 10% e total
		//desconto = subtotal * 0.1
		desconto = subtotal * 0
		total = subtotal - desconto

		// exibir na tela os resultados
		// selecionar o ultimo span do elemento
		seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
		seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
		seleciona('.total span:last-child').innerHTML    = formatoReal(total)

	} else {
		// ocultar o carrinho
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
}

const finalizarCompra = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        console.log('Finalizar compra')
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}



// MAPEAR pastelJson para gerar lista de pastel
pastelJson.map((item, index ) => {
    //console.log(item)
    let pastelItem = document.querySelector('.models .pastel-item').cloneNode(true)
    //console.log(pastelItem)
    //document.querySelector('.pastel-area').append(pastelItem)
    seleciona('.pastel-area').append(pastelItem)

    // preencher os dados de cada pastel
    preencheDadosDosPasteis(pastelItem, item, index)
    
    // pastel clicada
    pastelItem.querySelector('.pastel-item a').addEventListener('click', (e) => {
        e.preventDefault()
        console.log('Clicou no pastel')

        let chave = pegarKey(e)

        // abrir janela modal
        abrirModal()

        // preenchimento dos dados
        preencheDadosModal(item)

      
        // pegar tamanho selecionado
        preencherTamanhos(chave)

		// definir quantidade inicial como 1
		seleciona('.pastelInfo--qt').innerHTML = quantPasteis

        // selecionar o tamanho e preco com o clique no botao
        escolherTamanhoPreco(chave)
       

    })

    botoesFechar()

}) // fim do MAPEAR pizzaJson para gerar lista de pizzas


// mudar quantidade com os botoes + e -
mudarQuantidade()



adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()
