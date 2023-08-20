# xknxui

Docker container to automatically create a UI with all rooms and functions
using [xknx](https://github.com/XKNX/xknx) and [xknxproject](https://github.com/XKNX/xknxproject).

Currently only a prototype in which all lamps are displayed and controlled.

## run
Set project file as volumes and KNX_GW_IP as environment in docker-compose.yml an run:

```docker compose -f docker-compose.yml up --build```
