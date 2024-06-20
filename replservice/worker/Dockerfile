# Stage 1: Build the Go binary
FROM golang:1.22.3 as builder

# Set the Current Working Directory inside the builder container
WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source code into the builder container
COPY . .

# Build the Go binary
RUN go build -o /repl/worker

# Stage 2: Create a minimal image with the Go binary
FROM ubuntu:22.04

# Install essential tools
RUN apt-get update && apt-get install -y curl wget git bash

# Copy the Go binary from the builder stage
COPY --from=builder /repl/worker /repl/worker

# Set the working directory
WORKDIR /repl

# Run the Go binary
ENTRYPOINT ["./worker"]
