from typing import List

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.client_ids: List[str] = []

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.client_ids.append(client_id)
        await self.broadcast(f"Client #{client_id} joined the chat", self.client_ids)

    async def disconnect(self, websocket: WebSocket, client_id: str):
        self.active_connections.remove(websocket)
        self.client_ids.remove(client_id)
        await self.broadcast(f"Client #{client_id} left the chat", self.client_ids)

    async def send_personal_message(self, message: str, client_ids: List[str], websocket: WebSocket):
        await websocket.send_json({"message": message, "client_ids": client_ids})

    async def broadcast(self, message: str, client_ids: List[str]):
        for connection in self.active_connections:
            await connection.send_json({"message": message, "client_ids": client_ids})


manager = ConnectionManager()


@app.get("/users")
async def get_active_users():
    return {"users": manager.client_ids}


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(f"You wrote: {data}", manager.client_ids, websocket)
            await manager.broadcast(f"Client #{client_id} says: {data}", manager.client_ids)
    except WebSocketDisconnect:
        await manager.disconnect(websocket, client_id)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=4455)