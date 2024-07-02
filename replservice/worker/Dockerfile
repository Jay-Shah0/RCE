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

# Build the Go binary (place the binary in the /repl directory)
RUN go build -o /repl/worker

# Stage 2: Create a minimal image with the Go binary
FROM ubuntu:22.04

# Copy the Go binary from the builder stage
COPY --from=builder /repl/worker /repl/workerz

# Set the working directory to /root
WORKDIR /root
