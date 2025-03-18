from storage.db import get_async_database
from storage.redis import get_redis_client
from models.embedding import get_text_embedding_model
from models.llm import get_model
from storage.pinecone import get_pinecone_index

async def get_chat_response(user_id: str, session_id: str, data: str):
    db = get_async_database()
    db.collection("chat_history").document(user_id).collection("sessions").document(session_id).collection("messages").add({"role": "user", "content": data})
    user_message_embedding = get_text_embedding_model(data)

    pinecone_results = get_pinecone_index().query(user_message_embedding, top_k=5, include_metadata=True, filter={"session_id": session_id})
    context = " ".join([r["metadata"]["text"] for r in pinecone_results["matches"]])
    redis_client = get_redis_client()
    recent_history = redis_client.lrange(f"chat_history:{user_id}:{session_id}", 0, 10)
    recent_history = [message.decode('utf-8') for message in recent_history]
    history_string = "\n".join(recent_history)

    prompt = f"Context: {context}\nHistory: {history_string}\nUser: {data}\nChatbot:"

    response = get_model().generate_content(prompt)
    response_text = response.text
    return response_text