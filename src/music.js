import presto from './sonata-presto'

class Music {
  audioContext = null;
  currentSetOfNotesIndex = 0;
  normalGain = null;
  accentGain = null;
  noteLength = 0.25;
  timeBetweenNotes = 0.3;

  constructor() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();

    this.sheetMusic = presto;

    this.normalGain = this.audioContext.createGain();
    this.normalGain.connect(this.audioContext.destination);
    this.normalGain.gain.value = 0.6;

    this.accentGain = this.audioContext.createGain();
    this.accentGain.connect(this.audioContext.destination);
    this.accentGain.gain.value = 0.8;

    const oscillator = this.audioContext.createOscillator();
    oscillator.connect(this.normalGain);

    this.accentOscillator = this.audioContext.createOscillator();
    this.accentOscillator.connect(this.accentGain);
  }

  playNextSetOfNotes() {
    this.playNotes(this.sheetMusic[this.currentSetOfNotesIndex]);
    this.currentSetOfNotesIndex++;
  }

  playNotes(notes) {
    const frequencies = notes.map((note) => this.frequencyToPlay(note));
    let timeToPlay = this.audioContext.currentTime;
    let isFirstBeat = true;

    frequencies.forEach((freq) => {
      const oscillator = this.audioContext.createOscillator();

      if (isFirstBeat) {
        oscillator.connect(this.accentGain);
      } else {
        oscillator.connect(this.normalGain);
      }

      oscillator.frequency.value = freq;
      oscillator.start(timeToPlay);
      oscillator.stop(timeToPlay + this.noteLength);
      timeToPlay += this.timeBetweenNotes;
      isFirstBeat = false;
    });
  }

  frequencyToPlay(note) {
    const halfstepswayFromC0 = this.determineHalfstepsAwayFromC0(note);
    return this.determineFrequency(halfstepswayFromC0);
  }

  determineFrequency(halfstepswayFromC0) {
    console.log(halfstepswayFromC0);
    // C 16.35 is C0
    return 16.35 * Math.pow(1.05946309436, halfstepswayFromC0);
  }

  determineHalfstepsAwayFromC0(note) {
    // Note format is Ab3, only supports flats
    const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    let steps = 0;
    let index = 0;
    let octave = 0;
    let currentNote = 'C0';
    
    while (currentNote != note) {
      index++

      if (index >= notes.length) {
        index = 0;
        octave++;
      }

      currentNote = `${notes[index]}${octave}`;
      steps++;
    }

    return steps;
  }
};

export default Music;