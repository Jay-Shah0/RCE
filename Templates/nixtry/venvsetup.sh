#!/bin/bash

# Define the virtual environment directory (relative to /root)
VENV_DIR=".venv"

# Create the virtual environment in the specified directory if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
  python3 -m venv "$VENV_DIR"
fi

# Activate the virtual environment (optional, but typically done for setting up Python environment)
source "$VENV_DIR/bin/activate"

