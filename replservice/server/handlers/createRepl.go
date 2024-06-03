	package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
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

	err = json.NewEncoder(w).Encode(map[string]Repl{"repldata": ReplData})
	
	if err != nil {
    fmt.Fprintf(w, "Error encoding response: %v", err)
    w.WriteHeader(http.StatusInternalServerError)
    return
  	}

}