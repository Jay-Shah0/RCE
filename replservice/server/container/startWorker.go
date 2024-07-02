package container

import (
	"fmt"
	"log"
	"os/exec"
)

func  StartWorker(replID string) error {

    volumeName := fmt.Sprintf("venv-volume-%s", replID)
    containerName := fmt.Sprintf("worker-%s", replID)
    imageName := "jayshah259/python_worker:latest"

	// Docker command to start a new worker container with the specified replID
    // Create the Docker run command
    cmd := exec.Command("docker", "run", "-d",
        "--network=repl-network",
        "--name", containerName,
        "-e", fmt.Sprintf("REPL_ID=%s", replID),
        "-v", fmt.Sprintf("%s:/root/venv", volumeName),
        imageName,
    )

	// Run the command and capture the output
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("failed to start worker container: %v, output: %s", err, string(output))
	}

	// Print the container ID
	log.Printf("Started worker container with ID: %s", string(output))
	return nil
}