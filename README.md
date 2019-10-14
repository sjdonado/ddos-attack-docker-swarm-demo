# DDOS Docker Swarm attack

```
    docker build -t ddos-attack:0.1 .
    docker swarm init
    docker service create --name ddos_attack_service --detach=false ddos-attack:0.1
    docker service scale ddos_attack_service=100
```