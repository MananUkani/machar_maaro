const screens = document.querySelectorAll('.screen');
const choose_insect_btns = document.querySelectorAll('.choose-insect-btn');
const start_btn = document.getElementById('start-btn');
const game_container = document.getElementById('game-container');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const exit_btn = document.getElementById('exit-btn');
const gameOverEl = document.getElementById('game-over');
let seconds = 0;
let score = 0;
let selected_insect = {};
let gameInterval;
let insectIntervals = [];
let insectElements = [];

start_btn.addEventListener('click', () => screens[0].classList.add('up'));

choose_insect_btns.forEach(btn => {
    btn.addEventListener('click', () => {
        const img = btn.querySelector('img');
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt');
        selected_insect = { src, alt };
        screens[1].classList.add('up');
        setTimeout(createInsect, 1000);
        startGame();
    });
});

exit_btn.addEventListener('click', stopGame);

function startGame() {
    gameInterval = setInterval(increaseTime, 1000);
}

function stopGame() {
    clearInterval(gameInterval);
    insectIntervals.forEach(interval => clearInterval(interval));
    insectElements.forEach(element => element.remove());
    gameOverEl.style.display = 'block';
}

function increaseTime() {
    let m = Math.floor(seconds / 60);
    let s = seconds % 60;
    m = m < 10 ? `0${m}` : m;
    s = s < 10 ? `0${s}` : s;
    timeEl.innerHTML = `Time: ${m}:${s}`;
    seconds++;
}

function createInsect() {
    const insect = document.createElement('div');
    insect.classList.add('insect');
    const { x, y } = getRandomLocation();
    insect.style.top = `${y}px`;
    insect.style.left = `${x}px`;
    insect.innerHTML = `<img src="${selected_insect.src}" alt="${selected_insect.alt}" style="transform: rotate(${Math.random() * 360}deg)" />`;

    insect.addEventListener('click', catchInsect);

    game_container.appendChild(insect);
    insectElements.push(insect);
    moveInsect(insect);
}

function moveInsect(insect) {
    function move() {
        const { x, y } = getRandomLocation();
        insect.style.top = `${y}px`;
        insect.style.left = `${x}px`;
    }
    move();
    const interval = setInterval(move, 1000);
    insectIntervals.push(interval);
}

function getRandomLocation() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const x = Math.random() * (width - 200) + 100;
    const y = Math.random() * (height - 200) + 100;
    return { x, y };
}

function catchInsect() {
    increaseScore();
    this.remove(); // Eliminate the clicked insect
    const index = insectElements.indexOf(this);
    if (index > -1) {
        clearInterval(insectIntervals[index]);
        insectIntervals.splice(index, 1);
        insectElements.splice(index, 1);
    }
    createInsect();
}

function increaseScore() {
    score++;
    scoreEl.innerHTML = `Score: ${score}`;
}
