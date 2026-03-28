from typing import List
import torch
from sentence_transformers import SentenceTransformer
from app.db.session import qdrant_client
from qdrant_client.models import Distance, VectorParams, PointStruct
import uuid


class EmbeddingService:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = SentenceTransformer(model_name, device=self.device)
        self.collection_name = "candidates"
        self._ensure_collection()

    def _ensure_collection(self):
        collections = qdrant_client.get_collections().collections
        exists = any(c.name == self.collection_name for c in collections)
        if not exists:
            qdrant_client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=384, distance=Distance.COSINE),
            )

    def get_embedding(self, text: str) -> List[float]:
        embedding = self.model.encode(text)
        return embedding.tolist()

    def index_candidate(self, candidate_id: str, text: str, metadata: dict = None):
        vector = self.get_embedding(text)
        qdrant_client.upsert(
            collection_name=self.collection_name,
            points=[
                PointStruct(
                    id=str(uuid.UUID(candidate_id)),
                    vector=vector,
                    payload=metadata or {},
                )
            ],
        )

    def search_candidates(self, query_text: str, limit: int = 10):
        query_vector = self.get_embedding(query_text)
        return qdrant_client.search(
            collection_name=self.collection_name, query_vector=query_vector, limit=limit
        )


embedding_service = EmbeddingService()
