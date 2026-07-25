CREATE SCHEMA IF NOT EXISTS portfolio;
CREATE SCHEMA IF NOT EXISTS github;
CREATE SCHEMA IF NOT EXISTS contact;

CREATE ROLE api_reader
    WITH
    LOGIN
    PASSWORD :'api_reader_password'
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE
    NOREPLICATION;

CREATE ROLE sync_writer
    WITH
    LOGIN
    PASSWORD :'sync_writer_password'
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE
    NOREPLICATION;

-- Github repositories tables
CREATE TABLE github.accounts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    github_login TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    profile_url TEXT,
    account_type TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT accounts_type_check
        CHECK (
            account_type IN (
                'User',
                'Organization',
                'Bot'
            )
        )
);


CREATE TABLE github.repositories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    github_id BIGINT NOT NULL UNIQUE,

    owner_id BIGINT NOT NULL
        REFERENCES github.accounts(id)
        ON DELETE RESTRICT,

    name TEXT NOT NULL,
    description TEXT,
    repository_url TEXT NOT NULL,
    main_language TEXT,

    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    is_fork BOOLEAN NOT NULL DEFAULT FALSE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,

    forks_count INTEGER NOT NULL DEFAULT 0,
    open_issues_count INTEGER NOT NULL DEFAULT 0,
    stars_count INTEGER NOT NULL DEFAULT 0,

    is_portfolio_visible BOOLEAN NOT NULL,
    display_name TEXT,
    display_description TEXT,

    github_created_at TIMESTAMPTZ NOT NULL,
    github_updated_at TIMESTAMPTZ NOT NULL,
    github_pushed_at TIMESTAMPTZ,

    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT repositories_owner_name_unique
        UNIQUE (owner_id, name),

    CONSTRAINT repositories_counts_check
        CHECK (
            forks_count >= 0
            AND open_issues_count >= 0
            AND stars_count >= 0
        )
);


CREATE TABLE github.repository_languages (
    repository_id BIGINT NOT NULL
        REFERENCES github.repositories(id)
        ON DELETE CASCADE,

    language TEXT NOT NULL, 
    percentage NUMERIC(5, 2) NOT NULL DEFAULT 0,

    PRIMARY KEY (repository_id, language),

    CONSTRAINT repository_languages_values_check
        CHECK (
            percentage >= 0
                AND percentage <= 100
        )
);


CREATE TABLE github.repository_topics (
    repository_id BIGINT NOT NULL
        REFERENCES github.repositories(id)
        ON DELETE CASCADE,

    topic TEXT NOT NULL,

    PRIMARY KEY (repository_id, topic)
);


CREATE TABLE github.repository_contributors (
    repository_id BIGINT NOT NULL
        REFERENCES github.repositories(id)
        ON DELETE CASCADE,

    account_id BIGINT NOT NULL
        REFERENCES github.accounts(id)
        ON DELETE CASCADE,

    PRIMARY KEY (repository_id, account_id)
);
CREATE INDEX repositories_owner_id_idx ON github.repositories (owner_id);
CREATE INDEX repositories_pushed_at_idx ON github.repositories (github_pushed_at DESC);
CREATE INDEX repositories_synced_at_idx ON github.repositories (synced_at DESC);
CREATE INDEX repositories_main_language_idx ON github.repositories (main_language) WHERE main_language IS NOT NULL;
CREATE INDEX repositories_portfolio_visible_idx ON github.repositories (github_pushed_at DESC) WHERE is_portfolio_visible = TRUE;
CREATE INDEX repositories_public_visible_idx ON github.repositories (github_pushed_at DESC)
    WHERE (
        is_portfolio_visible = TRUE
        AND is_private = FALSE
    );
CREATE INDEX repository_languages_language_idx ON github.repository_languages (language);
CREATE INDEX repository_topics_topic_idx ON github.repository_topics (topic);
CREATE INDEX repository_contributors_account_idx ON github.repository_contributors (account_id);

-- Portfolio tables
CREATE TABLE portfolio.clients (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    website TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE portfolio.projects (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    github_repository_id BIGINT
        REFERENCES github.repositories(id)
        ON DELETE SET NULL,

    client_id BIGINT REFERENCES portfolio.clients(id)
        ON DELETE SET NULL,

    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    tagline TEXT,
    description TEXT NOT NULL,

    project_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',

    repository_url TEXT,
    live_url TEXT,

    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,

    started_at DATE,
    completed_at DATE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT projects_status_check
        CHECK (
            status IN (
                'draft',
                'in_progress',
                'published',
                'archived'
            )
        ),

    CONSTRAINT projects_dates_check
        CHECK (
            completed_at IS NULL
            OR started_at IS NULL
            OR completed_at >= started_at
        )
);
CREATE INDEX projects_public_idx ON portfolio.projects (is_public) WHERE is_public = TRUE;
CREATE INDEX projects_featured_idx ON portfolio.projects (is_featured) WHERE is_featured = TRUE;
CREATE INDEX projects_client_id_idx ON portfolio.projects (client_id);
CREATE INDEX projects_github_repository_id_idx ON portfolio.projects (github_repository_id);


-- Contact messages table
CREATE TABLE contact.messages (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX messages_created_at_idx ON contact.messages (created_at DESC);

-- View for visible repositories in the portfolio
CREATE VIEW portfolio.visible_repositories AS
SELECT
    id,
    github_id,
    owner,
    name,
    full_name,
    COALESCE(display_name, name) AS display_name,
    COALESCE(display_description, description) AS description,
    visibility,
    primary_language,
    is_fork,
    is_archived,
    repository_url,
    homepage_url,
    github_created_at,
    github_updated_at,
    github_pushed_at,
    synced_at
FROM github.repositories
WHERE is_portfolio_visible = TRUE;



GRANT CONNECT ON DATABASE portfolio_db TO api_reader, sync_writer;

-- APIReader role grants
GRANT USAGE ON SCHEMA portfolio TO api_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA portfolio TO api_reader;
ALTER DEFAULT PRIVILEGES IN SCHEMA portfolio GRANT SELECT ON TABLES TO api_reader; 

-- SyncWriter role grants
GRANT USAGE ON SCHEMA portfolio, github, contact TO sync_writer;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA portfolio TO sync_writer;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA github TO sync_writer;
GRANT INSERT ON ALL TABLES IN SCHEMA contact TO sync_writer;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA github, contact TO sync_writer;

-- Future objects grants for SyncWriter role

ALTER DEFAULT PRIVILEGES IN SCHEMA github GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO sync_writer;
ALTER DEFAULT PRIVILEGES IN SCHEMA github GRANT USAGE, SELECT ON SEQUENCES TO sync_writer; 
ALTER DEFAULT PRIVILEGES IN SCHEMA contact GRANT INSERT ON TABLES TO sync_writer; 
ALTER DEFAULT PRIVILEGES IN SCHEMA contact GRANT USAGE, SELECT ON SEQUENCES TO sync_writer;

