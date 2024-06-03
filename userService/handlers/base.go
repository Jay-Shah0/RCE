package handlers

import (
	"net/http"
)

func New() http.Handler {
	mux := http.NewServeMux()
	// mux.HandleFunc("/getdata", getUserHandler)
	return mux
}