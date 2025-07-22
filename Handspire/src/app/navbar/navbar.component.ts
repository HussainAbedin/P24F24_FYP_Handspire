import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private  route:Router){}
  gotoHome(){
this.route.navigate(['/'])
  }
  gotoAsl(){
    this.route.navigate(["asl-alphabets"])
  }
  gotoAboutUs(){
    this.route.navigate(["about-us"])
  }
  gotoHandDetection(){
    this.route.navigate(["hand-detection"])
  }
  gotoOurVision(){
    this.route.navigate(["our-vision"])
  }
  gototRefernce(){
    this.route.navigate(['reference'])
  }
  startaCall(){
     this.route.navigate(['vedio-chat'])
  }
}
