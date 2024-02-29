**Start application**

Use `docker compose up`

Once all 3 services are up and running, access http://localhost:3000/todos

First time setup can take 5 to 10 mins, as docker images need to be pulled and node_modules need to be installed. In case it fails, just retry by stopping all containers and start again.

Use `docker stop $(docker ps -q)` and then `docker compose up`.

**Containers**

There are 3 containers / services

 1. React Frontend
 2. NodeJs / Express Backend
 3. Mongo DB Server

**Code**

The code is split into 2 folders:
 1. fe - The frontend code which runs in container 1
 2. be - The backend code which runs in container 2
