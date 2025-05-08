```.env
TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=EK-2H_5ojPAjd3XXUKgs4CDIJBj26Rnz
NODE_ENV=development
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_DATABASE=app
```

```terminal
npm i
node ace migration:run
node ace serve --hmr
```