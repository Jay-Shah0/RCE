package handlers

import (
	"encoding/json"
	"net/http"
	"time"
)

func updateUserHandler(w http.ResponseWriter, r *http.Request) {
	// Enable CORS for all origins and only allow POST method
	EnableCORS(w, []string{"POST"})

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return	
	}

	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Generate access and refresh tokens
	accessTokenExpiration := time.Now().Add(24 * time.Hour)
	refreshTokenExpiration := time.Now().Add(7 * 24 * time.Hour)

	accessToken, err := generateToken(user.Username, accessTokenExpiration)
	if err != nil {
		http.Error(w, "Failed to generate access token", http.StatusInternalServerError)
		return
	}

	refreshToken, err := generateToken(user.Username, refreshTokenExpiration)
	if err != nil {
		http.Error(w, "Failed to generate refresh token", http.StatusInternalServerError)
		return
	}

	user.RefreshToken = refreshToken
	updatedUser, err := UpdateUser(user)
	if err != nil {
		http.Error(w, "Failed to save update user", http.StatusInternalServerError)
		return
	}

	// Set the refresh token as an HTTP-only cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Expires:  refreshTokenExpiration,
		HttpOnly: true,
		Path:     "/",
		Secure:   true, // Use secure flag for HTTPS
		SameSite: http.SameSiteStrictMode,
	})

	response := map[string]interface{}{
    "user": map[string]string{
		"access_token": accessToken,
		"id":       updatedUser.ID,  
		"email":    updatedUser.Email,
		"username": updatedUser.Username,
		},
  	}

	// Respond with the access token
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}