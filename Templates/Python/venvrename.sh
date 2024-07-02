#!/bin/bash

# Set a default venv name if not provided
VENV_NAME=${1:-my_venv}

# Check if the venv folder exists
if [ -d "/root/venv" ]; then
    # Rename the venv folder to the specified name
    mv "/root/venv" "/root/${VENV_NAME}"
    echo "Renamed venv folder to ${VENV_NAME}"
else
    echo "Venv folder does not exist in /root."
fi

# Run the command specified by CMD in the Dockerfile
exec "$@"

rm -- "$0"
