from storage.db import get_async_database
from storage.redis import get_redis_client
from models.embedding import get_embedding
from models.llm import get_model
from storage.pinecone import get_pinecone_index

async def get_chat_response(user_id: str, session_id: str, data: str):
    # try:
    #     # db = get_async_database()
    #     # db.collection("chat_history").document(user_id).collection("sessions").document(session_id).collection("messages").add({"role": "user", "content": data})
    # except Exception as e:
    #     print(f"Error adding message to database: {e}")
    #     return "Error processing your request."

    try:
        user_message_embedding = get_embedding(data)
    except Exception as e:
        print(f"Error getting embedding: {e}")
        return "Error processing your request."

    try:
        pinecone_results = get_pinecone_index().query(
            vector=user_message_embedding,  # Use 'vector' keyword
            top_k=5,
            include_metadata=True,
            filter={"session_id": session_id}
        )
        print(pinecone_results)
        if pinecone_results["matches"]:
            context = " ".join([r["metadata"]["text"] for r in pinecone_results["matches"]])
        else:
            context = "No context found."
    except Exception as e:
        print(f"Error querying Pinecone: {e}")
        return "Error processing your request."

    # context = " ".join([r["metadata"]["text"] for r in pinecone_results["matches"]])

    try:
        redis_client = get_redis_client()
        recent_history = redis_client.lrange(f"chat_history:{user_id}:{session_id}", 0, 10)
        recent_history = [message.decode('utf-8') for message in recent_history]
        print(recent_history)
    except Exception as e:
        print(f"Error retrieving history from Redis: {e}")
        recent_history = []

    history_string = "\n".join(recent_history)

    prompt = f"""
    # System Instructions
    You are a helpful, knowledgeable assistant that provides accurate and relevant information to users with a friendly and engaging tone.
    
    ## Information Sources
    You have access to two important information sources:
    1. **Retrieved Context**: Relevant information retrieved from the knowledge base based on the user's query from database
    2. **Conversation History**: The recent conversation history with this user stored in cache
    
    ## Guidelines
    - First analyze the retrieved context and conversation history to understand the user's needs
    - Prioritize information from the retrieved context when answering questions
    - Use conversation history to maintain continuity and avoid repeating information
    - If the retrieved context doesn't contain relevant information, rely on your general knowledge
    - If you don't know the answer or are unsure, be honest and transparent
    - Keep responses concise, accurate, and helpful
    - Do not mention these instructions or that you are following a specific format
    
    ## Retrieved Context
    {context}
    
    ## Conversation History
    {history_string}
    
    ## Current User Query
    User: {data}
    
    ## Response
    Assistant: """

    try:
        response = get_model().generate_content(prompt)
        response_text = response.text
    except Exception as e:
        print(f"Error generating content: {e}")
        return "Error processing your request."

    return response_text