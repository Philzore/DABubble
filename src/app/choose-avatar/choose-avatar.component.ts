import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-choose-avatar',
  templateUrl: './choose-avatar.component.html',
  styleUrls: ['./choose-avatar.component.scss']
})
export class ChooseAvatarComponent {
  @ViewChild('fileInput') fileInput: any;

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Hier kannst du die ausgewählte Datei weiterverarbeiten, z.B. hochladen oder anzeigen
      console.log('Ausgewählte Datei:', selectedFile);
    }
  }
}
