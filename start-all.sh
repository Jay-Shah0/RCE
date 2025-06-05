#!/bin/bash

# Run each command in its respective directory in the background
echo "Starting Frontend..."
(cd Frontend && npm run dev) &

echo "Starting APIs..."
(cd APIs && npm start) &

echo "Starting Auth..."
(cd Auth && go run main.go) &

echo "Starting Repl Service..."
(cd replservice/server && go run main.go) &

echo "Starting Repl Service Socket"
docker run -d --network repl-network --name socket-server -p 8099:8099 go-based-socket:latest &

# Wait for all background jobs
wait
echo "All services started."
