"""
Provision a Spiritual Guidance Team admin account.

Run from the backend/ directory with the virtual environment active:

    python -m scripts.create_admin

This is the ONLY way admin accounts are created — there is no public
registration page. Run this once per admin (up to 3 admins as per the PRD).
"""
import getpass
import sys

from sqlalchemy import select

from app.core.security import hash_password
from app.db.database import SessionLocal
from app.models.admin import AdminUser


def main():
    print("Create a Spiritual Guidance Team admin account\n")

    name = input("Admin name: ").strip()
    email = input("Admin email: ").strip().lower()
    password = getpass.getpass("Password: ")
    confirm = getpass.getpass("Confirm password: ")

    if not name or not email:
        print("Name and email are required.")
        sys.exit(1)

    if len(password) < 10:
        print("Password must be at least 10 characters.")
        sys.exit(1)

    if password != confirm:
        print("Passwords do not match.")
        sys.exit(1)

    db = SessionLocal()
    try:
        existing = db.execute(select(AdminUser).where(AdminUser.email == email)).scalar_one_or_none()
        if existing:
            print(f"An admin with email {email} already exists.")
            sys.exit(1)

        admin = AdminUser(name=name, email=email, hashed_password=hash_password(password))
        db.add(admin)
        db.commit()
        print(f"\nAdmin account created: {name} <{email}>")
    finally:
        db.close()


if __name__ == "__main__":
    main()
