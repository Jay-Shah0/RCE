package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"
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

    user, repls, err := getUserDataFromDB(username)
    if err != nil {
        if err == sql.ErrNoRows {
            http.Error(w, "User not found", http.StatusNotFound)
        } else {
            fmt.Print(err)
            http.Error(w, "Internal server error", http.StatusInternalServerError)
        }
        return
    }

    var replsSlice []map[string]interface{}

	// Populate the slice with Repl objects
	for _, repl := range repls {
		replsSlice = append(replsSlice, map[string]interface{}{
            "id": repl.Id,
			"replName":      repl.Name,
			"replTemplate":  repl.Template,
			"isPublic":  repl.IsPublic,
            "updatedAt": howOld(repl.UpdatedAt),
		})
	}

	response := map[string]interface{}{
    "user": map[string]string{
		"email":    user.Email,
		"username": user.Username,
		},
    "repls":  replsSlice,
  	}

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}


func howOld(entryTime time.Time) string {
	now := time.Now()
	duration := now.Sub(entryTime);
    hours := int(duration.Hours())

    if hours <= 2 {
        return "just now"
    }

	days := int(hours / 24)

	if days <= 7 {
		if days == 0 {
			return "last day"
		}
		return fmt.Sprintf("%d days ago", days)
	}

	weeks := int(days / 7)
	return fmt.Sprintf("%d weeks ago", weeks)
}
