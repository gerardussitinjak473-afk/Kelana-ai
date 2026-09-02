import os
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv


ROOT = Path(__file__).resolve().parents[1]
BACKEND = ROOT / "backend"
os.sys.path.insert(0, str(BACKEND))
load_dotenv(BACKEND / ".env")

from services.bedrock_service import client as base_client  # noqa: E402
from services.bedrock_service import MODEL_ID  # noqa: E402
from services.kb_service import ask_knowledge_base  # noqa: E402


QUESTIONS = [
    "Menurut indonesia-customs-and-imei-guide.md, apa yang harus dilakukan wisatawan agar IMEI ponsel dari luar negeri dapat digunakan di Indonesia?",
    "Menurut indonesian-traveler-payment-guide.md, metode pembayaran dan cara memperoleh uang tunai apa yang disarankan untuk wisatawan Indonesia?",
    "Menurut japan-halal-dining-guide.md, bagaimana wisatawan Muslim dapat memilih makanan dan restoran halal di Jepang?",
    "Menurut Kyoto_Travel_Guide_EN.md, tempat dan pengalaman utama apa yang direkomendasikan untuk kunjungan ke Kyoto?",
    "Menurut Japan-Packing-List.pdf, barang penting apa saja yang perlu dipersiapkan sebelum perjalanan ke Jepang?",
]


def ask_base_model(question: str) -> str:
    response = base_client.converse(
        modelId=MODEL_ID,
        messages=[{
            "role": "user",
            "content": [{"text": "Jawab singkat dalam bahasa Indonesia. Jika fakta tidak diketahui, katakan tidak tahu. Pertanyaan: " + question}],
        }],
        inferenceConfig={"temperature": 0, "maxTokens": 500},
    )
    return response["output"]["message"]["content"][0]["text"]


def main() -> None:
    sections = [
        "# Perbandingan Jawaban KelanaAI — RAG vs Base Model",
        "",
        f"Dijalankan: {datetime.now(timezone.utc).isoformat()}",
        "",
        "Kelima pertanyaan secara eksplisit membutuhkan informasi dari dokumen yang telah berstatus INDEXED di Amazon Bedrock Knowledge Base. Jawaban dan nama sumber di bawah merupakan keluaran aktual dari masing-masing arsitektur.",
    ]
    for index, question in enumerate(QUESTIONS, 1):
        base_answer = ask_base_model(question)
        rag = ask_knowledge_base(question)
        sources = ", ".join(rag["sources"]) or "Tidak ada sumber"
        sections.extend([
            "",
            f"## {index}. {question}",
            "",
            "### Base model",
            "",
            base_answer.strip(),
            "",
            "### RAG",
            "",
            rag["answer"].strip(),
            "",
            f"**Sumber:** {sources}",
            "",
            "**Peningkatan:** RAG dapat merujuk fakta internal yang spesifik dan menunjukkan dokumen pendukung; base model tidak memiliki akses ke dokumen tersebut.",
        ])

    output = ROOT / "reports" / "rag-vs-base-model.md"
    output.parent.mkdir(exist_ok=True)
    output.write_text("\n".join(sections) + "\n", encoding="utf-8")
    print(output)


if __name__ == "__main__":
    main()
