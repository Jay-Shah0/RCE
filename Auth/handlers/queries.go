package handlers

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	_ "github.com/lib/pq"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
  ID    string  `json:"id"`
  Email string `json:"email"`
  Username string `json:"username"`
  Password string `json:"password"`
  MongoUserId string `json:"mongoUserId"`
  RefreshToken string `json:"token"`
}

var	db = connectSQLDB()

var Mongodb = connectMongoDB()

var	mongoDB = Mongodb.Database("RCE")
var	mongoCollection = mongoDB.Collection("users")

func AddUser( user User ) (string, error) {
	var existingID string
	var query string

	// Check if the user already exists by ID if provided
	if user.ID != "" {
		query = `SELECT id FROM "User" WHERE id = $1`
		err := db.QueryRow(query, user.ID).Scan(&existingID)
		if err != nil && err != sql.ErrNoRows {
			return "", fmt.Errorf("failed to check if user exists by ID: %v", err)
		}
	} else {
		// Check if the user already exists by email
		query = `SELECT id FROM "User" WHERE email = $1`
		err := db.QueryRow(query, user.Email).Scan(&existingID)
		if err != nil && err != sql.ErrNoRows {
			return "", fmt.Errorf("failed to check if user exists by email: %v", err)
		}
	}

	// If the user already exists, return the existing ID
	if existingID != "" {
		fmt.Println("User already exists!")
		return existingID, nil
	}

	//creating User in mongodb
	
	mongoUser := bson.M{
		"sqlUserId": user.ID,
	}

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    result, err := mongoCollection.InsertOne(ctx, mongoUser)
    if err != nil {
		return "", fmt.Errorf("failed to insert user: %v", err)
	}

    // Extract the MongoDB user ID and update the user
	user.MongoUserId = result.InsertedID.(primitive.ObjectID).Hex()

	// Creating user in SQLdb
	query = `INSERT INTO "User" (id, email, username, password, mongouserid, token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`
	err = db.QueryRow(query, user.ID, user.Email, user.Username, user.Password, user.MongoUserId, user.RefreshToken).Scan(&user.ID)
	if err != nil {
		return "", fmt.Errorf("failed to insert user: %v", err)
	}

	fmt.Println("User added successfully!")
	return user.ID, nil
}

func UpdateUser( user User) (User, error) {
	var existingUser User
	var mongoUserID string

	// Retrieve the existing user
	err := db.QueryRow("SELECT id, email, username, password, mongouserid, token FROM \"User\" WHERE id = $1", user.ID).Scan(&existingUser.ID,&existingUser.Email, &existingUser.Username,&existingUser.Password,&mongoUserID,&existingUser.RefreshToken)
	if err == sql.ErrNoRows {
		return User{}, fmt.Errorf("user with id %s not found", user.ID)
	}
	
	// Update the email, username, password, and refresh token if provided
	if user.Email != "" {
		existingUser.Email = user.Email
	}
	if user.Username != "" {
		existingUser.Username = user.Username
	}
	if user.Password != "" {
		existingUser.Password = user.Password
	}
	if user.RefreshToken != "" {
		existingUser.RefreshToken = user.RefreshToken
	}

	objectID, err := primitive.ObjectIDFromHex(mongoUserID)
	if err != nil {
		return User{}, fmt.Errorf("failed to convert to ObjectID: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

	filter := bson.M{"_id": objectID}

	update := bson.M{"$set": bson.M{"username": existingUser.Username}}

	_, err = mongoCollection.UpdateOne(ctx, filter, update)
	if err != nil {
		return User{}, fmt.Errorf("failed to update username: %v", err)
	}

	// Prepare the update statement with placeholders
	stmt, err := db.Prepare(`UPDATE "User" SET email = $1, username = $2, password = $3, "token" = $4 WHERE id = $5`)
	if err != nil {
		return User{}, fmt.Errorf("failed to prepare update statement: %v", err)
	}
	defer stmt.Close() // Close the prepared statement when the function exits

	// Execute the update statement
	_, err = stmt.Exec(existingUser.Email, existingUser.Username, existingUser.Password, existingUser.RefreshToken, user.ID)
	if err != nil {
		return User{}, fmt.Errorf("failed to update user: %v", err)
	}

	fmt.Println("User updated successfully!")

	return existingUser, nil
}

func getUserFromDB(username string) (User, error) {
    var user User
    query := `SELECT id, email, username, password, MongoUserId, token FROM "User" WHERE username = $1`
    err := db.QueryRow(query, username).Scan(&user.ID, &user.Email, &user.Username, &user.Password, &user.MongoUserId, &user.RefreshToken)
    if err != nil {
        return user, err
    }
    return user, nil
}


