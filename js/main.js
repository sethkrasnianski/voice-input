const speak = document.querySelector('.speak');

const Speaking = {
  start(e) {
    e.returnValue = false;
    speak.classList.add('speak__listen');
  },
  finish() {
    speak.classList.remove('speak__listen');
    speak.classList.add('speak__loading');
  },
};

speak.addEventListener('mousedown', Speaking.start);
speak.addEventListener('touchstart', Speaking.start);

speak.addEventListener('mouseup', Speaking.finish);
speak.addEventListener('touchend', Speaking.finish);
