from os import environ, path
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse

router = APIRouter()

#app.mount("/static", StaticFiles(directory=cur_dir + "/static"), name="static")

@router.get("/")
async def get_root(request: Request):
    file=request.app.app_dir + "index.html"
    html_content="File not found: " + file
    rc=404
    if path.exists(file):
        with open(file, 'r') as file_index:
            html_content = file_index.read()
            rc = 200
    return HTMLResponse(html_content, status_code=rc)
    

@router.get("/{file}")
async def get_file(request: Request, file):
    real_file=request.app.app_dir + file
    if not path.exists(real_file):
        return HTMLResponse("File not found: " + real_file, status_code=404)
    return FileResponse(real_file)
