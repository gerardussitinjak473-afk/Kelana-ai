import mimetypes
import os
import time
from pathlib import Path
from urllib.parse import urlparse

import boto3
from dotenv import load_dotenv


ROOT = Path(__file__).resolve().parents[1]
GUIDES_DIR = ROOT / "travel-guides"
load_dotenv(ROOT / "backend" / ".env")


def required(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(f"{name} belum dikonfigurasi di backend/.env")
    return value


def main() -> None:
    region = os.getenv("AWS_REGION", "ap-southeast-2")
    destination = urlparse(required("KNOWLEDGE_BASE_S3_URI"))
    if destination.scheme != "s3" or not destination.netloc:
        raise RuntimeError("KNOWLEDGE_BASE_S3_URI harus berbentuk s3://bucket/prefix/")

    prefix = destination.path.strip("/")
    s3 = boto3.client("s3", region_name=region)
    files = sorted(path for path in GUIDES_DIR.iterdir() if path.is_file())
    if len(files) < 3:
        raise RuntimeError("Minimal tiga dokumen harus tersedia di travel-guides/")

    for path in files:
        key = "/".join(part for part in (prefix, path.name) if part)
        content_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        s3.upload_file(str(path), destination.netloc, key, ExtraArgs={"ContentType": content_type})
        print(f"Uploaded s3://{destination.netloc}/{key}")

    client = boto3.client("bedrock-agent", region_name=region)
    job = client.start_ingestion_job(
        knowledgeBaseId=required("KNOWLEDGE_BASE_ID"),
        dataSourceId=required("KNOWLEDGE_BASE_DATA_SOURCE_ID"),
        description="KelanaAI session 9 travel guide sync",
    )["ingestionJob"]
    print(f"Ingestion job: {job['ingestionJobId']}")

    while job["status"] in {"STARTING", "IN_PROGRESS"}:
        time.sleep(10)
        job = client.get_ingestion_job(
            knowledgeBaseId=job["knowledgeBaseId"],
            dataSourceId=job["dataSourceId"],
            ingestionJobId=job["ingestionJobId"],
        )["ingestionJob"]
        print(f"Status: {job['status']}")

    if job["status"] != "COMPLETE":
        raise RuntimeError(f"Sinkronisasi gagal: {job.get('failureReasons', job['status'])}")


if __name__ == "__main__":
    main()
