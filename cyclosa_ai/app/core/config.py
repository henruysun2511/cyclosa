from pydantic_settings import BaseSettings
from pydantic import ConfigDict, field_validator
from typing import Optional, Any


class Settings(BaseSettings):
    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    PROJECT_NAME: str = "CYCLOSA AI Service"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    ENVIRONMENT: str = "development"

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug(cls, v: Any) -> bool:
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            return v.lower() in ("true", "1", "yes", "debug", "dev", "development")
        return bool(v)
    
    # Internal communication secret
    INTERNAL_API_KEY: str = "cyclosa-internal-ai-secret-key-2026"
    
    # LLM Settings
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    DEFAULT_LLM_MODEL: str = "gemini/gemini-1.5-flash"
    
    # Timeouts
    SYNC_REQUEST_TIMEOUT: int = 15
    BATCH_REQUEST_TIMEOUT: int = 60
    
    # Redis Cache & Task Queue Broker (Không cần RabbitMQ)
    REDIS_URL: str = "redis://localhost:6379/1"


settings = Settings()
