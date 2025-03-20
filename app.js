// Import TensorFlow.js and Speech Commands model
import * as tf from '@tensorflow/tfjs';
import * as speech from '@tensorflow-models/speech-commands';

// Initialize Speech Recognition
async function initSpeechRecognition() {
    const recognizer = speech.create('BROWSER_FFT');
    await recognizer.ensureModelLoaded();
    return recognizer;
}

// Start Listening for Speech
async function startListening(callback) {
    const recognizer = await initSpeechRecognition();
    recognizer.listen(result => {
        const words = recognizer.wordLabels();
        const transcript = words[result.scores.indexOf(Math.max(...result.scores))];
        callback(transcript);
    }, { probabilityThreshold: 0.75 });
}

// Simple Text Summarization (Placeholder)
function summarizeText(text) {
    const sentences = text.split('. ');
    return sentences.length > 1 ? sentences[0] + '.' : text;
}

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')

        .then(() => console.log('Service Worker Registered'))
        .catch(err => console.error('Service Worker Registration Failed', err));
}

// UI Logic
document.addEventListener('DOMContentLoaded', () => {
    const noteArea = document.getElementById('notes');
    const summarizeBtn = document.getElementById('summarize');
    const startBtn = document.getElementById('start');

    startBtn.addEventListener('click', () => {
        startListening(transcript => {
            noteArea.value += transcript + ' ';
        });
    });

    summarizeBtn.addEventListener('click', () => {
        noteArea.value = summarizeText(noteArea.value);
    });
});

