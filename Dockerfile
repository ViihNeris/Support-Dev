FROM node:18

# Instala netcat-openbsd (versão moderna)
RUN apt-get update && apt-get install -y netcat-openbsd

WORKDIR /app

COPY . .

RUN npm install

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
