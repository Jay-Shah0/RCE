package handlers

import (
	"net/http"
)

func New() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/create", createReplHandler)
	mux.HandleFunc("/delete", deleteReplHandler)
	mux.HandleFunc("/close", closeReplHandler)
	mux.HandleFunc("/open", openReplHandler)
	
	return mux
}