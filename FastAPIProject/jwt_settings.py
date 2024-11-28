from functools import lru_cache
from Settings import JWTSettings

@lru_cache()
def GetJWTSettings() -> JWTSettings:
    return JWTSettings()