#!/bin/bash

# Define the virtual environment directory (relative to /root)
VENV_DIR=".venv"

# Create the virtual environment in the specified directory if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
  python3 -m venv "$VENV_DIR"
fi

project_dir="$VENV_DIR/project"
if [ ! -d "$project_dir" ]; then
  mkdir -p "$project_dir"
fi

# Create an empty main.py file inside the project folder
touch "$project_dir/main.py"


echo "Virtual environment created in: $VENV_DIR"
echo "Project folder created at: $project_dir"
echo "Empty main.py file created."

