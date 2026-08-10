# Internal modules
from config import POSTGRES_DB, POSTGRES_PORT, POSTGRES_HOST, SYNC_WRITER_USER, SYNC_WRITER_PASSWORD
from ..errors import MissingData
 
# PostgreSQL
from psycopg.rows import dict_row
from psycopg import connect

# Other
from contextlib import contextmanager


class DBClient: 
    def __init__(self):
        if not all([POSTGRES_DB, POSTGRES_HOST, SYNC_WRITER_USER, SYNC_WRITER_PASSWORD]):
            raise MissingData("[SRV.DB.INIT] !> Missing database information on the .env")

        self.username = SYNC_WRITER_USER
        self.__password = SYNC_WRITER_PASSWORD
        self.database = POSTGRES_DB
        self.port = POSTGRES_PORT # default is 5432
        self.host = POSTGRES_HOST if POSTGRES_HOST else "localhost" 

    """
    This function returns only 1 connection to postgresql (no pool)
    as a context manager to use `with` statement
    """
    @contextmanager
    def get_db_connection(self): 
        with connect(
            dbname=self.database,
            user=self.username,
            password=self.__password,
            host=self.host,
            port=self.port,
            row_factory=dict_row
        ) as conn:
            yield conn

    """
    This function returns only 1 connection to postgresql (no pool)
    to store as a variable
    """
    def connection(self):
        return connect(
            dbname=self.database,
            user=self.username,
            password=self.__password,
            host=self.host,
            port=self.port,
            row_factory=dict_row
        )


