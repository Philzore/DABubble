import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { DesktopHeaderComponent } from './desktop-header/desktop-header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ImprintComponent } from './imprint/imprint.component';
import { DataProtectionComponent } from './data-protection/data-protection.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTreeModule} from '@angular/material/tree';
import {MatButtonModule} from '@angular/material/button';
import { MainChatComponent } from './main-chat/main-chat.component';
import {MatListModule} from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, matFormFieldAnimations } from '@angular/material/form-field';
import { GroupInfoPopupComponent } from './group-info-popup/group-info-popup.component';
import {MatDialogModule} from '@angular/material/dialog';
import { GroupMemberComponent } from './group-member/group-member.component';
import { GroupAddMemberComponent } from './group-add-member/group-add-member.component';
import { ChooseAvatarComponent } from './choose-avatar/choose-avatar.component';


@NgModule({
  declarations: [
    AppComponent,
    MainScreenComponent,
    DesktopHeaderComponent,
    SidebarComponent,
    ImprintComponent,
    DataProtectionComponent,
    LoginComponent,
    RegisterComponent,
    MainChatComponent,
    GroupInfoPopupComponent,
    GroupMemberComponent,
    GroupAddMemberComponent,
    ChooseAvatarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatInputModule,
    MatToolbarModule,
    MatFormFieldModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatCardModule,
    MatTreeModule,
    MatButtonModule,
    MatListModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
