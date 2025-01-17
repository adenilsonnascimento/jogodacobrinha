const tela = document.querySelector("canvas")
const contexto = tela.getContext("2d")

const pontuacao = document.querySelector(".ponto")
const pontuacaoFinal = document.querySelector(".pontoFinal > span")
const menu = document.querySelector(".menu")
const botaoJogar = document.querySelector(".btn-play")

const som = new Audio("../assets/audio.mp3")

const tamanho = 30
const posicaoInicial = { x: 270, y: 240 }

let cobrinha = [posicaoInicial]

const incrementarPontos = () => {
    pontuacao.innerText = +pontuacao.innerText + 10
}

const numeroAleatorio = (min, max) => Math.round(Math.random() * (max - min) + min)

const posicaoAleatoria = () => {
    const numero = numeroAleatorio(0, tela.width - tamanho)
    return Math.round(numero / 30) * 30
}

const corAleatoria = () => {
    const vermelho = numeroAleatorio(0, 255)
    const verde = numeroAleatorio(0, 255)
    const azul = numeroAleatorio(0, 255)
    return `rgb(${vermelho}, ${verde}, ${azul})`
}

let comida = {
    x: posicaoAleatoria(),
    y: posicaoAleatoria(),
    cor: corAleatoria()
}

let direcao = null
let idLoop

const desenharComida = () => {
    contexto.shadowColor = comida.cor
    contexto.shadowBlur = 6
    contexto.fillStyle = comida.cor
    contexto.fillRect(comida.x, comida.y, tamanho, tamanho)
    contexto.shadowBlur = 0
}

const desenharCobrinha = () => {
    cobrinha.forEach((posicao, index) => {
        contexto.fillStyle = index === cobrinha.length - 1 ? "white" : "#ddd"
        contexto.fillRect(posicao.x, posicao.y, tamanho, tamanho)
    })
}

const moverCobrinha = () => {
    if (!direcao) return

    const cabeca = cobrinha[cobrinha.length - 1]

    if (direcao === "direita") {
        cobrinha.push({ x: cabeca.x + tamanho, y: cabeca.y })
    } else if (direcao === "esquerda") {
        cobrinha.push({ x: cabeca.x - tamanho, y: cabeca.y })
    } else if (direcao === "baixo") {
        cobrinha.push({ x: cabeca.x, y: cabeca.y + tamanho })
    } else if (direcao === "cima") {
        cobrinha.push({ x: cabeca.x, y: cabeca.y - tamanho })
    }

    cobrinha.shift()
}

const desenharGrade = () => {
    contexto.lineWidth = 1
    contexto.strokeStyle = "#191919"
    for (let i = 30; i < tela.width; i += 30) {
        contexto.beginPath()
        contexto.lineTo(i, 0)
        contexto.lineTo(i, 600)
        contexto.stroke()

        contexto.beginPath()
        contexto.lineTo(0, i)
        contexto.lineTo(600, i)
        contexto.stroke()
    }
}

const verificarComer = () => {
    const cabeca = cobrinha[cobrinha.length - 1]

    if (cabeca.x === comida.x && cabeca.y === comida.y) {
        incrementarPontos()
        cobrinha.push(cabeca)
        som.play()

        let x = posicaoAleatoria()
        let y = posicaoAleatoria()

        while (cobrinha.find(posicao => posicao.x === x && posicao.y === y)) {
            x = posicaoAleatoria()
            y = posicaoAleatoria()
        }

        comida = { x, y, cor: corAleatoria() }
    }
}

const verificarColisao = () => {
    const cabeca = cobrinha[cobrinha.length - 1]
    const limiteTela = tela.width - tamanho
    const indexPescoço = cobrinha.length - 2

    const colisaoParede = cabeca.x < 0 || cabeca.x > limiteTela || cabeca.y < 0 || cabeca.y > limiteTela
    const colisaoComigo = cobrinha.find((posicao, index) => index < indexPescoço && posicao.x === cabeca.x && posicao.y === cabeca.y)

    if (colisaoParede || colisaoComigo) {
        fimDeJogo()
    }
}

const fimDeJogo = () => {
    direcao = null
    menu.style.display = "flex"
    pontuacaoFinal.innerText = pontuacao.innerText
    tela.style.filter = "blur(2px)"
}

const loopJogo = () => {
    clearInterval(idLoop)

    contexto.clearRect(0, 0, 600, 600)
    desenharGrade()
    desenharComida()
    moverCobrinha()
    desenharCobrinha()
    verificarComer()
    verificarColisao()

    idLoop = setTimeout(loopJogo, 300)
}

loopJogo()

document.addEventListener("keydown", ({ key }) => {
    if (key === "ArrowRight" && direcao !== "esquerda") {
        direcao = "direita"
    } else if (key === "ArrowLeft" && direcao !== "direita") {
        direcao = "esquerda"
    } else if (key === "ArrowDown" && direcao !== "cima") {
        direcao = "baixo"
    } else if (key === "ArrowUp" && direcao !== "baixo") {
        direcao = "cima"
    }
})

botaoJogar.addEventListener("click", () => {
    pontuacao.innerText = "00"
    menu.style.display = "none"
    tela.style.filter = "none"

    cobrinha = [posicaoInicial]
    direcao = null
    loopJogo()
})
