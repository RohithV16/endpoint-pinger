# endpoint-pinger

```markdown
### How to Dockerize (Build the Image)

```bash
docker build -t endpoint-pinger:latest .
```

### How to Run the Docker Container

#### Running in Foreground (Attached Mode)

```bash
docker run endpoint-pinger:latest
```

#### Running in Background (Detached Mode)

```bash
docker run -d endpoint-pinger:latest
```

#### Viewing Logs of a Detached Container

First, find the container ID or name:
```bash
docker ps
```
Then, view logs:
```bash
docker logs <CONTAINER_ID_OR_NAME>
```
To follow logs in real-time:
```bash
docker logs -f <CONTAINER_ID_OR_NAME>
```

#### Stopping a Detached Container

```bash
docker stop <CONTAINER_ID_OR_NAME>
```
