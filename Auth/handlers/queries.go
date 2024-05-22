package handlers

import (
	"database/sql"
	_"github.com/lib/pq"
	"fmt"
)

type User struct {
  ID    string  `json:"id"`
  Email string `json:"email"`
  Username string `json:"username"`
  Password string `json:"password"`
  RefreshToken string `json:"token"`
}

var	db = connectToDB()

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

	// Insert the new user
	query = `INSERT INTO "User" (id, email, username, password, "token") VALUES ($1, $2, $3, $4, $5) RETURNING id`
	err := db.QueryRow(query, user.ID, user.Email, user.Username, user.Password, user.RefreshToken).Scan(&user.ID)
	if err != nil {
		return "", fmt.Errorf("failed to insert user: %v", err)
	}

	fmt.Println("User added successfully!")
	return user.ID, nil
}

// Function to update a user in the database
func UpdateUser( user User) (User, error) {
	var existingUser User

	// Retrieve the existing user
	err := db.QueryRow("SELECT id, email, username, password, token FROM \"User\" WHERE id = $1", user.ID).Scan(&existingUser.ID, &existingUser.Email, &existingUser.Username, &existingUser.Password, &existingUser.RefreshToken)
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

	// Prepare the update statement with placeholders
	stmt, err := db.Prepare(`UPDATE "User" SET email = $1, username = $2, password = $3, "token" = $4 WHERE id = $5`)
	if err != nil {
		return User{}, fmt.Errorf("failed to prepare update statement: %v", err)
	}
	defer stmt.Close() // Close the prepared statement when the function exits

	// Execute the update statement
	_, err = stmt.Exec(existingUser.Email, existingUser.Username, existingUser.Password, existingUser.RefreshToken, existingUser.ID)
	if err != nil {
		return User{}, fmt.Errorf("failed to update user: %v", err)
	}

	fmt.Println("User updated successfully!")
	return existingUser, nil
}

func getUserFromDB(username string) (User, error) {
    var user User
    query := `SELECT id, email, username, password, "token" FROM "User" WHERE username = $1`
    err := db.QueryRow(query, username).Scan(&user.ID, &user.Email, &user.Username, &user.Password, &user.RefreshToken)
    if err != nil {
        return user, err
    }
    return user, nil
}


