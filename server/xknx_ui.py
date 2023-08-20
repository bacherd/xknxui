from fastapi import FastAPI, APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from fastapi import WebSocket, WebSocketDisconnect

from xknxproject.models import KNXProject
from xknxproject import XKNXProj

from os import environ

from xknx import XKNX
from xknx.io import ConnectionConfig, ConnectionType
from xknx.telegram import Telegram
from xknx.devices import Light
from xknx.core import (
    TaskRegistry,
    TelegramQueue,
    XknxConnectionState,
)

import asyncio
import logging
import json

from pydantic import BaseModel

class WSMsgStatus(BaseModel):
    destination: str
    source: str
    payload: str

class WSMsgCtrl(BaseModel):
    function: str
    value: str

class XKnxUi(object):
    def __init__(self):
        self.project = None
        self.active_connections: list[WebSocket] = []

        self.functions = {}
        self.logger = logging.getLogger("uvicorn.access")

        knx_gw_port = int(environ.get('KNX_GW_PORT', "3671"))
        
        self.knx_config = ConnectionConfig(
            connection_type=ConnectionType.TUNNELING,
            gateway_ip=environ.get('KNX_GW_IP'),
            gateway_port=knx_gw_port,
            route_back=True
            #individual_address="1.1.255",
        )
        self.xknx = XKNX(
            connection_config=self.knx_config,
            telegram_received_cb=self.knx_received_cb,
            daemon_mode=True
        )
        
        self._init_project()

        self.connect_knx_loop = asyncio.get_event_loop()
        self.connect_knx_loop.create_task(self.connect_knx())


    def _add_light(self, key, value):
        ga_switch = None
        ga_switch_state = None

        for ga in value["group_addresses"]:
            if value["group_addresses"][ga]["role"] == "SwitchOnOff":
                ga_switch=value["group_addresses"][ga]["address"]
            if value["group_addresses"][ga]["role"] == "InfoOnOff":
                ga_switch_state=value["group_addresses"][ga]["address"]

        self.functions[key] = Light(self.xknx,
                                    name=key,
                                    group_address_switch=ga_switch,
                                    group_address_switch_state=ga_switch_state
                              )
    
    def _add_cover(self, key, value):
        pass


    def _init_project(self):
        knxproj: XKNXProj = XKNXProj(
            path=environ.get('KNX_PROJECT', '/data/project.knxproj'),
            language=environ.get("KNX_LANGUAGE", "de-DE"),
            password=environ.get("KNX_PASSWORD", "")
        )

        self.project: KNXProject = knxproj.parse()

        functions = self.project["functions"]
        for key in functions:
            value = functions[key]
            function_type = value["function_type"]
            if function_type == "FT-1":
                self._add_light(key, value)

            if function_type == "FT-7":
                self._add_cover(key, value)
                
   

    async def ws_connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)


    def ws_disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)


    async def ws_snd(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


    async def ws_rcv(self, message: str):
        self.logger.info("WS RCV " + message)
        ctrl_msg = WSMsgCtrl.parse_raw(message)

        if ctrl_msg.function in self.functions:
            device = self.functions[ctrl_msg.function]
            if type(device) is Light:
                if ctrl_msg.value == "1":
                    self.logger.info("Light on")
                    await device.set_on()
                if ctrl_msg.value == "0":
                    self.logger.info("Light off")
                    await device.set_off()


    async def connect_knx(self):
        while True:
            if self.xknx.connection_manager._state == XknxConnectionState.DISCONNECTED:
                try:
                    self.logger.info("connect to xknx")
                    await self.xknx.start()
                except Exception as e:
                    self.logger.info("xknx.start: " + str(e))
            await asyncio.sleep(10)


    async def knx_received_cb(self, telegram: Telegram):
        self.logger.info(telegram.payload.value)
        msg = WSMsgStatus(
                destination = str(telegram.destination_address),
                source = str(telegram.source_address),
                payload = str(telegram.payload.value),
        )
        await self.ws_snd(msg.json())


    def getProject(self):
        return self.project
