import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { AboutAslComponent } from './about-asl/about-asl.component';
import { AslAlphabetsComponent } from './asl-alphabets/asl-alphabets.component';
import { EnglishAslComponent } from './english-asl/english-asl.component';
import { UrduAslComponent } from './urdu-asl/urdu-asl.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { OurVisionComponent } from './our-vision/our-vision.component';
import { ReferenceComponent } from './reference/reference.component';
import { FormsModule } from '@angular/forms';
import { HandDetectionComponent } from './hand-detection/hand-detection.component';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { VedioChatComponent } from './vedio-chat/vedio-chat.component';
import { TestGestureSentenceComponent } from './test-gesture-sentence/test-gesture-sentence.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    AboutAslComponent,
    AslAlphabetsComponent,
    EnglishAslComponent,
    UrduAslComponent,
    AboutUsComponent,
    OurVisionComponent,
    ReferenceComponent,
    HandDetectionComponent,
    VedioChatComponent,
    TestGestureSentenceComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule ,
    FormsModule,
     provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore())
 
  ],
  providers: [
    provideClientHydration(),
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
