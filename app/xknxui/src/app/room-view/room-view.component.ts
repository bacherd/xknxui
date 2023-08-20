import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DefaultService } from '../apimodule/api/default.service';

@Component({
  selector: 'app-room-view',
  templateUrl: './room-view.component.html',
  styleUrls: ['./room-view.component.css']
})
export class RoomViewComponent implements OnInit {

   gridCols: number = 1;
   private cardWidth: number = 420;

   public space: any;
   public functions: any;

   constructor(private defaultService: DefaultService,
               private router: Router,
               private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.gridCols = (window.innerWidth <= this.cardWidth) ?
            1 : Math.floor((window.innerWidth)/this.cardWidth);

        this.route.params.subscribe((params : any) => {
            this.loadRoom(params["spaceId"])
        });
    }

    onResize(event: any) {
        this.gridCols = (window.innerWidth <= this.cardWidth) ?
            1 : Math.floor((window.innerWidth)/this.cardWidth);
    }

    private loadRoom(spaceId: string) {
        //console.log("load room: " + spaceId)
        this.defaultService.getProjectLocationsSpaceByidApiProjectLocationsSpaceSpaceIdGet(spaceId)
            .subscribe(
                (s: any) => {
                    this.space = s
                }
            )
        
        this.defaultService.getProjectFunctionsRoomidApiProjectFunctionsByRoomIdRoomIdGet(spaceId)
            .subscribe(
                (f: any) => {
                    this.functions = f
                }
            )
    }

}
