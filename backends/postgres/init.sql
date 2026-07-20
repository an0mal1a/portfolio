CREATE ROLE app_reader
    WITH
    LOGIN
    PASSWORD 'reader_password'
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE
    NOREPLICATION;
 
GRANT CONNECT ON DATABASE portfolio_db TO app_reader;
 
GRANT USAGE ON SCHEMA public TO app_reader;

GRANT SELECT
ON ALL TABLES IN SCHEMA public
TO app_reader;