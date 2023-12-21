# Modec Tech Challenge

## Technologies Used:

### Database:
- [MySQL](https://www.mysql.com/) 8.0

## Local setup
- Setup environment variables:
```bash
cp .env.example .env
```

- Start the project locally:
```bash
docker compose up -d
```

- If you need to interact with the database, run:
```bash
docker exec -it modec-tech-challenge-db /bin/sh
source /.env && export $(grep DB_PASSWORD /.env | xargs)
source /.env && export $(grep DB_USER /.env | xargs)
source /.env && export $(grep DB_NAME /.env | xargs)
mysql -u $DB_USER --password=$DB_PASSWORD -D $DB_NAME
```
