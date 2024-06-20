package handlers

import (
	"encoding/json"
	"net/http"
)



func deleteReplHandler(w http.ResponseWriter, r *http.Request) {
	var repl Repl
	err := json.NewDecoder(r.Body).Decode(&repl)
	if err != nil {
		http.Error(w, "Error decoding request body", http.StatusBadRequest)
		return
	}

	err := DeleteRepl(repl)


}

