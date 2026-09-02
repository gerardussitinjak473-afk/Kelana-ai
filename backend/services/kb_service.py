import os
from pathlib import PurePosixPath
from urllib.parse import urlparse

import boto3
from dotenv import load_dotenv


load_dotenv()

KNOWLEDGE_BASE_ID = os.getenv("KNOWLEDGE_BASE_ID", "").strip()
KNOWLEDGE_BASE_MODEL_ARN = os.getenv("KNOWLEDGE_BASE_MODEL_ARN", "").strip()
AWS_REGION = os.getenv("AWS_REGION", "ap-southeast-2")


class KnowledgeBaseNotConfigured(RuntimeError):
    pass


def _client():
    return boto3.client("bedrock-agent-runtime", region_name=AWS_REGION)


def _source_name(reference: dict) -> str | None:
    location = reference.get("location", {})
    uri = location.get("s3Location", {}).get("uri")
    if uri:
        return PurePosixPath(urlparse(uri).path).name or uri
    url = location.get("webLocation", {}).get("url")
    if url:
        return url
    return None


def ask_knowledge_base(question: str) -> dict:
    if not KNOWLEDGE_BASE_ID or not KNOWLEDGE_BASE_MODEL_ARN:
        raise KnowledgeBaseNotConfigured(
            "KNOWLEDGE_BASE_ID dan KNOWLEDGE_BASE_MODEL_ARN belum dikonfigurasi."
        )

    response = _client().retrieve_and_generate(
        input={"text": question},
        retrieveAndGenerateConfiguration={
            "type": "KNOWLEDGE_BASE",
            "knowledgeBaseConfiguration": {
                "knowledgeBaseId": KNOWLEDGE_BASE_ID,
                "modelArn": KNOWLEDGE_BASE_MODEL_ARN,
                "retrievalConfiguration": {
                    "vectorSearchConfiguration": {"numberOfResults": 5}
                },
            },
        },
    )

    sources = []
    for citation in response.get("citations", []):
        for reference in citation.get("retrievedReferences", []):
            name = _source_name(reference)
            if name and name not in sources:
                sources.append(name)

    return {
        "answer": response["output"]["text"],
        "sources": sources,
        "session_id": response.get("sessionId"),
    }
