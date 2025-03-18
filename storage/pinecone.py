from pinecone import Pinecone
import os
from dotenv import load_dotenv

load_dotenv()

def get_pinecone_client():
    return Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

def get_pinecone_index(name = "shashtra-chats"):
    return get_pinecone_client().Index(name)