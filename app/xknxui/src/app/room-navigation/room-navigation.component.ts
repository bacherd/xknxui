import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-room-navigation',
  templateUrl: './room-navigation.component.html',
  styleUrls: ['./room-navigation.component.css']
})
export class RoomNavigationComponent implements OnInit {

    @Input() locations: any = {};

    space: any = {}
    space_name: string = "";

    ngOnInit(): void {
        this.space_name = Object.keys(this.locations)[0]
        this.space = Object.values(this.locations)[0]
    }

}
