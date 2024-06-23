package container

import (
	"fmt"
	"log"
	"os/exec"
)

func  StartWorker(replID string) error {
	// Docker command to start a new worker container with the specified replID
	cmd := exec.Command("docker", "run", "-d", "--network=repl-network", "--name", fmt.Sprintf("worker-%s", replID), "-e", fmt.Sprintf("REPL_ID=%s", replID), "worker")

	// Run the command and capture the output
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("failed to start worker container: %v, output: %s", err, string(output))
	}

	// Print the container ID
	log.Printf("Started worker container with ID: %s", string(output))
	return nil
}