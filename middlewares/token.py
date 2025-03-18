import jwt
from fastapi import HTTPException
import os
from datetime import datetime

def verify_jwt_token(token: str):
    try:
        # First decode and verify the JWT token
        secret_key = os.getenv("JWT_SECRET_KEY")
        if not secret_key:
            raise HTTPException(status_code=500, detail="JWT secret key not configured")
        
        # Decode and verify the token
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        
        # Check if token is expired
        if "exp" in payload and datetime.utcnow().timestamp() > payload["exp"]:
            raise HTTPException(status_code=401, detail="Token expired")
        
        # Extract user_id from payload
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        
        # # Optional: Check if token is blacklisted in Redis
        # redis_client = get_redis_client()
        # blacklisted = redis_client.get(f"blacklisted:{token}")
        # if blacklisted:
        #     raise HTTPException(status_code=401, detail="Token has been revoked")
        
        # Optional: Verify that the token is still valid in Redis
        # This can be used if you're storing active tokens
        # stored_user_id = redis_client.get(f"token:{token}")
        # if stored_user_id and stored_user_id.decode() != str(user_id):
        #     raise HTTPException(status_code=401, detail="Token mismatch")
            
        return user_id
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")