package container

import (
	"fmt"
	"log"
	"os/exec"
)

func StopWorker(replID string) error {
	// Docker command to stop the worker container with the specified replID
	stopCmd := exec.Command("docker", "stop", fmt.Sprintf("worker-%s", replID))

	// Run the command and capture the output
	stopOutput, stopErr := stopCmd.CombinedOutput()
	if stopErr != nil {
		return fmt.Errorf("failed to stop worker container: %v, output: %s", stopErr, string(stopOutput))
	}

	// Docker command to remove the worker container with the specified replID
	rmCmd := exec.Command("docker", "rm", fmt.Sprintf("worker-%s", replID))

	// Run the command and capture the output
	rmOutput, rmErr := rmCmd.CombinedOutput()
	if rmErr != nil {
		return fmt.Errorf("failed to remove worker container: %v, output: %s", rmErr, string(rmOutput))
	}

	// Print the success message
	log.Printf("Stopped and removed worker container with ID: worker-%s", replID)
	return nil
}