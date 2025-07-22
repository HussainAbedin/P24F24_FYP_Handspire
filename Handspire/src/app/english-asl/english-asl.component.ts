import { Component, OnInit } from '@angular/core';
import { AslService } from '../asl.service';

@Component({
  selector: 'app-english-asl',
  templateUrl: './english-asl.component.html',
  styleUrls: ['./english-asl.component.css']
})
export class EnglishAslComponent implements OnInit {
  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  aslImages: { letter: string, image: string }[] = [];
  displayedASLImages: { letter: string, image: string }[] = [];

  constructor(private aslService: AslService) {}

ngOnInit() {
  this.alphabet.forEach((letter) => {
    this.aslService.getAslImagesEnglish(letter).subscribe((data) => {
      if (data.imagePath) {
        this.aslImages.push({
          letter,
          image: '/' + data.imagePath
        });
      }
    });
  });
}

  showASL(letter: string): void {
    const image = this.aslImages.find(item => item.letter === letter);
    if (image) {
      this.displayedASLImages.push(image);

      // Play a sound
      const audio = document.getElementById('tingSound') as HTMLAudioElement;
      if (audio) {
        audio.currentTime = 0; // Reset to start
        audio.play();
      }

      // Speak the letter
      this.speakLetter(letter);
    }
  }

  speakLetter(letter: string): void {
    const msg = new SpeechSynthesisUtterance(letter);
    msg.lang = 'en-US'; // Set the language to English
    window.speechSynthesis.speak(msg);
  }

  deleteImage(): void {
    this.displayedASLImages.pop();
  }

  cutImages(): void {
    this.displayedASLImages = [];
  }
}
