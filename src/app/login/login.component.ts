import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';


RouterLink
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hide = true;

  constructor(private router: Router) {}
}
