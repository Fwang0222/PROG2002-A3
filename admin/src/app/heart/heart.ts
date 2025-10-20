import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-heart',
  imports: [],
  templateUrl: './heart.html',
  styleUrl: './heart.css'
})
export class Heart  implements OnInit {
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {
    const colors = ['#ff6b6b', '#ff8e8e', '#ff9aa2', '#ffb3ba', '#ffccd5', '#ff8fab', '#ffa8a8',];

    // create 25 heart
    for (let i = 0; i < 25; i++) {
      const heart = this.renderer.createElement('div');
      this.renderer.addClass(heart, 'heart');

      // random attributes
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100 + 'vw';
      const top = Math.random() * 100 + 'vh';
      const duration = 6 + Math.random() * 4 + 's';
      const delay = Math.random() * 5 + 's';
      const opacity = 0.6 + Math.random() * 0.4;
      const scale = 0.6 + Math.random() * 0.6;

      // set style
      this.renderer.setStyle(heart, 'background-color', color);
      this.renderer.setStyle(heart, 'left', left);
      this.renderer.setStyle(heart, 'top', top);
      this.renderer.setStyle(heart, 'animation-duration', duration);
      this.renderer.setStyle(heart, 'animation-delay', delay);
      this.renderer.setStyle(heart, 'opacity', opacity);
      this.renderer.setStyle(heart, 'transform', `scale(${scale}) rotate(45deg)`);

      // append to root element
      this.renderer.appendChild(this.el.nativeElement, heart);
    }
  }
}
