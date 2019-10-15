# DDOS Docker Swarm attack

## Run
```
    docker build -t ddos-attack:0.1 .
    docker swarm init
    docker service create --name ddos_attack_service --detach=false ddos-attack:0.1
    docker service scale ddos_attack_service=100
```

## Connect to AWS
```
    ./connect
```

## Config victim nginx server
```
    sudo apt-get install nginx
    sudo mv nginx/default.conf /etc/nginx/sites-enabled/default
    sudo service nginx restart
```

## Monitoring victim nginx server
Go to http://18.190.15.1/nginx_status
