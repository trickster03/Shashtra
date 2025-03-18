from google.cloud import aiplatform as vertexai
from google.generativeai import GenerativeModel
import os
import random
from utils.config import REGIONS
async def get_text_embedding_model():
    vertexai.init(project=os.getenv("PROJECT_ID"), location=REGIONS[random.randint(0, 25)])  # Initialize Vertex AI
    
    embedding_config = {
        "model": "text-embedding-004",  # Specify the text embedding model
        "temperature": 0.2,  # Set temperature to 0 for deterministic output
    }
    
    model = GenerativeModel(
        "text-embedding-004",
        generation_config=embedding_config
    )
    
    return model
