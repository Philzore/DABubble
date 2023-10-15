import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { ImprintComponent } from './imprint/imprint.component';
import { DataProtectionComponent } from './data-protection/data-protection.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainChatComponent } from './main-chat/main-chat.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChooseAvatarComponent } from './choose-avatar/choose-avatar.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  {path: '', component:LoginComponent},
  {path: 'register', component:RegisterComponent},
  {path: 'choose-avatar', component:ChooseAvatarComponent},
  {path: 'imprint', component: ImprintComponent},
  {path: 'dataprotection', component: DataProtectionComponent},
  {path: 'main-page', component: MainScreenComponent},
  {path: 'main-chat', component:MainChatComponent},
  {path: 'forgot-password', component:ForgotPasswordComponent},
  {path: 'change-password', component:ChangePasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
