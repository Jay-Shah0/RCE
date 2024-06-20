package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
)



func deleteReplHandler(w http.ResponseWriter, r *http.Request) {
	var repl Repl
	err := json.NewDecoder(r.Body).Decode(&repl)
	if err != nil {
		http.Error(w, "Error decoding request body", http.StatusBadRequest)
		return
	}

	err = DeleteRepl(repl)
	if err != nil {
		fmt.Print(err)
		http.Error(w, "Error deleting Repl from database", http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(map[string]Repl{"deletedrepl":repl })
	if err != nil {
    fmt.Fprintf(w, "Error encoding response: %v", err)
    w.WriteHeader(http.StatusInternalServerError)
    return
  	}
}

