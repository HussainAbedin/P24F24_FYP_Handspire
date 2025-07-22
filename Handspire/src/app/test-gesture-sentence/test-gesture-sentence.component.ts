import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-test-gesture-sentence',
  templateUrl: './test-gesture-sentence.component.html',
  styleUrls: ['./test-gesture-sentence.component.css']
})
export class TestGestureSentenceComponent implements OnInit {

  @ViewChild('video', { static: true }) video!: ElementRef;
  result: any = null;
  capturing = false;
  capturedFrames: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.startCamera();
  }

  startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.video.nativeElement.srcObject = stream;
      })
      .catch(err => console.error('Camera error:', err));
  }

  captureImageSequence(frameCount: number = 30, intervalMs: number = 100) {
    const videoElement = this.video.nativeElement as HTMLVideoElement;
    this.result = null;
    this.capturing = true;
    this.capturedFrames = [];

    let count = 0;
    const interval = setInterval(() => {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
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
        this.result = res;
        this.capturing = false;
      },
      error: (err) => {
        console.error('Prediction API error:', err);
        this.capturing = false;
      }
    });
  }
}
