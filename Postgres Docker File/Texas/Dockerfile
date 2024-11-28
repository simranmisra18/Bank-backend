FROM library/postgres
ENV POSTGRES_USER=tx-branch
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_DB=tx-branch
COPY init.sql /docker-entrypoint-initdb.d/
