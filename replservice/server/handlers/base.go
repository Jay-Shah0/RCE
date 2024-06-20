package handlers

import (
	"net/http"
)

func New() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/create", createReplHandler)
	mux.HandleFunc("/delete", deleteReplHandler)

	return mux
}