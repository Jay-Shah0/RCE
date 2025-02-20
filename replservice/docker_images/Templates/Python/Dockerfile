FROM jayshah259/worker:latest

RUN apt-get update && \
    apt-get install -y python3 python3-venv && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a directory for the virtual environment
WORKDIR /root

# Copy the entrypoint script into the image
COPY venvsetup.sh /venvsetup.sh
RUN chmod +x /venvsetup.sh

# Run the entrypoint script to setup venv and delete itself
RUN /venvsetup.sh && rm /venvsetup.sh

VOLUME [ "/root/.venv" ]

WORKDIR /

COPY rename_project.sh /rename_project.sh
RUN chmod +x /rename_project.sh

CMD ["/bin/bash", "-c", "/rename_project.sh && exec /repl/worker"]






