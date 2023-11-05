import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserDataService } from '../services/user-data.service';
import { animate, sequence, style, transition, trigger } from '@angular/animations';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-group-add-member',
  templateUrl: './group-add-member.component.html',
  styleUrls: ['./group-add-member.component.scss'],
  animations:[ trigger("dropDownMenu", [
    transition(":enter", [
      style({ height: 0, overflow: "hidden" }),
      sequence([
        animate("200ms", style({ height: "*" })),
      ])
    ]),
    transition(":leave", [
      style({ height: "*", overflow: "hidden" }),
      sequence([
        animate("200ms", style({ height: 0 }))
      ])
    ])
  ]),
]
})
export class GroupAddMemberComponent implements OnInit{
  messageDropdown: boolean = false;
  actMembers = this.userDataService.usersFromDatabase;
  actAddMembers = [] ;

  constructor(
    public dialogRef:MatDialogRef<GroupAddMemberComponent>,
    public userDataService: UserDataService,
    public sharedService: SharedService,
    ) {}

    ngOnInit(): void {
      
    }

   /**
   * open drop down for direct messages
   * 
   */
   openDropdownMessages() {
    this.messageDropdown = !this.messageDropdown;
  }

  addMember(userPosition) {
    console.log('geclickter User:' ,userPosition);
    console.log('geclickter User:' ,this.actMembers);

    this.actAddMembers.push(this.actMembers[userPosition]);
    this.actMembers.splice(userPosition,1);

    console.log('User welche geaddet werden:' ,this.actAddMembers);
  }

  removeUser(userPosition) {
    this.actMembers.push(this.actAddMembers[userPosition]);
    this.actAddMembers.splice(userPosition,1);
  }
}
