import { Component, Input, OnInit } from '@angular/core';
import { WebsocketService } from "../../websocket.service";
import { WSMsgStatus, WSMsgCtrl } from "../wsmsg";

@Component({
    selector: 'app-light',
    templateUrl: './light.component.html',
    styleUrls: ['./light.component.css']
})
export class LightComponent implements OnInit {

    @Input() func: any = {};
    on = false

    ga_ctrl: any = {}
    ga_status: any = {}

    constructor(private ws: WebsocketService) {}

    ngOnInit() {
        for (var key in this.func.group_addresses) {
            var val = this.func.group_addresses[key]

            if (val.role == "SwitchOnOff") {
                this.ga_ctrl = val
            }
            if (val.role == "InfoOnOff") {
                this.ga_status = val
            }
        }

        this.ws.messageReceived.subscribe((msg: string) => {
            const wsmsg: WSMsgStatus = JSON.parse(msg)
            if (wsmsg.destination == this.ga_status.address && wsmsg.payload) {
                const regExp = new RegExp(".*value=\"([0-9])\"", "g");
                const matches = regExp.exec(wsmsg.payload)

                if (matches) {
                    this.on = (matches[1] == "1") 
                }
            }
        })
    }

    public onBtnClicked() {
        if ("address" in this.ga_ctrl) {
            const msg: WSMsgCtrl = {
                function: this.func.identifier,
                value: ((this.on) ? "0" : "1")
            }
            this.ws.sendMessage(JSON.stringify(msg));
        }
    }
}
