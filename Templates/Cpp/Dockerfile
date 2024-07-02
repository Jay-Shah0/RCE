FROM jayshah259/worker:latest

RUN apt-get update && \
    apt-get install -y python3-venv python3-pip

# Create a directory for the virtual environment
WORKDIR /root

# Create a virtual environment named "venv"
RUN python3 -m venv venv