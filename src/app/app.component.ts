import { Component } from '@angular/core';

import { ToastService } from './services/toast.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'wikia-note';
  bg_image = "assets/images/bg2.jpg";
  
  bgIndex = 1;
  bg_image_container: any[] = [
    'bg1.jpg',
    'bg2.jpg',
    'bg3.jpg',
    'bg4.jpg',
    'bg5.jpg',
  ];

  constructor( public toastService: ToastService) {
    this.bgIndex = Math.floor(Math.random() * this.bg_image_container.length);
    this.bg_image = "assets/images/" + this.bg_image_container[this.bgIndex];
  }

}
