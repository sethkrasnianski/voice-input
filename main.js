const API_URL = 'https://4d50bbc5.ngrok.io';

const speak = document.querySelector('.speak');
const AudioContext = window.AudioContext || window.webkitAudioContext;
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia;

let recorder;
let audioContext;

const createAudioContext = () => {
  try {
    audioContext = new AudioContext();
  } catch (e) {
    alert('Web audio is not supported in this browser.');
    throw new Error('Web audio is not supported in this browser');
  }
};

const createRecorder = () => {
  navigator.getUserMedia(
    { audio: true },
    (stream) => {
      const input = audioContext.createMediaStreamSource(stream);
      recorder = new Recorder(input);
    }, () => {
      alert('This app is unable to work without microphone access.');
    }
  );
};

const Speaking = {
  start(e) {
    e.returnValue = false;

    speak.classList.add('speak__listen');
    recorder.record();
  },
  finish() {
    recorder.stop();
    recorder.exportWAV((audio) => {
      speak.classList.add('speak__listen');

      audio.lastModifiedDate = new Date();
      audio.name = 'file';

      const data = new FormData();
      data.append('file', audio);

      $.ajax({
        url: `${API_URL}/speech`,
        data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success() {
          recorder.clear();
          speak.classList.remove('speak__listen');
          speak.classList.add('speak__loading');
          audioContext.close();
        },
      });
    });
  },
};

createAudioContext();
createRecorder();

speak.addEventListener('mousedown', Speaking.start);
speak.addEventListener('touchstart', Speaking.start);

speak.addEventListener('mouseup', Speaking.finish);
speak.addEventListener('touchend', Speaking.finish);
