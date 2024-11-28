from typing import Optional

import jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import SecurityScopes, HTTPAuthorizationCredentials, HTTPBearer

from SQLModels.Branch import Branch
from jwt_settings import GetJWTSettings
from copy import deepcopy
import time

from Exceptions import UnauthorizedException, UnauthenticatedException

class VerifyToken:
    def __init__(self):
        self.jwt_settings = GetJWTSettings()

    def generate_token(self, branch: Branch | None = None) -> str | None:
        payload = deepcopy(self.jwt_settings.get_jwt_payload())
        private_key = self.jwt_settings.get_private_key()

        payload['sub'] = branch.branch_id # subject
        payload['iat'] = int(time.time()) # issued at - epoch time (no. of seconds since 1st Jan 1970)
        payload['exp'] = payload['iat'] + 86400 # expiry - one day of validity

        token = None

        try:
            token = jwt.encode(payload, private_key, algorithm=self.jwt_settings.jwt_algorithm)
        except Exception as error:
            raise UnauthorizedException(error)

        return token

    async def verify(self, token: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer())) -> str:
        if token is None:
            print('token is NONE')
            raise UnauthenticatedException

        try:
            payload = jwt.decode(
                token.credentials,
                self.jwt_settings.get_public_key(),
                algorithms=self.jwt_settings.jwt_algorithm,
                audience=self.jwt_settings.jwt_audience,
                issuer=self.jwt_settings.jwt_issuer,
            )
        except Exception as error:
            raise UnauthorizedException(str(error))

        return payload

