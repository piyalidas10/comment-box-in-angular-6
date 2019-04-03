import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('sliderBox') sliderRef: ElementRef;
  slideCt = [];

  constructor() {
    this.slideCt = [
      {
        url: 'https://webibazaar.com/Prestashop/PS_Electronics10/modules/wbimageslider/views/img/slider-1.jpg',
        title: 'Los Angeles',
        caption: 'We had such a great time in LA!'
      },
      {
        url: 'https://webibazaar.com/Prestashop/PS_Electronics10/modules/wbimageslider/views/img/slider-2.jpg',
        title: 'Chicago',
        caption: 'Thank you, Chicago!'
      }
    ];
  }

  ngAfterViewInit() {
    const list = this.sliderRef.nativeElement.querySelectorAll('.carousel-indicators > li');
    for (let i = 0; i < list.length; i++) {
      list[0].classList.add('active');
    }
    const items = this.sliderRef.nativeElement.querySelectorAll('.carousel-item');
    for (let i = 0; i < items.length; i++) {
      items[0].classList.add('active');
    }
  }

  showArraow() {
    const leftArrow = this.sliderRef.nativeElement.querySelector('.carousel-control-prev').style;
    const rightArrow = this.sliderRef.nativeElement.querySelector('.carousel-control-next').style;
    leftArrow.left = '0';
    leftArrow.opacity = '1';
    rightArrow.right = '0';
    rightArrow.opacity = '1';
  }

  hideArraow() {
    const leftArrow = this.sliderRef.nativeElement.querySelector('.carousel-control-prev').style;
    const rightArrow = this.sliderRef.nativeElement.querySelector('.carousel-control-next').style;
    leftArrow.left = '-70px';
    leftArrow.opacity = '0';
    rightArrow.right = '-70px';
    rightArrow.opacity = '0';
  }

}
