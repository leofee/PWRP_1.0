"""Python service for data processing and automation."""

import os
from dotenv import load_dotenv

load_dotenv()

PB_URL = os.getenv("POCKETBASE_URL", "http://127.0.0.1:8090")


def main():
    print(f"Connecting to PocketBase at {PB_URL}")
    # TODO: add your Python logic here


if __name__ == "__main__":
    main()
