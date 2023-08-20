#!/usr/bin/env python
import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from os.path import basename, dirname, abspath

import logging

from .routers import knx_websocket
from .routers import api_knx_project
from .routers import static

from .xknx_ui import XKnxUi

app = FastAPI(debug=True)

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(knx_websocket.router)
app.include_router(api_knx_project.router)
app.include_router(static.router)

@app.on_event("startup")
async def startup():
    logger = logging.getLogger("uvicorn.access")
    console_formatter = uvicorn.logging.ColourizedFormatter(
        "{asctime} {levelprefix} : {message}",
        style="{", use_colors=True)
    logger.handlers[0].setFormatter(console_formatter)

    app.xknxui = XKnxUi()
    app.app_dir = dirname(abspath(__file__)) + "/app/"


if __name__ == '__main__':
    config = uvicorn.Config (
        app,
        host='0.0.0.0',
        port=8124
    )
    server = uvicorn.Server(config)
    server.run()
