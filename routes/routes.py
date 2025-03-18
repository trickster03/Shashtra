from fastapi import APIRouter, WebSocket , WebSocketDisconnect, Depends
from storage.pinecone import get_pinecone_index
from storage.redis import get_redis_client
from middlewares.token import verify_jwt_token
from google.cloud import firestore
from models.embedding import get_embedding
from services.chat import get_chat_response
from services.login import login_user
from schema.user import UserLogin
from schema.user import UserSignup

from services.signup import signup_user
router = APIRouter()

active_connections: dict = {}

@router.websocket("/chat")
async def websocket_endpoint(
    websocket: WebSocket, 
    session_id: str,
    user_id: str = Depends(lambda w=None: verify_jwt_token)
):
    await websocket.accept()
    if user_id is None:
        await websocket.close(code=1008)
        return 

    
    if user_id not in active_connections:
        active_connections[user_id] = {}
    active_connections[user_id][session_id] = websocket

    try:
        while True:
            data = await websocket.receive_text()
            #save to db
            response = await get_chat_response(user_id, session_id, data)        
            #save to redis
            get_redis_client().rpush(f"chat_history:{user_id}:{session_id}", f"User: {data}")
            get_redis_client().rpush(f"chat_history:{user_id}:{session_id}", f"Chatbot: {response}")

            # get_pinecone_index().upsert(vectors=[(str(hash(data + response + session_id)), get_embedding(data + response), {"text": data + response, "session_id": session_id})])
            try:
                embedding = get_embedding(data + response)
                get_pinecone_index().upsert(
        vectors=[
            {
                "id": str(hash(data + response + session_id)),
                "values": embedding,
                "metadata": {"text": data + response, "session_id": session_id}
            }
        ]
    )
            except Exception as e:
                print(f"Error upserting to Pinecone: {e}")
            await websocket.send_text(response)

    except WebSocketDisconnect:
        del active_connections[user_id][session_id]
        if not active_connections[user_id]:
            del active_connections[user_id]

@router.post("/login")
async def login(user_data: UserLogin):
    return await login_user(user_data)

@router.post("/signup")
async def signup(user_data: UserSignup):
    return await signup_user(user_data)