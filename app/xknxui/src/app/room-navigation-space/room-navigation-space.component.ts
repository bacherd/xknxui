import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-room-navigation-space',
  templateUrl: './room-navigation-space.component.html',
  styleUrls: ['./room-navigation-space.component.css']
})
export class RoomNavigationSpaceComponent implements OnInit {

    @Input() space_name: string = "";
    @Input() space: any = {};

    ngOnInit(): void {}

    public castToString(obj: any): string{
        return obj as string;
    }

    public hasProp(obj: any, name: string) {
        return obj.hasOwnProperty(name);
    }
}
