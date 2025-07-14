import { words as INITIAL_WORDS } from './data.js';

const $time = document.querySelector('time');
const $paragraph = document.querySelector('p');
const $input = document.querySelector('#input');

const $game = document.querySelector('#game');
const $results = document.querySelector('#results');
const $exactitud = $results.querySelector('#results-exactitud');
const $ppm = document.querySelector('#ppm');
const $button = document.querySelector('#reload-button');

const INITIAL_TIME = 60;

let words = [];
let currentTime = INITIAL_TIME;

initGame();
initEvents();
//start Game
function initGame() {
    $game.style.display = 'flex';
    $input.value = '';
    $results.style.display = 'none';


    words = INITIAL_WORDS.toSorted(
        () => Math.random() - 0.5
    )[0];
    currentTime = INITIAL_TIME;

    $time.textContent = currentTime;
// mostra texto
    $paragraph.innerHTML = words.split(' ').map((word) => {
        const letters = word.split('');

        return `<word>
                    ${letters
                        .map(letter => `<letter>${letter}</letter>`)
                        .join('')}
                </word>`;
    }).join(' ');
//marcamos primera palabra y letra de ella
    const $firstWord = $paragraph.querySelector('word');
    $firstWord.classList.add('active');
    $firstWord.querySelector('letter').classList.add('active');
//corremos tiempo
    const intervalId = setInterval(() => {
        currentTime--;
        $time.textContent = currentTime;

        if (currentTime === 0) {
            clearInterval(intervalId);
            gameOver();
        }
    }, 1000);
}
//activamos foco en input y sentenfciamos listener
function initEvents() {
    document.addEventListener('keydown', () => {
        $input.focus();
    });

    $input.addEventListener('keydown', onkeydown);
    $input.addEventListener('keyup', onkeyup);
    $button.addEventListener('click', initGame);
}

function onkeydown(event) {
    const $currentWord = $paragraph.querySelector('word.active');
    const $currentLetter = $currentWord.querySelector('letter.active');
// listener de space y validacion de word
    const { key } = event;
    if (key === ' ') {
        
        if($input.value.length === $currentWord.querySelectorAll('letter').length){

            event.preventDefault();

            const $nextWord = $currentWord.nextElementSibling;
            const $nextLetter = $nextWord.querySelector('letter');

            $currentWord.classList.remove('active', 'marked');
            $currentLetter.classList.remove('active');

            $nextWord.classList.add('active');
            $nextLetter.classList.add('active');
            
            const hasMissedLetters = $currentWord.querySelectorAll('letter.incorrect').length == 0;

            const classToAdd = hasMissedLetters ? ['correct', 'marked']: ['incorrect', 'marked'];
            $currentWord.classList.add(...classToAdd);
            $input.value = '';
            return;
        }
        
    }

    if (key === 'Backspace') {

        const $prevWord = $currentWord.previousElementSibling;
            console.log(`radar 1`,$prevWord);

        const $prevLetter = $currentLetter.
        previousElementSibling;
            console.log($prevLetter);

// control de error al borrar en el primer sword y letter
        if (!$prevWord && !$prevLetter) {
            
            event.preventDefault();
            return;
        }

        const $wordMarked = $paragraph.querySelector('word.marked');
//condicion si letter[index = null] ; 
        if ($wordMarked && !$prevLetter) {
console.log(`radar2`,$wordMarked);

            event.preventDefault();
            $prevWord.classList.remove('marked');
            
            const $letterToGo = $prevWord.querySelector('letter:last-child');
//quitamos active a letra actual
            $currentLetter.classList.remove('active');
            $currentWord.classList.remove('active');

//agregamos active a prevword y letter
            $prevWord.classList.add('active');
            $letterToGo.classList.add('active');

            $input.value = [
                ...$prevWord.querySelectorAll('letter.correct, letter.incorrect')
            ].map($el => {
                return $el.classList.contains('correct') ? $el.innerText : '*';
            }).join('');

            console.log(`valor`,$letterToGo);
            
            
        }
    }
}

function onkeyup() {
    const $currentWord = $paragraph.querySelector('word.active');
    const $currentLetter = $currentWord.querySelector('letter.active');
//calculamos el total de letras de word
    const currentWord = $currentWord.innerText.trim();
    $input.maxLength = currentWord.length;    
// capturamos todas las letras
    const $allLetters = $currentWord.querySelectorAll('letter');    
// quitamos a todos los correct e incorrect
    $allLetters.forEach($letter => $letter.classList.remove('correct', 'incorrect'));
    
    $input.value.split('').forEach((char, index) => {
        const $letter = $allLetters[index];
        const letterToCheck = currentWord[index];
        
        const isCorrect = char === letterToCheck;
        const letterClass = isCorrect ? 'correct' : 'incorrect';
        $letter.classList.add(letterClass);
        console.log(`agregado total`);
        
    });

    $currentLetter.classList.remove('active', 'is-last');
    const inputLength = $input.value.length;
    const $nextActiveLetter = $allLetters[inputLength];

    if ($nextActiveLetter) {
        $allLetters[inputLength].classList.add('active');
    } else {
        $currentLetter.classList.add('active', 'is-last');
    }
}

function gameOver() {
    $game.style.display = 'none';
    $results.style.display = 'flex';

    const correctWords = $paragraph.querySelectorAll('word.correct').length;
    const correctLetter = $paragraph.querySelectorAll('letter.correct').length;
    const incorrectLetter = $paragraph.querySelectorAll('letter.incorrect').length;

    const totalLetters = correctLetter + incorrectLetter;
    const exactitud = totalLetters > 0
        ? (correctLetter / totalLetters) * 100
        : 0;
    
    const ppm = correctWords * 60 / INITIAL_TIME;
    $ppm.textContent = ppm;
    $exactitud.textContent = `${exactitud.toFixed(2)}%`;

}