
const gameBoard = document.getElementById("game-board");

const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const pairsDisplay = document.getElementById("pairs");

const restartButton = document.getElementById("restart");
const playAgainButton = document.getElementById("play-again");

const victoryScreen = document.getElementById("victory-screen");
const finalMoves = document.getElementById("final-moves");
const finalTime = document.getElementById("final-time");

// Seis personagens e elementos do filme.
// Coloque as imagens correspondentes na pasta imagens.

const characters = [
    {
        name: "Emily",
        image: "imagens/emily.jpg",
        fallback: "👰🏻‍♀️"
    },
    {
        name: "Victor",
        image: "imagens/victor.jpg",
        fallback: "🤵🏻"
    },
    {
        name: "Victoria",
        image: "imagens/victoria.jpg",
        fallback: "👩🏻"
    },
    {
        name: "Scraps",
        image: "imagens/scraps.jpg",
        fallback: "🐕"
    },
    {
        name: "Lorde Barkis",
        image: "imagens/barkis.jpg",
        fallback: "🎩"
    },
    {
        name: "Borboleta Azul",
        image: "imagens/borboleta.jpg",
        fallback: "🦋"
    }
];

// Variáveis do jogo

let firstCard = null;
let secondCard = null;

let lockBoard = false;
let moves = 0;
let matchedPairs = 0;

let seconds = 0;
let timerInterval = null;
let timerStarted = false;

let cards = [];

// Embaralhamento Fisher-Yates

function shuffle(array) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[randomIndex]] =
        [shuffled[randomIndex], shuffled[i]];
    }

    return shuffled;
}

// Formatar o cronômetro

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
    );
}

// Atualizar o cronômetro

function startTimer() {
    if (timerStarted) return;

    timerStarted = true;

    timerInterval = setInterval(() => {
        seconds++;

        timerDisplay.textContent = formatTime(seconds);
    }, 1000);
}

// Parar o cronômetro

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

// Criar as cartas

function createCards() {

    gameBoard.innerHTML = "";

    // Criar dois exemplares de cada personagem

    const cardList = characters.flatMap((character, index) => [
        {
            ...character,
            id: index,
            uniqueId: `${index}-a`
        },
        {
            ...character,
            id: index,
            uniqueId: `${index}-b`
        }
    ]);

    // Embaralhar automaticamente

    cards = shuffle(cardList);

    cards.forEach((character) => {

        const card = document.createElement("div");

        card.classList.add("card");
        card.dataset.id = character.id;

        card.innerHTML = `
            <div class="card-inner">

                <div class="card-front"></div>

                <div class="card-back">

                    <img
                        src="${character.image}"
                        alt="${character.name}"
                    >

                </div>

            </div>
        `;

        const image = card.querySelector("img");

        // Imagem alternativa caso a imagem não carregue

        image.onerror = () => {
            const fallback = document.createElement("div");

            fallback.textContent = character.fallback;

            fallback.style.cssText = `
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 55px;
                background: linear-gradient(135deg, #c6d9ef, #788eae);
            `;

            image.replaceWith(fallback);
        };

        card.addEventListener("click", () => {
            flipCard(card);
        });

        gameBoard.appendChild(card);
    });
}

// Virar uma carta

function flipCard(card) {

    // Impedir cliques inválidos

    if (lockBoard) return;

    if (card === firstCard) return;

    if (card.classList.contains("flipped")) return;

    if (card.classList.contains("matched")) return;

    // Iniciar cronômetro na primeira carta

    startTimer();

    card.classList.add("flipped");

    if (!firstCard) {

        firstCard = card;

        return;
    }

    secondCard = card;

    // Cada comparação vale uma jogada

    moves++;

    movesDisplay.textContent = moves;

    checkMatch();
}

// Comparar as duas cartas

function checkMatch() {

    lockBoard = true;

    const isMatch =
        firstCard.dataset.id === secondCard.dataset.id;

    if (isMatch) {

        disableMatchedCards();

    } else {

        unflipCards();

    }
}

// Quando encontrar um par

function disableMatchedCards() {

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    matchedPairs++;

    pairsDisplay.textContent = `${matchedPairs} / 6`;

    resetBoard();

    // Verificar se todos os pares foram encontrados

    if (matchedPairs === 6) {

        stopTimer();

        setTimeout(showVictory, 600);

    }
}

// Quando as cartas forem diferentes

function unflipCards() {

    setTimeout(() => {

        firstCard.classList.remove("flipped");

        secondCard.classList.remove("flipped");

        resetBoard();

    }, 1000);
}

// Liberar o tabuleiro

function resetBoard() {

    firstCard = null;
    secondCard = null;

    lockBoard = false;

}

// Mostrar tela final

function showVictory() {

    finalMoves.textContent = moves;

    finalTime.textContent = formatTime(seconds);

    victoryScreen.classList.remove("hidden");

}

// Reiniciar o jogo

function restartGame() {

    stopTimer();

    firstCard = null;
    secondCard = null;

    lockBoard = false;

    moves = 0;
    matchedPairs = 0;
    seconds = 0;

    timerStarted = false;

    movesDisplay.textContent = "0";

    pairsDisplay.textContent = "0 / 6";

    timerDisplay.textContent = "00:00";

    victoryScreen.classList.add("hidden");

    createCards();

}

// Eventos dos botões

restartButton.addEventListener("click", restartGame);

playAgainButton.addEventListener("click", restartGame);

// Iniciar jogo automaticamente

restartGame();
