from fastapi import HTTPException, status, Depends


class UnauthorizedException(HTTPException):
    def __init__(self, detail: str, **kwargs):
        super().__init__(status.HTTP_403_FORBIDDEN, detail=detail)

class UnauthenticatedException(HTTPException):
    def __init__(self, message: str = "Requires authentication"):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=message)