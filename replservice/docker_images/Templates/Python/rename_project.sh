#!/bin/bash

# Define the environment variable name (replace with your actual variable)
env_var_name="PROJECT_DIR"

# Check if the environment variable is set
if [ -z "${!env_var_name}" ]; then
  echo "Error: Environment variable '${env_var_name}' not set."
  exit 1
fi

# Construct the source and destination paths
source_path="/root/.venv/project"
dest_path="${!env_var_name}"

# Check if the source folder exists
if [ ! -d "$source_path" ]; then
  echo "Folder '$source_path' not found. Skipping rename."
  exit 0
fi

# Rename the folder
if mv "$source_path" "$dest_path"; then
  echo "Successfully renamed project folder to '$dest_path'."
else
  echo "Error renaming folder: $?"  # Print the exit code of the mv command
fi

mv /rename_project.sh /usr/local/bin/

echo "Successfully renamed project folder and moved script."