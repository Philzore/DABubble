import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro-animation',
  templateUrl: './intro-animation.component.html',
  styleUrls: ['./intro-animation.component.scss']
})
export class IntroAnimationComponent implements OnInit{
  animationStart: boolean = false;
  animationLogo: boolean = false;
  d_none: boolean = false;

  @Output() introComplete = new EventEmitter<boolean>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.animationStart = true;
      setTimeout(() => {
        this.animationLogo = true;
        
        setTimeout(() => {
          this.d_none = true;
          this.introComplete.emit(true);
          this.router.navigate(['/login']);
        }, 600);
      }, 1000);
    }, 1000);
  }
}
