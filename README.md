# 🚀 Shashtra: Sarvam.ai Assignment

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://your-build-system.com/shashtra)  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/release/python-390/)

Shashtra is a powerful, context-aware conversational AI system designed to deliver personalized, accurate, and efficient responses.  It combines the advanced natural language processing capabilities of Google's Gemini AI model with a robust and scalable architecture, making it suitable for a wide range of applications. This README provides a developer-focused overview of the project.

## Table of Contents

* [Architecture](#architecture)
* [Key Features](#key-features)
* [Technology Stack](#technology-stack)
* [Design Philosophy](#design-philosophy)
* [Scalability and Performance](#scalability-and-performance)
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
* [Usage](#usage)
    * [Authentication](#authentication)
    * [Chat Interaction (WebSocket)](#chat-interaction-websocket)
* [API Documentation](#api-documentation)
* [Contributing](#contributing)
* [License](#license)

## Architecture

Shashtra's architecture is designed for modularity, scalability, and resilience.  It follows a microservices-oriented approach:

![Untitled diagram-2025-03-19-184320](https://github.com/user-attachments/assets/661a1188-4d86-4082-8442-72012c4ea7f2)

## Key Features, Technologies, Design, and Usage of Shashtra

This section provides a concise overview of Shashtra's key features, underlying technologies, design principles, scalability, performance considerations, and basic usage instructions.  It's designed to be a developer-friendly summary within a larger README.

### Architecture Components

* **Clients:** Users interact with Shashtra through a web interface or via API clients.
* **API Gateway/Load Balancer:** (Production Recommended) Handles request routing, load balancing across Chat Service instances, and SSL termination.
* **Authentication Service:** Manages user authentication and authorization using JWTs.
* **Chat Service:** The core application logic. Processes queries, interacts with data stores (Redis, Pinecone), and the Gemini AI model, and generates responses.  Designed for horizontal scaling.
* **Redis Cache:** Stores conversation context (short-term memory) for fast retrieval, enabling personalized interactions.
* **Pinecone Vector Database:** Stores and retrieves knowledge embeddings, enabling semantic search and Retrieval-Augmented Generation (RAG) for accurate, knowledge-based responses.
* **Google Gemini AI Model:** Provides the natural language understanding and generation capabilities.
* **Evaluation Metrics:** Stores and provides access to performance metrics.

### Key Features

* **Natural Language Understanding:** Processes and understands complex user input, going beyond simple keyword matching.
* **Knowledge-Based Responses:** Leverages a dedicated knowledge base (Pinecone) for accurate and informative answers.
* **Contextual Memory:** Remembers past interactions to provide a personalized and efficient conversational experience.
* **Real-time Communication:** Utilizes WebSockets for instant, bidirectional communication.
* **Secure Authentication:** Employs JWT authentication to protect API endpoints.
* **Scalable Architecture:** Designed for horizontal scaling to handle increasing user loads.
* **Performance Monitoring:** Tracks key metrics to ensure optimal performance and identify areas for improvement.
* **RAG Implementation:** Uses Retrieval-Augmented Generation to combine knowledge retrieval with language generation.

### Technology Stack

* **Programming Language:** Python 3.9+
* **AI Model:** Google Gemini
* **Vector Database:** Pinecone
* **Cache:** Redis
* **Authentication:** JWT (JSON Web Tokens)
* **Communication:** WebSockets
* **Backend Framework:** FastAPI
* **Frontend Library:** React (or similar)

### Design Philosophy

Shashtra is built upon these core principles:

* **Modularity:** Independent, well-defined services for improved maintainability, testability, and scalability.
* **Scalability:** Designed for horizontal scaling of key components (especially the Chat Service).
* **Context Awareness:** Prioritizes maintaining conversation history for personalized and efficient interactions.
* **Knowledge Integration:** Integrates a robust knowledge base to ensure accurate and informative responses.
* **Security:** Employs JWT authentication for secure access control.
* **Real-time Interaction:** Uses WebSockets for low-latency communication.
* **Best-in-Class AI:** Leverages Google's Gemini for state-of-the-art language processing.

### Scalability and Performance

* **Horizontal Scaling:** The Chat Service can be scaled horizontally by deploying multiple instances behind a load balancer.
* **Redis Clustering:** Redis can be configured in a cluster for distributed context storage and increased resilience.
* **Pinecone Scalability:** Pinecone is a managed service built for high performance and scalability.
* **Round-Robin Load Balancing (Gemini):** Requests to the Gemini model are distributed using a Round-Robin algorithm to maximize throughput.
* **Prompt Engineering:** Carefully crafted prompts are used to optimize the quality and efficiency of Gemini's responses.
* **Temperature Control:** The `temperature` parameter is tuned to control the randomness and focus of Gemini's output.

### Getting Started

#### Prerequisites

* Python 3.9 or higher
* Node.js and npm (for the frontend)
* Redis server running
* Pinecone account (and API key)
* Google Cloud account (and API key for Gemini)

#### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/trickster03/Shashtra.git](https://github.com/trickster03/Shashtra.git)
    cd shashtra
    ```

2.  **Create a `.env` file:**
    Create a `.env` file in the project's root directory and add your API keys and configuration:

    ```
    # Example .env content
    GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
    PINECONE_API_KEY=YOUR_PINECONE_API_KEY
    PINECONE_ENVIRONMENT=YOUR_PINECONE_ENVIRONMENT
    REDIS_HOST=localhost
    REDIS_PORT=6379
    # ... other environment variables
    ```

    **IMPORTANT:** Do *not* commit your `.env` file to version control!  Add `.env` to your `.gitignore` file.

3.  **Install backend dependencies:**

    ```bash
    cd server
    pip install -r requirements.txt
    cd ..
    ```

4.  **Install frontend dependencies:**

    ```bash
    cd client
    npm install
    cd ..
    ```

### Usage

#### Starting the Backend

1.  Navigate to the `server` directory:

    ```bash
    cd server
    ```

2.  Start the backend server (e.g., using Uvicorn):

    ```bash
    uvicorn main:app --reload
    ```

#### Starting the Frontend

1.  Navigate to the `client` directory:

    ```bash
    cd client
    ```

2.  Start the frontend development server:

    ```bash
    npm run dev
    ```

    This will typically start the frontend on a local development server (e.g., `http://localhost:5173`).

#### Authentication

Users must authenticate before interacting with the chat API:

* **Registration:** `POST /api/signup`  (Requires `email`, `name`, `password` in the request body)
* **Login:** `POST /api/login` (Requires `email`, `password` in the request body)

Both endpoints return a JWT upon successful authentication.  This token *must* be included in subsequent requests to the chat API.

#### Chat Interaction (WebSocket)

The primary interaction with Shashtra is via a WebSocket connection:

* **Endpoint:** `/api/chat`
* **Query Parameters:**
    * `session_id`:  A unique identifier for the conversation session (UUID recommended).
    * `token`: The JWT obtained during authentication.

* **Message Format (JSON):**

    **Sending a message (Client to Server):**

    ```json
    {
        "message": "User's input here"
    }
    ```

    **Receiving a message (Server to Client):**

    ```json
    {
        "message": "Shashtra's response"
    }
    ```

### API Documentation

* **Authentication**
    * `POST /api/signup`: Register a new user.
    * `POST /api/login`: Obtain a JWT token.
* **Chat**
    * `WebSocket /api/chat?session_id={session_id}&token={token}`:  Establish a real-time chat connection.
* **Metrics**
    * `GET /api/metrics`: Overall system metrics.
    * `GET /api/metrics/sessions/{session_id}`: Session-specific metrics.
