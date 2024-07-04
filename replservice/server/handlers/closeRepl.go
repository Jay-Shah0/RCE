package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"replService/container"
)

func closeReplHandler(w http.ResponseWriter, r *http.Request) {
	var repl Repl
	err := json.NewDecoder(r.Body).Decode(&repl)
	if err != nil {
		http.Error(w, "Error decoding request body", http.StatusBadRequest)
		return
	}

	_,isUser,err := VerifyUser(repl)
	
	if(!isUser){
		http.Error(w, "User not having the Repl", http.StatusConflict)
		return
	}

	err = container.StopWorker(repl.ID)
	if err != nil {
		fmt.Print(err)
		http.Error(w, "Error stoping Repl Worker", http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(map[string]Repl{"repldata": repl})
	if err != nil {
    fmt.Fprintf(w, "Error encoding response: %v", err)
    w.WriteHeader(http.StatusInternalServerError)
    return
  	}
}