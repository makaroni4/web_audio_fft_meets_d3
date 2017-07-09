// https://github.com/GoogleChrome/guitar-tuner
function AudioProcessor() {
  this.FFTSIZE = 2048 * 4;
  this.stream = null;
  this.audioContext = new AudioContext();
  this.analyser = this.audioContext.createAnalyser();
  this.gainNode = this.audioContext.createGain();
  this.microphone = null;

  this.gainNode.gain.value = 0;
  this.analyser.fftSize = this.FFTSIZE;
  this.analyser.smoothingTimeConstant = 0.1;

  this.frequencyBufferLength = this.FFTSIZE;
  this.frequencyBuffer = new Float32Array(this.frequencyBufferLength / 2);
  this.timeBuffer = new Float32Array(this.frequencyBufferLength);

  this.sendingAudioData = false;

  var freqStep = this.audioContext.sampleRate / this.FFTSIZE;
  var waveBufferChart = new AudioWaveChart("js-wave-buffer", this.audioContext.sampleRate);
  var guitarWaveBufferChart = new AudioWaveChart("js-guitar-wave-buffer", freqStep * 130);

  var that = this;

  that.requestUserMedia = function () {
    navigator.getUserMedia({audio: true}, (stream) => {
      that.sendingAudioData = true;
      that.stream = stream;
      that.microphone = that.audioContext.createMediaStreamSource(stream);
      that.microphone.connect(that.analyser);
      that.analyser.connect(that.gainNode);
      that.gainNode.connect(that.audioContext.destination);

      requestAnimationFrame(that.dispatchAudioData);
    }, (err) => {
      alert("Unable to access the microphone");
      console.log(err);
    });
  }

  this.attached = function() {
    // Set up the stream kill / setup code for visibility changes.
    document.addEventListener('visibilitychange', this.onVisibilityChange);

    // Then call it.
    this.onVisibilityChange();
  }

  this.detached = function() {
    this.sendingAudioData = false;
  }

  this.onVisibilityChange = function() {
    if (document.hidden) {
      that.sendingAudioData = false;

      if (that.stream) {
        // Chrome 47+
        that.stream.getAudioTracks().forEach((track) => {
          if ('stop' in track) {
            track.stop();
          }
        });

        // Chrome 46-
        if ('stop' in that.stream) {
          that.stream.stop();
        }
      }

      that.stream = null;
    } else {
      that.requestUserMedia();
    }

  }

  this.findNoteFreq = function(time) {
    that.analyser.getFloatTimeDomainData(that.timeBuffer);
    that.analyser.getFloatFrequencyData(that.frequencyBuffer);
    freq = that.frequencyBuffer;
    wave = that.timeBuffer;

    waveBufferChart.plotWave(freq);
    guitarWaveBufferChart.plotWave(freq.slice(0, 130));
  }


  this.dispatchAudioData = function(time) {
    if (that.sendingAudioData) {
      requestAnimationFrame(that.dispatchAudioData);
    }

    that.findNoteFreq(time);
  }
}
