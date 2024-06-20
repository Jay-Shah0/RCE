package handlers

import (
	"encoding/json"
	"fmt"
	"log"
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
	
	ReplData,err := CreateRepl(repl)
	if err != nil {
		fmt.Print(err)
		http.Error(w, "Error inserting Repl into database", http.StatusInternalServerError)
		return
	}

	// err = startWorker(ReplData.MongoReplId)
	// if err != nil {
	// 	http.Error(w, "Error starting the repl worker", http.StatusInternalServerError)
	// 	return
	// }

	err = json.NewEncoder(w).Encode(map[string]Repl{"repldata": ReplData})
	
	if err != nil {
    fmt.Fprintf(w, "Error encoding response: %v", err)
    w.WriteHeader(http.StatusInternalServerError)
    return
  	}

}

func  startWorker(replID string) error {
	// Docker command to start a new worker container with the specified replID
	cmd := exec.Command("docker", "run", "-d", "--network=repl-network", "--name", fmt.Sprintf("worker-%s", replID), "-e", fmt.Sprintf("REPL_ID=%s", replID), "go-based-worker")

	// Run the command and capture the output
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("failed to start worker container: %v, output: %s", err, string(output))
	}

	// Print the container ID
	log.Printf("Started worker container with ID: %s", string(output))
	return nil
}