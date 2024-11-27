import psycopg2
from Settings import DatabaseSettings

class Database:
    def __init__(self, database_settings: DatabaseSettings):
        self.conn = self.connect_postgres(database_settings)

    def connect_postgres(self, database_settings: DatabaseSettings) -> psycopg2.connect:
        """Connect to the PostgreSQL using psycopg2 with default database
           Return the connection"""
        conn = psycopg2.connect(dbname=database_settings.dbname,
                                user=database_settings.dbuser,
                                host=database_settings.dbhost,
                                password=database_settings.dbpassword,
                                port=database_settings.dbport)
        print("Connection to database successful!!")
        return conn
