package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os/exec"
)

func createReplHandler(w http.ResponseWriter, r *http.Request) {
	var repl Repl
	err := json.NewDecoder(r.Body).Decode(&repl)
	if err != nil {
		http.Error(w, "Error decoding request body", http.StatusBadRequest)
		return
	}
	

	// Insert project data into MongoDB
	ReplData,err := CreateRepl(repl)
	if err != nil {
		fmt.Print(err)
		http.Error(w, "Error inserting Repl into database", http.StatusInternalServerError)
		return
	}

	err = startWorkerContainer(ReplData.MongoReplId)
	if err != nil {
		http.Error(w, "Error decoding request body", http.StatusBadRequest)
		return
	}

	err = json.NewEncoder(w).Encode(map[string]Repl{"repldata": ReplData})
	
	if err != nil {
    fmt.Fprintf(w, "Error encoding response: %v", err)
    w.WriteHeader(http.StatusInternalServerError)
    return
  	}

}

func startWorkerContainer(replID string) error {
	// Docker command to start a new worker container with the specified replID
	cmd := exec.Command("docker", "run", "-d", "-e", fmt.Sprintf("REPL_ID=%s", replID), "worker-image")

	// Run the command and capture the output
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("failed to start worker container: %v, output: %s", err, string(output))
	}

	// Print the container ID
	fmt.Printf("Started worker container with ID: %s", string(output))
	return nil
}