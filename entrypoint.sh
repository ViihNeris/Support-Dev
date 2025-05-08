#!/bin/sh

# Espera até que o MySQL esteja aceitando conexões
until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "Aguardando MySQL em $DB_HOST:$DB_PORT..."
  sleep 2
done

# Executa as migrations e inicia o servidor
node ace migration:run
node ace serve --watch