import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { ImprintComponent } from './imprint/imprint.component';
import { DataProtectionComponent } from './data-protection/data-protection.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainChatComponent } from './main-chat/main-chat.component';

const routes: Routes = [
  {path: '', component:LoginComponent},
  {path: 'imprint', component: ImprintComponent},
  {path: 'dataprotection', component: DataProtectionComponent},
  {path: 'main-page', component: MainScreenComponent},
  {path: 'main-chat', component:MainChatComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
