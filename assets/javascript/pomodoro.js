
const TIMER_INTERVAL_MS = 1000;


function Pomodoro(wrapper) {
  // Initialize Timer State
  this.time = 0;
  this.timer = null;
  this.running = false;

  // Grab References to Child Elements
  this.startButton = wrapper.querySelector('button#start');
  this.resetButton = wrapper.querySelector('button#reset');
  this.pauseButton = wrapper.querySelector('button#pause');
  this.hoursSpan = wrapper.querySelector('span#hours');
  this.minutesSpan = wrapper.querySelector('span#minutes');
  this.secondsSpan = wrapper.querySelector('span#seconds');
  this.reminderIntervalInput = wrapper.querySelector('input#reminder');
  this.goalTimeInput = wrapper.querySelector('input#goal');

  // Attach Listeners to Buttons
  this.startButton.addEventListener('click', e => this.start());
  this.resetButton.addEventListener('click', e => this.reset());
  this.pauseButton.addEventListener('click', e => this.pause());
};

Pomodoro.prototype.start = function () {
  if (this.running) {
    console.warn('pomodoro: attempted `start` event while running')
    return;
  }

  this.running = true;
  this.startButton.disabled = true;

  this.timer = setInterval(() => this.increment(), TIMER_INTERVAL_MS);
};

Pomodoro.prototype.reset = function () {
  this.pause();
  this.time = 0;
};

Pomodoro.prototype.pause = function () {
  this.running = false;
  this.startButton.disabled = false;

  clearInterval(this.timer);
  this.timer = null;
};

Pomodoro.prototype.increment = function () {
  this.time += 1;
  this.renderTime();

  const goalTime = this.getGoalTime();
  const reminderInterval = this.getReminderInterval();

  if (this.time > goalTime && (this.time % reminderInterval) === 0) {
    this.notifyCurrentState();
  }
};

Pomodoro.prototype.notifyCurrentState = function () {
  Notification.requestPermission().then((result) => {
    if (result !== 'granted') {
      console.warn('pomodoro: notifications not enabled; skipping notification');
      return;
    }

    return new Notification(`pomodoro: current time — ${this.getFormattedTime()}`);
  });
};

Pomodoro.prototype.renderTime = function () {
  const { hours, minutes, seconds } = this.getTimeInfo();

  this.hoursSpan.innerHTML = _zeroPad(hours);
  this.minutesSpan.innerHTML = _zeroPad(minutes);
  this.secondsSpan.innerHTML = _zeroPad(seconds);
};

Pomodoro.prototype.getTimeInfo = function () {
  const hours = Math.floor(this.time / (60*60));
  const minutes = Math.floor((this.time - hours*60) / 60);
  const seconds = this.time - minutes*60;

  return { hours, minutes, seconds };
};

Pomodoro.prototype.getFormattedTime = function () {
    const { hours, minutes, seconds } = this.getTimeInfo();

    return `${_zeroPad(hours)}:${_zeroPad(minutes)}:${_zeroPad(seconds)}`;
};

function _zeroPad (integer) {
  const string = String(integer);
  if (string.length === 1) {
    return '0' + string;
  }
  return string;
}

Pomodoro.prototype.getGoalTime = function () {
  return (+this.goalTimeInput.value) * 60;
}

Pomodoro.prototype.getReminderInterval = function () {
  return (+this.reminderIntervalInput.value) * 60;
}

document.addEventListener('DOMContentLoaded', () => {
  /*

   # ------ Pomodoro Entry ------ #

  */
  wrapper = document.getElementById('pomodoro');

  if (!wrapper) {
    throw 'pomodoro: unable to find `#pomodoro` wrapper element';
  }

  console.info('pomodoro: initializing new app');
  window.pomodoro = new Pomodoro(wrapper);
});
