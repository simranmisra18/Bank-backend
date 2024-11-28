FROM library/postgres
ENV POSTGRES_USER=az-branch
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_DB=az-branch
COPY init.sql /docker-entrypoint-initdb.d/
