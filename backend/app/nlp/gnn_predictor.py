import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import List, Dict, Union
from app.db.neo4j_provider import neo4j_provider
import numpy as np

class GCNLayer(nn.Module):
    def __init__(self, in_features: int, out_features: int):
        super(GCNLayer, self).__init__()
        self.linear = nn.Linear(in_features, out_features)

    def forward(self, x: torch.Tensor, adj: torch.Tensor) -> torch.Tensor:
        out = torch.mm(adj, x)
        out = self.linear(out)
        return out

class SkillGNN(nn.Module):
    def __init__(self, n_skills: int, embedding_dim: int = 64):
        super(SkillGNN, self).__init__()
        self.embedding = nn.Embedding(n_skills, embedding_dim)
        self.gcn1 = GCNLayer(embedding_dim, 128)
        self.gcn2 = GCNLayer(128, embedding_dim)
        self.output = nn.Linear(embedding_dim, n_skills)

    def forward(self, skill_indices: torch.Tensor, adj: torch.Tensor) -> torch.Tensor:
        x = self.embedding(skill_indices)
        x = F.relu(self.gcn1(x, adj))
        x = self.gcn2(x, adj)
        return torch.sigmoid(self.output(x.mean(dim=0, keepdim=True)))

class PotentialPredictor:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = SkillGNN(n_skills=5000).to(self.device)
        self.model.eval()

    def predict_next_skills(self, candidate_id: str) -> List[Dict[str, Union[str, float]]]:
        skills = self._get_candidate_skills(candidate_id)
        if not skills:
            return []

        skill_map = self._get_skill_index_map()
        indices = [skill_map[s] for s in skills if s in skill_map]
        
        if not indices:
            return []

        indices_tensor = torch.tensor(indices, dtype=torch.long).to(self.device)
        adj = torch.eye(len(indices)).to(self.device)
        
        with torch.no_grad():
            preds = self.model(indices_tensor, adj).squeeze()
            
        top_indices = torch.topk(preds, k=5).indices.cpu().numpy()
        reverse_map = {v: k for k, v in skill_map.items()}
        
        return [
            {"skill": reverse_map.get(idx, "Unknown"), "probability": float(preds[idx])}
            for idx in top_indices
        ]

    def _get_candidate_skills(self, candidate_id: str) -> List[str]:
        query = "MATCH (c:Candidate {id: $id})-[:HAS_SKILL]->(s:Skill) RETURN s.name as name"
        result = neo4j_provider.query(query, {"id": candidate_id})
        return [r["name"] for r in result]

    def _get_skill_index_map(self) -> Dict[str, int]:
        return {
            "python": 0, "react": 1, "typescript": 2, "docker": 3, "kubernetes": 4,
            "aws": 5, "pytorch": 6, "tensorflow": 7, "django": 8, "fastapi": 9,
            "next.js": 10, "postgresql": 11, "mongodb": 12, "redis": 13, "neo4j": 14
        }

potential_predictor = PotentialPredictor()
