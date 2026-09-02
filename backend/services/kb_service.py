import os
from pathlib import PurePosixPath
from urllib.parse import urlparse

import boto3
from dotenv import load_dotenv


load_dotenv()

KNOWLEDGE_BASE_ID = os.getenv("KNOWLEDGE_BASE_ID", "").strip()
AWS_REGION = os.getenv("AWS_REGION", "ap-southeast-2")
MODEL_ID = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")


class KnowledgeBaseNotConfigured(RuntimeError):
    pass


def _retrieval_client():
    return boto3.client("bedrock-agent-runtime", region_name=AWS_REGION)


def _generation_client():
    return boto3.client("bedrock-runtime", region_name=AWS_REGION)


def _source_name(reference: dict) -> str | None:
    metadata = reference.get("metadata", {})
    for key in ("_document_title", "document_title", "x-amz-bedrock-kb-source-uri"):
        value = metadata.get(key)
        if value:
            return PurePosixPath(urlparse(str(value)).path).name or str(value)

    location = reference.get("location", {})
    uri = location.get("s3Location", {}).get("uri")
    if uri:
        return PurePosixPath(urlparse(uri).path).name or uri
    url = location.get("webLocation", {}).get("url")
    if url:
        return url
    return reference.get("documentId")


def ask_knowledge_base(question: str) -> dict:
    if not KNOWLEDGE_BASE_ID:
        raise KnowledgeBaseNotConfigured(
            "KNOWLEDGE_BASE_ID belum dikonfigurasi."
        )

    response = _retrieval_client().retrieve(
        knowledgeBaseId=KNOWLEDGE_BASE_ID,
        retrievalQuery={"text": question},
        retrievalConfiguration={
            "managedSearchConfiguration": {"numberOfResults": 5}
        },
    )

    sources = []
    context_chunks = []
    for reference in response.get("retrievalResults", []):
        text = reference.get("content", {}).get("text", "").strip()
        name = _source_name(reference) or "Dokumen tanpa judul"
        if text:
            context_chunks.append(f"[Sumber: {name}]\n{text}")
        if name not in sources:
            sources.append(name)

    if not context_chunks:
        return {
            "answer": "Saya tidak menemukan informasi yang relevan di Knowledge Base.",
            "sources": [],
            "session_id": None,
        }

    prompt = (
        "Jawab pertanyaan dalam bahasa Indonesia hanya berdasarkan konteks berikut. "
        "Jika konteks tidak cukup, katakan informasi tidak ditemukan. Jangan mengarang fakta. "
        "Jawab ringkas dan sebutkan nama sumber yang mendukung jawaban.\n\n"
        + "\n\n".join(context_chunks)
        + f"\n\nPertanyaan: {question}"
    )
    generated = _generation_client().converse(
        modelId=MODEL_ID,
        messages=[{"role": "user", "content": [{"text": prompt}]}],
        inferenceConfig={"temperature": 0, "maxTokens": 800},
    )

    return {
        "answer": generated["output"]["message"]["content"][0]["text"],
        "sources": sources,
        "session_id": None,
    }
