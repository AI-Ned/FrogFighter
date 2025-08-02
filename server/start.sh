
#!/bin/bash
docker build -t frog-fighter .
docker run -d -p 8080:8080 --name frog-fighter-server frog-fighter
