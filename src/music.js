import presto from './sonata-presto'

class Music {
  audioContext = null;
  currentSetOfNotesIndex = 0;
  gain = null;
  noteLength = 0.170000;
  timeBetweenNotes = 0.030000;
  frequencyTable = {};
  allNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  defaultAccentGain = 0.200000;
  defaultNormalGain = 0.100000;
  currentOscillators = [];

  constructor() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();

    this.sheetMusic = presto;

    this.gain = this.audioContext.createGain();
    this.gain.connect(this.audioContext.destination);
    this.gain.gain.value = 0;

    this.populateFrequencyTable();
  }

  populateFrequencyTable() {
    const octaves = 8;
    let currentOctave = 0;

    while (currentOctave < octaves) {
      for (let index = 0; index < this.allNotes.length; index++) {
        const note = this.allNotes[index];
        const noteWithOctave = `${note}${currentOctave}`;
        this.frequencyTable[noteWithOctave] = this.frequencyToPlay(noteWithOctave);
      }

      currentOctave++;
    }
  }

  percentProgressThroughPiece() {
    const progress = this.currentSetOfNotesIndex / this.sheetMusic.length;
    return `${Math.round(progress * 100)}%`;
  }

  playNextSetOfNotes() {
    this.playNotes(this.sheetMusic[this.currentSetOfNotesIndex]);
    this.currentSetOfNotesIndex++;

    if (this.currentSetOfNotesIndex >= this.sheetMusic.length) {
      this.currentSetOfNotesIndex = 0;
    }
  }

  playAll() {
    this.playFrom(0);
  }

  stopAllSounds() {
    const currentTime = this.audioContext.currentTime;
    this.gain.gain.cancelScheduledValues(currentTime);
    this.currentOscillators.forEach((osc) => {
      osc.disconnect();
    });
  }

  playProgress() {
    const notes = this.sheetMusic
      .slice(0, this.currentSetOfNotesIndex)
      .reduce((prevValue, element) => prevValue.concat(element));

    this.playNotes(notes);
  }

  playFrom(index) {
    const notes = this.sheetMusic.slice(index).reduce((prevValue, element) => prevValue.concat(element));
    this.playNotes(notes);
  }

  playNotes(notes) {
    this.stopAllSounds();
    const processedNotes = notes.map((note) => this.processNoteData(note));
    this.currentOscillators = [];

    let timeToPlay = this.audioContext.currentTime;
    processedNotes.forEach((processedNote) => {
      for (let index = 0; index < processedNote.frequencies.length; index++) {
        const frequency = processedNote.frequencies[index];
        const oscillator = this.audioContext.createOscillator();
        const timeToEnd = timeToPlay + this.noteLength * processedNote.noteLength;
        oscillator.type = 'square';
        oscillator.connect(this.gain);
        oscillator.frequency.value = frequency;
        this.currentOscillators.push(oscillator);
  
        if (processedNote.isAccent) {
          // Ramping to correct gain value makes the attack smoother and just makes things sound better
          // It also gives it a slightly springier feel, which suites this piece :P
          this.gain.gain.exponentialRampToValueAtTime(this.defaultAccentGain, timeToPlay + 0.0001);
        } else {
          this.gain.gain.exponentialRampToValueAtTime(this.defaultNormalGain, timeToPlay + 0.0001);
        }
  
        this.gain.gain.exponentialRampToValueAtTime(0.000001, timeToPlay);
        oscillator.start(timeToPlay);
        this.gain.gain.exponentialRampToValueAtTime(0.000001, timeToEnd - 0.0001);
        oscillator.stop(timeToEnd);
      }
      
      timeToPlay += (this.noteLength * processedNote.noteLength + this.timeBetweenNotes);
    });
  }

  processNoteData(note) {
    // Note comes in the form E5, Ab3-a-t2, or D3-C4-D5-a-t6, etc.
    // lowercase a stands for accent, lowercase t followed by a number is 
    // note length (2 is twice the base note length)
    // Multiple notes together mean that it's a chord
    const noteBits = note.split('-');
    let processedNote = {
      isAccent: false,
      noteLength: 1,
      frequencies: [],
    }

    noteBits.forEach((noteInfo) => {
      if (noteInfo === 'a') {
        processedNote.isAccent = true;
      } else if (noteInfo[0] === 't') {
        processedNote.noteLength = parseInt(noteInfo.replace('t', ''));
      } else {
        const frequency = this.frequencyTable[noteInfo];

        if (frequency) {
          processedNote.frequencies.push(frequency);
        }
      }
    });

    return processedNote;
  }

  frequencyToPlay(note) {
    const halfstepswayFromC0 = this.determineHalfstepsAwayFromC0(note);
    return this.determineFrequency(halfstepswayFromC0);
  }

  determineFrequency(halfstepswayFromC0) {
    // C 16.35 is C0
    return 16.35 * Math.pow(1.05946309436, halfstepswayFromC0);
  }

  determineHalfstepsAwayFromC0(note) {
    // Note format is Ab3, only supports flats
    const notes = this.allNotes;
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