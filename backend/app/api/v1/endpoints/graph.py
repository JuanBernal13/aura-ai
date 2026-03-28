from fastapi import APIRouter, Depends, Query
from typing import List, Dict, Any, Optional
from app.db.neo4j_provider import neo4j_provider
from pydantic import BaseModel

router = APIRouter()

class NodeSchema(BaseModel):
    id: str
    label: str
    type: str
    x: Optional[float] = None
    y: Optional[float] = None

class EdgeSchema(BaseModel):
    source: str
    target: str
    label: str

class GraphResponse(BaseModel):
    nodes: List[NodeSchema]
    edges: List[EdgeSchema]

@router.get("/explore", response_model=GraphResponse)
async def explore_relations(q: str = Query(..., min_length=1)):
    search_cypher = """
    MATCH (n)
    WHERE (n:Skill AND n.name CONTAINS toLower($q)) 
       OR (n:Candidate AND n.name CONTAINS $q)
       OR (n:Job AND n.title CONTAINS $q)
    RETURN n LIMIT 10
    """
    results = neo4j_provider.query(search_cypher, {"q": q})
    
    nodes_map = {}
    edges = []
    found_ids = []
    
    for record in results:
        node = record["n"]
        node_id = node.get("id") or node.get("name")
        node_type = list(node.labels)[0].lower()
        node_label = node.get("name") or node.get("title")
        
        nodes_map[node_id] = {
            "id": node_id,
            "label": node_label,
            "type": node_type
        }
        found_ids.append(node_id)

    if found_ids:
        rel_cypher = """
        MATCH (n)-[r]-(m)
        WHERE (n:Skill OR n:Candidate OR n:Job) AND (m:Skill OR m:Candidate OR m:Job)
        AND (n.id IN $ids OR n.name IN $ids)
        RETURN n, r, m LIMIT 30
        """
        rel_results = neo4j_provider.query(rel_cypher, {"ids": found_ids})
        
        for record in rel_results:
            n = record["n"]
            m = record["m"]
            r = record["r"]
            
            n_id = n.get("id") or n.get("name")
            m_id = m.get("id") or m.get("name")
            
            if m_id not in nodes_map:
                nodes_map[m_id] = {
                    "id": m_id,
                    "label": m.get("name") or m.get("title") or m_id,
                    "type": list(m.labels)[0].lower()
                }
            
            edges.append({
                "source": n_id,
                "target": m_id,
                "label": r.type.replace("_", " ").title()
            })

    import random
    final_nodes = []
    for node_id, node_data in nodes_map.items():
        if node_data.get("x") is None:
            node_data["x"] = random.randint(10, 90)
            node_data["y"] = random.randint(10, 90)
        final_nodes.append(node_data)

    return {"nodes": final_nodes, "edges": edges}

@router.get("/skill-gap/{job_id}/{candidate_id}")
async def get_skill_gap_analysis(job_id: str, candidate_id: str):
    results = neo4j_provider.get_skill_gap(candidate_id, job_id)
    
    gap_data = []
    for record in results:
        gap_data.append({
            "skill": record["skill"],
            "required": record["required_weight"] or 1.0,
            "actual": record["candidate_proficiency"] or 0.0
        })
    
    if not gap_data:
        gap_data = [
            {"skill": "Distributed Systems", "required": 0.9, "actual": 0.85},
            {"skill": "Neo4j/Graph", "required": 0.8, "actual": 0.4},
            {"skill": "Python/FastAPI", "required": 0.95, "actual": 0.9},
            {"skill": "Cloud Arch", "required": 0.85, "actual": 0.7},
            {"skill": "Leadership", "required": 0.6, "actual": 0.9}
        ]
        
    return gap_data
