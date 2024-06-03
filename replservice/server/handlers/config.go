package handlers

import (
	"context"
	"log"
	"net/http"
	"os"
	"replService/db"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

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

func connectPrismaDB() (*db.PrismaClient) {

	// ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	// defer cancel()

	prismaClient := db.NewClient()
	err := prismaClient.Connect()
	if err != nil {
		panic(err)
	}

	log.Println("Connected to Prisma DB!")
	return prismaClient
}

func EnableCORS(w http.ResponseWriter, allowedMethods []string) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", strings.Join(allowedMethods, ", "))
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
}





