import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutAslComponent } from './about-asl/about-asl.component';
import { AslAlphabetsComponent } from './asl-alphabets/asl-alphabets.component';
import { EnglishAslComponent } from './english-asl/english-asl.component';
import { UrduAslComponent } from './urdu-asl/urdu-asl.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { OurVisionComponent } from './our-vision/our-vision.component';
import { ReferenceComponent } from './reference/reference.component';
import { HandDetectionComponent } from './hand-detection/hand-detection.component';

import { VedioChatComponent } from './vedio-chat/vedio-chat.component';
import { TestGestureSentenceComponent } from './test-gesture-sentence/test-gesture-sentence.component';


const routes: Routes = [
{path:"" ,component:HomeComponent},
  {path:"asl-alphabets",component:AslAlphabetsComponent},
  {path:"about-asl",component:AboutAslComponent},
   {path:"english-asl",component:EnglishAslComponent},
   {path:"urdu-asl",component:UrduAslComponent},
   {path:"hand-detection",component:HandDetectionComponent},

    {path:"vedio-chat",component:VedioChatComponent},
   {path:"our-vision",component:OurVisionComponent},
   {path:"reference",component:ReferenceComponent},
    {path:"about-us",component:AboutUsComponent},

{path:"test-sentence",component:TestGestureSentenceComponent}
  
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
