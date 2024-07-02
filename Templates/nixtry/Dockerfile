# Use an official Ubuntu as the base image
FROM ubuntu:20.04

# Install necessary packages
RUN apt-get update && \
    apt-get install -y \
    curl \
    wget \
    unzip \
    python3 \
    python3-venv \
    xz-utils && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Manually create the /nix directory and necessary groups and users for Nix
RUN mkdir -m 0755 /nix && chown root /nix

# Install Nix in single-user mode
RUN curl -L https://nixos.org/nix/install | sh -s -- --no-daemon --single-user

# Set up Nix environment for subsequent commands
ENV NIX_PATH=/nix/var/nix/profiles/per-user/root/channels/nixpkgs
ENV PATH="/nix/var/nix/profiles/default/bin:$PATH"

# Ensure the Nix environment is available at runtime
RUN echo 'source /root/.nix-profile/etc/profile.d/nix.sh' >> /root/.bashrc

# Set the working directory
WORKDIR /root

# Copy the entrypoint script into the image
COPY venvsetup.sh /venvsetup.sh
RUN chmod +x /venvsetup.sh

# Run the entrypoint script to setup venv and delete itself
RUN /venvsetup.sh && rm /venvsetup.sh

# Set the /nix/store volume
VOLUME ["/nix/store"]

# Set the configuration volume
VOLUME ["/packages"]

# Copy the script file
COPY installPackages.sh /tmp/

WORKDIR /tmp

# Use ENTRYPOINT to ensure the Nix environment is sourced at runtime
ENTRYPOINT ["/bin/bash", "-c", "source /root/.nix-profile/etc/profile.d/nix.sh && ./installPackages.sh"]

# Use CMD to run the worker binary after starting
CMD ["/repl/worker"]
