package main

import (
	"auth/handlers"
	"log"
	"net/http"
)

func main() {

    server := &http.Server{
        Addr:    ":3000",
        Handler: handlers.New(),
    }

    log.Printf("Starting HTTP Server. Listening at %q", server.Addr)
    if err := server.ListenAndServe(); err != http.ErrServerClosed {
        log.Printf("%v", err)
    } else {
        log.Println("Server closed!")
    }
}
