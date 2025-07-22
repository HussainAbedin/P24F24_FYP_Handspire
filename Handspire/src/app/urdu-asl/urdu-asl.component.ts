import { Component, OnInit } from '@angular/core';
import { AslService } from '../asl.service';

@Component({
  selector: 'app-urdu-asl',
  templateUrl: './urdu-asl.component.html',
  styleUrls: ['./urdu-asl.component.css']
})
export class UrduAslComponent implements OnInit {
  urduAlphabet: string[] = [
    'ا', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ',
    'د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'ژ', 'س', 'ش', 'ص',
    'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل',
    'م', 'ن', 'ں', 'و', 'ہ', 'ء', 'ی', 'ے'
  ];
  
  aslImages: { letter: string, image: string }[] = [];
  displayedASLImages: { letter: string, image: string }[] = [];

  constructor(private aslService: AslService) {}

  ngOnInit() {
    // Fetch the ASL images for Urdu letters on initialization
    this.urduAlphabet.forEach((letter) => {
      this.aslService.getAslImagesUrdu(letter).subscribe((data) => {
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
    msg.lang = 'ur-PK'; // Set the language to Urdu
    window.speechSynthesis.speak(msg);
  }

  deleteImage(): void {
    this.displayedASLImages.pop();
  }

  cutImages(): void {
    this.displayedASLImages = [];
  }
}
