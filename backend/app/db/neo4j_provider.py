from neo4j import GraphDatabase
from app.core.config import settings


class Neo4jProvider:
    def __init__(self):
        self.driver = GraphDatabase.driver(
            settings.NEO4J_URL, auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
        )

    def close(self):
        self.driver.close()

    def query(self, cypher, parameters=None):
        with self.driver.session() as session:
            return session.run(cypher, parameters)

    def upsert_skill(self, skill_name: str, category: str = None):
        cypher = """
        MERGE (s:Skill {name: $name})
        SET s.category = $category
        RETURN s
        """
        return self.query(cypher, {"name": skill_name.lower(), "category": category})

    def link_candidate_skill(
        self, candidate_id: str, skill_name: str, proficiency: float = 0.0
    ):
        cypher = """
        MATCH (c:Candidate {id: $candidate_id})
        MERGE (s:Skill {name: $skill_name})
        MERGE (c)-[r:HAS_SKILL]->(s)
        SET r.proficiency = $proficiency
        """
        return self.query(
            cypher,
            {
                "candidate_id": candidate_id,
                "skill_name": skill_name.lower(),
                "proficiency": proficiency,
            },
        )

    def link_job_skill(self, job_id: str, skill_name: str, weight: float = 1.0):
        cypher = """
        MATCH (j:Job {id: $job_id})
        MERGE (s:Skill {name: $skill_name})
        MERGE (j)-[r:REQUIRES_SKILL]->(s)
        SET r.weight = $weight
        """
        return self.query(
            cypher,
            {"job_id": job_id, "skill_name": skill_name.lower(), "weight": weight},
        )

    def create_candidate_node(self, candidate_id: str, name: str):
        cypher = "MERGE (c:Candidate {id: $id}) SET c.name = $name"
        return self.query(cypher, {"id": candidate_id, "name": name})

    def create_job_node(self, job_id: str, title: str):
        cypher = "MERGE (j:Job {id: $id}) SET j.title = $title"
        return self.query(cypher, {"id": job_id, "title": title})

    def get_skill_gap(self, candidate_id: str, job_id: str):
        cypher = """
        MATCH (j:Job {id: $job_id})-[r:REQUIRES_SKILL]->(s:Skill)
        OPTIONAL MATCH (c:Candidate {id: $candidate_id})-[h:HAS_SKILL]->(s)
        RETURN s.name as skill, r.weight as required_weight, h.proficiency as candidate_proficiency
        """
        return self.query(cypher, {"candidate_id": candidate_id, "job_id": job_id})


neo4j_provider = Neo4jProvider()
