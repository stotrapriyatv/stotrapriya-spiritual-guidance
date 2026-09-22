import httpx

from app.core.config import settings


async def verify_turnstile(token: str, remote_ip: str | None = None) -> bool:
    payload = {"secret": settings.turnstile_secret_key, "response": token}
    if remote_ip:
        payload["remoteip"] = remote_ip

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.post(settings.turnstile_verify_url, data=payload)
        data = resp.json()
        return bool(data.get("success"))
