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
    "Berapa harga KSC-72 untuk anak, di mana lokasi pengambilannya, dan kapan cruise harus dipesan?",
    "Untuk KFS-24, kapan batas pemesanan dan berapa menit waktu tunggu gratis setelah pesawat mendarat?",
    "Berapa manfaat keterlambatan perjalanan NS-2026 dan dokumen apa yang wajib disertakan saat klaim?",
    "Apa saja empat dokumen Yellow Packet dan apa nama file PDF yang harus diunggah?",
    "Apakah kehilangan satu barang senilai USD 400 diganti penuh oleh NS-2026? Jelaskan batas yang berlaku.",
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
        "Dokumen berisi kebijakan demo internal dengan kode dan angka yang tidak tersedia dalam pengetahuan umum. Karena itu, jawaban yang menyebut fakta tepat serta sumbernya merupakan bukti retrieval.",
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
