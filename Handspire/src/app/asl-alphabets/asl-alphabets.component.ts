import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asl-alphabets',
  templateUrl: './asl-alphabets.component.html',
  styleUrls: ['./asl-alphabets.component.css']
})
export class AslAlphabetsComponent {
  isEnglish = true;

  constructor(private router: Router) {}

  toggleLanguage() {
    this.isEnglish = !this.isEnglish;
  }

  englishASL = [
    { letter: 'A', image: 'assets/images/ha.PNG' },
    { letter: 'B', image: 'assets/images/hb.PNG' },
    { letter: 'C', image: 'assets/images/hc.PNG' },
    { letter: 'D', image: 'assets/images/hd.PNG' },
    { letter: 'E', image: 'assets/images/he.PNG' },
    { letter: 'F', image: 'assets/images/hf.PNG' },
    { letter: 'G', image: 'assets/images/hg.PNG' },
    { letter: 'H', image: 'assets/images/hi.PNG' },
    { letter: 'I', image: 'assets/images/hh.PNG' },
    { letter: 'J', image: 'assets/images/hj.PNG' },
    { letter: 'K', image: 'assets/images/hk.PNG' },
    { letter: 'L', image: 'assets/images/hl.PNG' },
    { letter: 'M', image: 'assets/images/hm.PNG' },
    { letter: 'N', image: 'assets/images/hn.PNG' },
    { letter: 'O', image: 'assets/images/ho.PNG' },
    { letter: 'P', image: 'assets/images/hp.PNG' },
    { letter: 'Q', image: 'assets/images/hq.PNG' },
    { letter: 'R', image: 'assets/images/hr.PNG' },
    { letter: 'S', image: 'assets/images/hs.PNG' },
    { letter: 'T', image: 'assets/images/ht.PNG' },
    { letter: 'U', image: 'assets/images/hu.PNG' },
    { letter: 'V', image: 'assets/images/hv.PNG' },
    { letter: 'W', image: 'assets/images/hw.PNG' },
    { letter: 'X', image: 'assets/images/hx.PNG' },
    { letter: 'Y', image: 'assets/images/hy.PNG' },
    { letter: 'Z', image: 'assets/images/hz.PNG' }
  ];

  urduASL = [
    { letter: 'ا', image: 'assets/images/alif.PNG' },
    { letter: 'ب', image: 'assets/images/bai.PNG' },
    { letter: 'پ', image: 'assets/images/pai.PNG' },
    { letter: 'ت', image: 'assets/images/tai.PNG' },
    { letter: 'ٹ', image: 'assets/images/tea.PNG' },
    { letter: 'ث', image: 'assets/images/sai.PNG' },
    { letter: 'ج', image: 'assets/images/jeem.PNG' },
    { letter: 'چ', image: 'assets/images/chai.PNG' },
    { letter: 'ح', image: 'assets/images/hein.PNG' },
    { letter: 'خ', image: 'assets/images/khai.PNG' },
    { letter: 'ذ', image: 'assets/images/tai.PNG' },
    { letter: 'د', image: 'assets/images/dal.PNG' },
    { letter: 'ڑ', image: 'assets/images/Raay.PNG' },
    { letter: 'ڈ', image: 'assets/images/daal.PNG' },
    { letter: 'ژ', image: 'assets/images/ray.PNG' },
    { letter: 'ر', image: 'assets/images/ray.PNG' },
    { letter: 'ش', image: 'assets/images/sheen.PNG' },
    { letter: 'ز', image: 'assets/images/fai.PNG' },
    { letter: 'س', image: 'assets/images/seen.PNG' },
    { letter: 'ط', image: 'assets/images/tua.PNG' },
    { letter: 'ص', image: 'assets/images/suad.PNG' },
    { letter: 'ض', image: 'assets/images/duad.PNG' },
    { letter: 'ظ', image: 'assets/images/zua.PNG' },
    { letter: 'ع', image: 'assets/images/aien.PNG' },
    { letter: 'غ', image: 'assets/images/gain.PNG' },
    { letter: 'ف', image: 'assets/images/fai.PNG' },
    { letter: 'ق', image: 'assets/images/kaaf.PNG' },
    { letter: 'ک', image: 'assets/images/keef.PNG' },
    { letter: 'گ', image: 'assets/images/sai.PNG' },
    { letter: 'ل', image: 'assets/images/laam.PNG' },
    { letter: 'م', image: 'assets/images/meem.PNG' },
    { letter: 'ن', image: 'assets/images/noon.PNG' },
    { letter: 'و', image: 'assets/images/waaw.PNG' },
    { letter: 'ہ', image: 'assets/images/hai.PNG' },
    { letter: 'ء', image: 'assets/images/ashar.PNG' },
    { letter: 'ی', image: 'assets/images/chotiyai.PNG' },
    { letter: 'ے', image: 'assets/images/bariyai.PNG' }
  ];

  get currentASL() {
    return this.isEnglish ? this.englishASL : this.urduASL;
  }

  gotoEnglish() {
    this.router.navigate(['english-asl']);
  }

  gotoUrdu() {
    this.router.navigate(['urdu-asl']);
  }
}