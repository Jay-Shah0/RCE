package handlers

import (
	"net/http"
)

func New() http.Handler {
	mux := http.NewServeMux()

	// OauthGoogle
	mux.HandleFunc("/auth/google/login", oauthGoogleLoginHandler)
	mux.HandleFunc("/auth/google/callback", oauthGoogleCallbackHandler)
	mux.HandleFunc("/user/update", updateUserHandler)
	mux.HandleFunc("/user/data", getUserHandler)
	return mux
}