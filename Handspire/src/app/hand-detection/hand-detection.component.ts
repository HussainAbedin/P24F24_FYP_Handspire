import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-hand-detection',
  templateUrl: './hand-detection.component.html',
  styleUrls: ['./hand-detection.component.css']
})
export class HandDetectionComponent {
  @ViewChild('azVideo', { static: true }) azVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('sentenceVideo', { static: true }) sentenceVideoRef!: ElementRef<HTMLVideoElement>;

  prediction: string = '';
  sentenceResult: any = null;
  isLoadingAz: boolean = false;
  capturing: boolean = false;
  capturedImage: string = '';
  capturedFrames: string[] = [];
  history: { image: string, prediction: string }[] = [];

  azCameraStarted: boolean = false;
  sentenceCameraStarted: boolean = false;

  constructor(private http: HttpClient) {}

  startAzCamera() {
    if (this.sentenceCameraStarted) {
      alert('Please stop Sentence Detection before starting A-Z Detection.');
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.azVideoRef.nativeElement.srcObject = stream;
      this.azCameraStarted = true;
    }).catch(err => {
      this.prediction = 'Camera access denied';
    });
  }

  stopAzCamera() {
    const stream = this.azVideoRef.nativeElement.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    this.azCameraStarted = false;
  }

  startSentenceCamera() {
    if (this.azCameraStarted) {
      alert('Please stop A-Z Detection before starting Sentence Detection.');
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.sentenceVideoRef.nativeElement.srcObject = stream;
      this.sentenceCameraStarted = true;
    }).catch(err => {
      console.error('Camera error:', err);
    });
  }

  stopSentenceCamera() {
    const stream = this.sentenceVideoRef.nativeElement.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    this.sentenceCameraStarted = false;
  }

  captureAndDetect() {
    if (!this.azCameraStarted) {
      alert('Please start the A-Z camera first.');
      return;
    }

    const video = this.azVideoRef.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/jpeg');
    this.capturedImage = base64Image;
    this.isLoadingAz = true;

    this.http.post<any>('http://localhost:5001/detect', { image: base64Image }).subscribe({
      next: (res) => {
        this.isLoadingAz = false;
        this.prediction = res.prediction || 'No hand detected';
        this.speakPrediction(this.prediction);
        this.addToHistory(base64Image, 'A-Z: ' + this.prediction);
      },
      error: () => {
        this.isLoadingAz = false;
        this.prediction = 'Error detecting hand sign';
      }
    });
  }

  captureImageSequence(frameCount: number = 30, intervalMs: number = 100) {
    if (!this.sentenceCameraStarted) {
      alert('Please start the Sentence Detection camera first.');
      return;
    }

    const video = this.sentenceVideoRef.nativeElement;
    this.capturing = true;
    this.sentenceResult = null;
    this.capturedFrames = [];
  

    let count = 0;
    const interval = setInterval(() => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/jpeg');
        this.capturedFrames.push(base64Image);
      }
      count++;
      if (count >= frameCount) {
        clearInterval(interval);
        this.sendSequenceToServer();
      }
    }, intervalMs);
  }

 sendSequenceToServer() {
  this.http.post<any>('http://localhost:5000/predict_sequence', {
    frames: this.capturedFrames
  }).subscribe({
    next: (res) => {
      this.sentenceResult = res;
      this.addToHistory(this.capturedFrames[0], 'Sentence: ' + res.prediction);
      this.speakPrediction(this.sentenceResult.prediction);  // 👈 Add this line
      this.capturing = false;
    },
    error: (err) => {
      console.error('Prediction API error:', err);
      this.capturing = false;
    }
  });
}

  addToHistory(image: string, prediction: string) {
    this.history.unshift({ image, prediction });
    if (this.history.length > 3) {
      this.history.pop();
    }
  }

  speakPrediction(prediction: string) {
    const speech = new SpeechSynthesisUtterance(prediction);
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
  }
  resetAll() {
  this.stopAzCamera();
  this.stopSentenceCamera();
  this.prediction = '';
  this.sentenceResult = null;
  this.capturedImage = '';
  this.history = [];
}

}
