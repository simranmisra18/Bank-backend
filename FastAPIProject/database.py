from collections import defaultdict
from functools import lru_cache

from sqlalchemy import create_engine
from sqlmodel import Session, select

from Exceptions import UnauthorizedException
from SQLModels.Branch import Branch
from Settings import AZDatabaseSettings, TXDatabaseSettings

@lru_cache()
def GetAZDatabaseConnectionURL():
    database_settings = AZDatabaseSettings()
    return database_settings.dbname, 'postgresql+psycopg2://{}:{}@{}:{}/{}'.format(
        database_settings.dbuser,
        database_settings.dbpassword,
        database_settings.dbhost,
        database_settings.dbport,
        database_settings.dbname
    )

@lru_cache()
def GetTXDatabaseConnectionURL():
    database_settings = TXDatabaseSettings()
    return database_settings.dbname, 'postgresql+psycopg2://{}:{}@{}:{}/{}'.format(
        database_settings.dbuser,
        database_settings.dbpassword,
        database_settings.dbhost,
        database_settings.dbport,
        database_settings.dbname
    )

@lru_cache()
def GetDatabaseDictionary() -> defaultdict:
    database_urls = [GetAZDatabaseConnectionURL(), GetTXDatabaseConnectionURL()]
    database_dictionary = defaultdict(lambda: None)

    for branch_id, database_url in database_urls:
        engine = create_engine(database_url)
        with Session(engine) as session:
            branch_query = select(Branch)
            branch_result = session.exec(branch_query)
            branch_found = False
            for branch in branch_result:
                if branch_id == branch.branch_id:
                    branch_found = True
                    database_dictionary[branch.branch_id] = engine
            if not branch_found:
                raise Exception('Branch: "{}" not found!'.format(branch_id))

    return database_dictionary

def get_database_session(branch_id):
    database_dict = GetDatabaseDictionary()
    engine = database_dict[branch_id]

    if engine is None:
        raise UnauthorizedException('Invalid Branch ID!')

    with Session(engine) as session:
        yield session