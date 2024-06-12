FROM ubuntu:22.04

# Update package lists
RUN apt-get update

# Install essential tools including curl
RUN apt-get install -y curl wget git bash

# Install Go toolchain of the desired version
RUN curl -sL https://dl.google.com/go/go1.22.3.linux-amd64.tar.gz | tar -xzf - -C /usr/local

# Add Go to PATH
ENV PATH=/usr/local/go/bin:$PATH

# Set working directory for Go build
WORKDIR /repl

# Copy the Go application source code
COPY websocketserver ./websocketserver

WORKDIR /repl/websocketserver

# Build the Go binary (use "./" for current directory)
RUN go build -o /repl/websocket_server

WORKDIR /repl

# Delete the Go source code directory (after build)
RUN rm -rf websocketserver

# Expose port 8099
EXPOSE 8099

# Run the binary when the container starts
ENTRYPOINT ["./websocket_server"]
