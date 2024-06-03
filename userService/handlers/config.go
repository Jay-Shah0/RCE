package handlers

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func connectSQLDB() (*sql.DB) {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
		panic(err)
	}
	connectionString := os.Getenv("SOL_DATABASE_URL")

	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		panic(err)
	}
	
	if err := db.Ping(); err != nil {
		panic(err)
	}
	
	fmt.Println("Connected to database successfully!")
	return db
}

func connectMongoDB() (*mongo.Client) {

	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
		panic(err)
	}

	connectionString := os.Getenv("Mongo_Database_URL")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Connect to MongoDB
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(connectionString))
	if err != nil {
		panic(err)
	}

	// Ping the MongoDB server to verify connection
	err = client.Ping(ctx, nil)
	if err != nil {
		panic(err)
	}

	log.Println("Connected to MongoDB!")
	return client
}

func EnableCORS(w http.ResponseWriter, allowedMethods []string) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", strings.Join(allowedMethods, ", "))
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
}





