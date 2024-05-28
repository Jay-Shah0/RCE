package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
)

func authorization(w http.ResponseWriter, r *http.Request) { 
	EnableCORS(w, []string{"GET"})

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return	
	}

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Authorization header missing", http.StatusUnauthorized)
		return
	}

	// Split the header to get the Bearer token
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		http.Error(w, "Invalid authorization header format", http.StatusUnauthorized)
		return
	}
	tokenStr := parts[1]

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

	response := map[string]interface{}{"userId": user.MongoUserId}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}