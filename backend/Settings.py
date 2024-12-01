from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
import time


class AZDatabaseSettings(BaseSettings):
    dbname: str
    dbhost: str
    dbport: str
    dbuser: str
    dbpassword: str

    model_config = SettingsConfigDict(env_file="env/az-bank.env")

class TXDatabaseSettings(BaseSettings):
    dbname: str
    dbhost: str
    dbport: str
    dbuser: str
    dbpassword: str

    model_config = SettingsConfigDict(env_file="env/tx-bank.env")

class JWTSettings(BaseSettings):
    jwt_issuer: str
    jwt_audience: str
    jwt_algorithm: str

    _public_key: bytes
    _private_key: bytes
    _jwt_payload: dict

    model_config = SettingsConfigDict(env_file="env/jwt.env")

    def __init__(self):
        super().__init__()

        private_key = ''
        with open('secrets/private.key', 'r') as infile:
            for line in infile:
                private_key += line
        self._private_key = private_key.encode('utf-8')

        public_key = ''
        with open('secrets/public.key', 'r') as infile:
            for line in infile:
                public_key += line
        self._public_key = public_key.encode('utf-8')

        self._jwt_payload = {"iss": self.jwt_issuer, "aud": self.jwt_audience, "sub": '', "iat": int(time.time())}

    def get_private_key(self):
        return self._private_key

    def get_public_key(self):
        return self._public_key

    def get_jwt_payload(self):
        return self._jwt_payload