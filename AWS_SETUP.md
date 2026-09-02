# AWS setup for Session 9

Use the same AWS Region as `AWS_REGION` in `backend/.env` (currently the project uses Asia Pacific Sydney unless you change it).

1. Open **Amazon S3** and create or select a bucket.
2. Create the prefix `travel-guides/` and upload all four files from the local `travel-guides/` folder.
3. Open **Amazon Bedrock → Knowledge bases**.
4. Create a knowledge base with a vector store named `kelana-travel-kb`.
5. Let Bedrock create its service role, choose the S3 location from step 2, and select **Titan Text Embeddings V2**.
6. Use **Quick create a new vector store** (S3 Vectors or another option available in the lab account).
7. Open the resulting S3 data source and choose **Sync**. Wait until its status is complete.
8. Copy the non-secret IDs and URI into `backend/.env`:

```dotenv
KNOWLEDGE_BASE_ID=XXXXXXXXXX
KNOWLEDGE_BASE_DATA_SOURCE_ID=XXXXXXXXXX
KNOWLEDGE_BASE_MODEL_ARN=arn:aws:bedrock:ap-southeast-2::foundation-model/amazon.nova-lite-v1:0
KNOWLEDGE_BASE_S3_URI=s3://YOUR-BUCKET/travel-guides/
```

If the console's **Test knowledge base** panel uses a different supported response model, copy that model ARN instead.

After configuration, verify from the project root:

```bash
python scripts/compare_answers.py
```

This command replaces the comparison report with five live base-model and RAG responses, including the document names returned by Bedrock.
