#!/bin/bash

# Get the package configuration file name from the argument
CONFIG_FILE="$1"

if [[ -z "$CONFIG_FILE" ]]; then
  echo "Error: Please specify a package configuration file name as an argument."
  exit 1
fi

# Check if the configuration file exists
if [[ ! -f "/packages/$CONFIG_FILE" ]]; then
  echo "Error: Package configuration file '$CONFIG_FILE' not found."
  exit 1
fi

# Read package names from the configuration file
PACKAGES=$(cat "/packages/$CONFIG_FILE" | tr '\n' ' ')

# Install packages using Nix
nix-env -iA nixpkgs.{${PACKAGES}}

echo "Packages installed successfully!"
