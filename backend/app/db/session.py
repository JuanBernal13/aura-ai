from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pymongo import MongoClient
from qdrant_client import QdrantClient
from neo4j import GraphDatabase
from minio import Minio
import redis
from app.core.config import settings

engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


mongo_client = MongoClient(settings.MONGO_URL)
mongo_db = mongo_client[settings.MONGO_DB]


def get_mongo_db():
    return mongo_db


qdrant_client = QdrantClient(url=settings.QDRANT_URL)


def get_qdrant_client():
    return qdrant_client


neo4j_driver = GraphDatabase.driver(
    settings.NEO4J_URL, auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
)


def get_neo4j_session():
    with neo4j_driver.session() as session:
        yield session


minio_client = Minio(
    settings.MINIO_URL,
    access_key=settings.MINIO_ACCESS_KEY,
    secret_key=settings.MINIO_SECRET_KEY,
    secure=False,
)


def get_minio_client():
    return minio_client


redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)


def get_redis_client():
    return redis_client
