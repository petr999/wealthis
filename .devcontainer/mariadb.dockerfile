FROM mariadb

COPY wealthis.sql /docker-entrypoint-initdb.d/

RUN ["docker-entrypoint.sh"]
