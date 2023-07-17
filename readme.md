## TIK-TAK-TOE online game using react and nodejs, based on sockets
#### Install modules

1. `cd tik-tak-toe`
2. `yarn`
3. `cd ..`
4. `cd serv`
5. `yarn`

#### .env example
<pre>
DB_PORT=5432
DB_USER=user_name
DB_PASSWORD=user_pass
DB_NAME=battles
DB_HOST=localhost

SERV_PORT=5000
SERV_HOST=192.168.0.101

WS_PORT=9000
</pre>

> be sure you have started postgres on port <DB_PORT> with user name <DB_USER>, password <DB_PASSWORD> and created database call battles

#### Start back-end
`yarn dev`

#### Start front-end
`yarn dev`

##### In multiple localhost's mode

`cd` __tik-tak-toe/src/requests__
###### change this line:
> export const serv_host = "__localhost__"
###### with your machile local ip
> export const serv_host = "__192.168.0.101__"

`yarn dev --host --port 3000`
`yarn dev --host --port 3001`
`...`

