This project uses NextJS with Vercel for deployment along with the Postgres database. Make sure to have a vercel project setup with a postgres database. Below is an example of the dotenv environment:

```
POSTGRES_URL="postgres://default:CJ4otUrqAX1x@ep-little-dawn-25224578-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb"
POSTGRES_PRISMA_URL="postgres://default:CJ4otUrqAX1x@ep-little-dawn-25224578-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgres://default:CJ4otUrqAX1x@ep-little-dawn-25224578.us-east-1.postgres.vercel-storage.com:5432/verceldb"
POSTGRES_USER="default"
POSTGRES_HOST="ep-little-dawn-25224578-pooler.us-east-1.postgres.vercel-storage.com"
POSTGRES_PASSWORD="<user-password>"
POSTGRES_DATABASE="verceldb"
HOST_URL="http://localhost:3000"
```

#### Setup for Local Development
* Run ```npm install```
* Setup dotenv file by copying ```.env.local``` file to ```.env```
* After checking out the project seed the database by running the Prisma seed file with ```npx prisma db seed```
* Build the Prisma types with ```prisma generate```
* Run the Nextjs dev server ```npm run dev```
