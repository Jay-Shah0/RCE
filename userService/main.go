package main

import (
	"log"
	"net/http"
	"os"
	"userService/handlers"

	"github.com/joho/godotenv"
)

func main() {

    err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
		panic(err)
	}

    port := os.Getenv("PORT")

    server := &http.Server{
        Addr:    port,
        Handler: handlers.New(),    
    }

    log.Printf("Starting HTTP Server. Listening at %q", server.Addr)
    if err := server.ListenAndServe(); err != http.ErrServerClosed {
        log.Printf("%v", err)
    } else {
        log.Println("Server closed!")
    }
}
