'use strict';
// ELEMENTS HTML
const background = document.querySelector('.body');
const main = document.querySelector('.main');
const mode = document.querySelector('.mode');
const screen = document.querySelector('.time');
const audio = document.querySelector('.notification');
const btns = document.querySelectorAll('.btn');
const arrBtns = Array.from(btns);
const btnSet = document.querySelector('.btn-set');
const btnStart = document.querySelector('.btn-start');
const btnPause = document.querySelector('.btn-pause');
const btnStop = document.querySelector('.btn-stop');
const btnRest = document.querySelector('.btn-rest');
const btnSave = document.querySelector('.btn-save');
const btnClose = document.querySelector('.btn-close');
const timerHour = document.querySelector('.timer-hour');
const timerMinute = document.querySelector('.timer-minute');
const modalSet = document.querySelector('.modal-set');
const modalRest = document.querySelector('.modal-rest');
const overlay = document.querySelector('.overlay');

// SETTING STATES
const states = ['Cronômetro', 'Timer', 'Pomodoro'];
let currentState = states[0];
let working = true;

// HANDLING EVENTS //
/////////////////////
// Function
const changeMode = function () {
  // Cronômetro
  if (currentState === states[2]) {
    // 1. Change State
    currentState = states[0];

    // 2. Change Title Content
    this.textContent = currentState;

    // 3. Change Theme
    stop();

    // 3.1 Remove btn set, add back btn pause
    btnSet.classList.add('hidden');
    btnPause.classList.remove('hidden');

    background.classList.remove('body-timer', 'body-pomodoro');
    background.classList.add('body-stopwatch');

    main.classList.remove('main-timer', 'main-pomodoro');
    main.classList.add('main-stopwatch');

    mode.classList.remove('mode-timer', 'mode-pomodoro');
    mode.classList.add('mode-stopwatch');

    arrBtns.map(function (btn) {
      btn.classList.remove('btn-timer', 'btn-pomodoro');
      btn.classList.add('btn-stopwatch');
    });
    return;
  }

  // Timer
  if (currentState === states[0]) {
    // 1. Change State
    currentState = states[1];

    // 2. Change Title Content
    this.textContent = currentState;

    // 3. Change Theme
    stop();

    // 3.1 Add btn set, change btn set color
    btnSet.classList.remove('hidden');
    btnSet.style.color = '#16b2da';
    btnSet.style.backgroundColor = '#ffffff';

    background.classList.remove('body-stopwatch', 'body-pomodoro');
    background.classList.add('body-timer');

    main.classList.remove('main-stopwatch', 'main-pomodoro');
    main.classList.add('main-timer');

    mode.classList.remove('mode-stopwatch', 'mode-pomodoro');
    mode.classList.add('mode-timer');

    arrBtns.map(function (btn) {
      btn.classList.remove('btn-stopwatch', 'btn-pomodoro');
      btn.classList.add('btn-timer');
    });
    return;
  }

  // Pomodoro
  if (currentState === states[1]) {
    // 1. Change State
    currentState = states[2];

    // 2. Change Title Content
    this.textContent = currentState;

    // 3. Change Theme
    stop();

    // 3.1 Remove btn set, pause and change btn set color;
    btnPause.classList.add('hidden');
    btnSet.classList.add('hidden');
    btnSet.style.color = 'rgb(243, 62, 59)';

    background.classList.remove('body-stopwatch', 'body-timer');
    background.classList.add('body-pomodoro');

    main.classList.remove('main-stopwatch', 'main-timer');
    main.classList.add('main-pomodoro');

    mode.classList.remove('mode-stopwatch', 'mode-timer');
    mode.classList.add('mode-pomodoro');

    arrBtns.map(function (btn) {
      btn.classList.remove('btn-stopwatch', 'btn-timer');
      btn.classList.add('btn-pomodoro');
    });
    return;
  }
};
// Event
mode.addEventListener('click', changeMode);

// Cronômetro
let interval,
  seconds = 0,
  minutes = 0,
  hours = 0;

const start = function () {
  if (currentState === states[0]) {
    interval = setInterval(watch, 1000);
  } else if (currentState === states[1]) {
    interval = setInterval(timer, 1000);
  } else {
    interval = setInterval(pomodoro, 1000);
  }
};
const pause = function () {
  clearInterval(interval);
};
const stop = function () {
  if (currentState === states[0]) {
    clearInterval(interval);
    interval = seconds = minutes = hours = 0;
    screen.placeholder = '00:00:00';
  } else if (currentState === states[1]) {
    clearInterval(interval);
    interval = seconds = 0;
    minutes = Number(timerMinute.value);
    hours = Number(timerHour.value);
    screen.placeholder = `${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }:${seconds < 10 ? `0${seconds}` : seconds}`;
  } else {
    clearInterval(interval);
    interval = 0;
    minutes = 25;
    seconds = 0;
    screen.placeholder = '25:00';
  }
};

// Cronômetro
const watch = function () {
  seconds++;
  if (seconds > 59) {
    seconds = 0;
    minutes++;
  }
  if (minutes > 59) {
    minutes = 0;
    hours++;
  }
  screen.placeholder = `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }:${seconds < 10 ? `0${seconds}` : seconds}`;
};

// Timer
const timer = function () {
  seconds--;
  if (seconds < 0) {
    seconds = 59;
    minutes--;
  }
  if (minutes < 0) {
    minutes = 59;
    hours--;
  }
  if (hours < 0) {
    audio.play();
    clearInterval(interval);
    interval = 0;
    seconds = 0;
    minutes = 0;
    hours = 0;
  }
  screen.placeholder = `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }:${seconds < 10 ? `0${seconds}` : seconds}`;
};

// Pomodoro
const rest = function () {
  // Close modal rest
  modalRest.classList.add('hidden');
  overlay.classList.add('hidden');
  // Set rest
  screen.placeholder = '05:00';
  minutes = 5;
  // Start rest
  working = false;
  start();
};
const pomodoro = function () {
  seconds--;
  if (seconds < 0) {
    seconds = 59;
    minutes--;
  }
  if (minutes < 0) {
    clearInterval(interval);
    interval = 0;
    seconds = 0;
    minutes = 0;
    if (working) {
      audio.play();
      modalRest.classList.remove('hidden');
      overlay.classList.remove('hidden');
    } else {
      audio.play();
      working = true;
      minutes = 25;
      screen.placeholder = '25:00';
    }
  }
  screen.placeholder = `${minutes < 10 ? `0${minutes}` : minutes}:${
    seconds < 10 ? `0${seconds}` : seconds
  }`;
};

btnStart.addEventListener('click', start);
btnPause.addEventListener('click', pause);
btnStop.addEventListener('click', stop);
btnRest.addEventListener('click', rest);

const setTime = function () {
  modalSet.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
btnSet.addEventListener('click', setTime);

const save = function () {
  hours = Number(timerHour.value);
  minutes = Number(timerMinute.value);
  screen.placeholder = `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }:00`;
  close();
};
btnSave.addEventListener('click', save);

const close = function () {
  modalSet.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnClose.addEventListener('click', close);
overlay.addEventListener('click', close);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalSet.classList.contains('hidden')) {
    modalSet.classList.add('hidden');
    overlay.classList.add('hidden');
  }
});
