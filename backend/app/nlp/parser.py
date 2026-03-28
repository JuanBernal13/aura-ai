from typing import Dict, Union, List
from langchain_community.document_loaders import PyPDFLoader
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from app.schemas.candidate import CandidateParsedData
from app.core.config import settings

class ResumeParser:
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4-turbo-preview",
            openai_api_key=settings.OPENAI_API_KEY,
            temperature=0
        )
        self.parser = PydanticOutputParser(pydantic_object=CandidateParsedData)
        self.prompt = PromptTemplate(
            template="Extract candidate data from the following resume text:\n{format_instructions}\n{text}",
            input_variables=["text"],
            partial_variables={"format_instructions": self.parser.get_format_instructions()}
        )
        self.chain = self.prompt | self.llm | self.parser

    def parse_pdf(self, file_path: str) -> str:
        loader = PyPDFLoader(file_path)
        pages = loader.load()
        return "\n".join([p.page_content for p in pages])

    def extract_structured_data(self, text: str) -> Dict[str, Union[str, List[str], List[dict], None]]:
        result = self.chain.invoke({"text": text})
        return result.dict()

resume_parser = ResumeParser()
