# Stage 1: Build the Go binary
FROM golang:1.22.3 AS builder

# Set the Current Working Directory inside the builder container
WORKDIR /app

# Copy the Go application source code
COPY . ./socket

WORKDIR /app/socket

# Build the Go binary with static linking
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/socketserver

# Stage 2: Create a minimal image with the Go binary
FROM scratch

# Set the Current Working Directory inside the final container
WORKDIR /app

# Copy the Go binary from the builder stage
COPY --from=builder /app/socketserver /app/socketserver

# Run the binary when the container starts
ENTRYPOINT ["./socketserver"]
