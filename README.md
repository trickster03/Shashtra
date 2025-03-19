# 🚀 Shashtra: Intelligent Conversational AI

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://your-build-system.com/shashtra)  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/release/python-390/)

Shashtra is a powerful, context-aware conversational AI system designed to deliver personalized, accurate, and efficient responses.  It combines the advanced natural language processing capabilities of Google's Gemini AI model with a robust and scalable architecture, making it suitable for a wide range of applications. This README provides a developer-focused overview of the project.

## Table of Contents

*   [Architecture](#architecture)
*   [Key Features](#key-features)
*   [Technology Stack](#technology-stack)
*   [Design Philosophy](#design-philosophy)
*   [Scalability and Performance](#scalability-and-performance)
*   [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
*   [Usage](#usage)
    *   [Authentication](#authentication)
    *   [Chat Interaction (WebSocket)](#chat-interaction-websocket)
*   [API Documentation](#api-documentation)
*   [Contributing](#contributing)
*   [License](#license)

## Architecture

Shashtra's architecture is designed for modularity, scalability, and resilience.  It follows a microservices-oriented approach:

```mermaid
graph LR
    subgraph Clients
        A[Web Browser] -- HTTP --> B;
        C[API Client] -- WebSocket --> B;
    end
    B[API Gateway/Load Balancer] --> D(Authentication Service);
    B --> E(Chat Service);
    D -->|Generates/Validates| F[JWT Tokens];
    E --> G(Redis Cache);
    E --> H(Pinecone Vector Database);
    E --> I(Google Gemini AI Model);
    E --> J(Evaluation Metrics)
    G -->|Contextual Memory| E;
    H -->|Knowledge Retrieval| E;
    I -->|Response Generation| E;
   

    style D fill:#f9f,stroke:#333,stroke-width:2px
    style E fill:#ccf,stroke:#333,stroke-width:2px
    style G fill:#cfc,stroke:#333,stroke-width:2px
    style H fill:#cff,stroke:#333,stroke-width:2px
    style I fill:#ffc,stroke:#333,stroke-width:2px
    style J fill:#FCC,stroke:#333,stroke-width:2px
Clients: Users interact via a web interface or API clients.
API Gateway/Load Balancer: (Highly recommended for production) Handles request routing, load balancing, and SSL termination.
Authentication Service: Manages user authentication and authorization using JWTs.
Chat Service: The core logic. Processes queries, interacts with Redis, Pinecone, and Gemini, and generates responses. Multiple instances can be deployed.
Redis Cache: Stores conversation context (short-term memory) for fast retrieval.
Pinecone Vector Database: Stores and retrieves knowledge embeddings for semantic search (long-term knowledge), enabling Retrieval-Augmented Generation (RAG).
Google Gemini AI Model: Provides the natural language understanding and generation capabilities.
Evaluation Metrics: Persists complete metrics and session metrics.
Key Features
Natural Language Understanding: Engages in coherent and contextually relevant conversations.
Knowledge-Based Responses: Provides accurate information retrieved from a dedicated knowledge base.
Contextual Memory: Remembers past interactions for personalized experiences.
Real-time Communication: Uses WebSockets for instant, bidirectional interaction.
Secure Authentication: Employs JWT authentication to protect API endpoints.
Scalable Architecture: Designed to handle increasing loads through horizontal scaling.
Performance Monitoring: Tracks key metrics like response time, relevance, and context utilization.
RAG Implementation
Technology Stack
Programming Language: Python 3.9+
AI Model: Google Gemini
Vector Database: Pinecone
Cache: Redis
Authentication: JWT (JSON Web Tokens)
Communication: WebSockets
Framework (Likely): Flask or FastAPI (This can be specified if you know which one is used)
Design Philosophy
Shashtra is built on these core principles:

Modularity: Independent services for maintainability and scalability.
Scalability: Horizontal scaling of key components.
Context Awareness: Maintaining conversation history for personalized interactions.
Knowledge Integration: Leveraging a large knowledge base for accurate responses.
Security: Secure access through JWT authentication.
Real-time Interaction: Low-latency communication with WebSockets.
Best-in-Class AI: Utilizing Google's Gemini for superior language processing.
Scalability and Performance
Horizontal Scaling: The Chat Service can be scaled horizontally by deploying multiple instances behind a load balancer.
Redis Clustering: Redis can be clustered for distributed context storage and improved resilience.
Pinecone Scalability: Pinecone is a managed service designed for high performance and scalability.
Round-Robin Load Balancing (Gemini): Requests to the Gemini model are distributed using a Round-Robin algorithm across multiple instances, maximizing throughput (RPM).
Prompt Engineering: Carefully crafted prompts optimize the quality and efficiency of Gemini's responses.
Temperature Control: The temperature parameter is adjusted to control the randomness and focus of Gemini's output.
Getting Started
Prerequisites

Python 3.9 or higher
Redis server
Pinecone account (and API key)
Google Cloud account (and API key for Gemini)
Installation

Clone the repository:

Bash
git clone [https://github.com/your-username/shashtra.git](https://github.com/your-username/shashtra.git)  # Replace with your actual repo URL
cd shashtra
 Create a .env file:
Create a .env file in the root directory and add your API keys and configuration settings:

Plaintext
PROJECT_ID=your-google-cloud-project-id
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=gcp-starter
JWT_SECRET_KEY=your-jwt-secret-key  # Choose a strong secret key!
REDIS_HOST=localhost
REDIS_PORT=6379
 IMPORTANT:  Do not commit your .env file to version control!

Install dependencies:

Bash
pip install -r requirements.txt
Usage
Authentication

Before interacting with the chat API, users must authenticate:

Registration: POST /api/signup (Requires email, name, password)
Login: POST /api/login (Requires email, password)
Both endpoints return a JWT upon successful authentication. This token must be included in subsequent requests.

Chat Interaction (WebSocket)

The primary interaction with Shashtra is through a WebSocket connection:

Endpoint: /api/chat

Query Parameters:

session_id: A unique identifier for the conversation session.
token: The JWT obtained during authentication.
Message Format (JSON):

JSON
{
    "message": "User's input here"
}
 Shashtra will respond with a JSON object in a similar format:

JSON
{
    "message": "Shashtra's response"
}
API Documentation
Authentication
POST /api/signup : Register User.
POST /api/login: Get JWT Token.
Chat
WebSocket /api/chat?session_id={session_id}&token={token}
Metrics
GET /api/metrics: Overall system metrics.
GET /api/metrics/sessions/{session_id}: Session-specific metrics.
