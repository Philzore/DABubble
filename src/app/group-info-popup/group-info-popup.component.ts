import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-group-info-popup',
  templateUrl: './group-info-popup.component.html',
  styleUrls: ['./group-info-popup.component.scss']
})
export class GroupInfoPopupComponent {

  constructor(public dialog: MatDialog) {}
  

}
