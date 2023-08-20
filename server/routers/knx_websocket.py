from fastapi import FastAPI, APIRouter, WebSocket, WebSocketDisconnect

import logging

router = APIRouter()
logger = logging.getLogger("uvicorn.access")


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    logger.info("websocket endpoint")
    await websocket.app.xknxui.ws_connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.app.xknxui.ws_rcv(data)

    except WebSocketDisconnect:
        websocket.app.xknxui.ws_disconnect(websocket)
