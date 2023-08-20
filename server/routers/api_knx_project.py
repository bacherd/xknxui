from __future__ import annotations 

from os import environ
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

import logging

router = APIRouter(
        prefix="/api/project",
        tags=["project"]
        )
logger = logging.getLogger("uvicorn.access")

def search_space_byid(space, space_id):
    found = None
    for key in space:
        if space[key]["identifier"] == space_id:
            found=space[key]
        if not found:
            found = search_space_byid(space[key]["spaces"], space_id)
    return found


#@router.get("", response_model=KNXProject) # FIXME: does not work with recursive space
@router.get("")
async def get_api_project(request: Request):
    return JSONResponse(request.app.xknxui.getProject())


@router.get("/locations")
async def get_project_locations(request: Request):
    return JSONResponse(request.app.xknxui.getProject()["locations"])


@router.get("/locations/space/{space_id}")
async def get_project_locations_space_byid(request: Request, space_id: str):
    logger.info("search for space: " + space_id)
    space = search_space_byid(request.app.xknxui.getProject()["locations"], space_id)
    return JSONResponse(space)


@router.get("/functions")
async def get_project_functions(request: Request):
    return JSONResponse(request.app.xknxui.getProject()["functions"])


@router.get("/functions/byId/{function_id}")
async def get_project_functions_byid(request: Request, function_id: str):
    return JSONResponse(request.app.xknxui.getProject()["functions"][function_id])


@router.get("/functions/byRoomId/{room_id}")
async def get_project_functions_roomid(request: Request, room_id: str):
    functions = []
    for f in request.app.xknxui.getProject()["functions"]:
        if request.app.xknxui.getProject()["functions"][f]["space_id"] == room_id:
            functions.append(request.app.xknxui.getProject()["functions"][f])
    return JSONResponse(functions)
