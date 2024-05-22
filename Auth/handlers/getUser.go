package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
)

func getUserHandler(w http.ResponseWriter, r *http.Request) {
    EnableCORS(w, []string{"GET"})

    if r.Method == http.MethodOptions {
        w.WriteHeader(http.StatusOK)
        return
    }

    if r.Method != http.MethodGet {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    tokenStr := r.Header.Get("Authorization")
    if tokenStr == "" {
        http.Error(w, "Authorization header missing", http.StatusUnauthorized)
        return
    }

    // Assuming the token is prefixed with "Bearer "
    tokenStr = strings.TrimPrefix(tokenStr, "Bearer ")

    username, err := decodeToken(tokenStr)
    if err != nil {
        http.Error(w, "Invalid token", http.StatusUnauthorized)
        return
    }

    user, err := getUserFromDB(username)
    if err != nil {
        if err == sql.ErrNoRows {
            http.Error(w, "User not found", http.StatusNotFound)
        } else {
            http.Error(w, "Internal server error", http.StatusInternalServerError)
        }
        return
    }

	response := map[string]interface{}{
    "user": map[string]string{
		"id":       user.ID,  
		"email":    user.Email,
		"username": user.Username,
		},
  	}

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}
