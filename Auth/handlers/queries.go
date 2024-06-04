package handlers

import (
	"auth/db"
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
  ID    string  `json:"id"`
  MongoUserId string `json:"mongoUserId"`
  Email string `json:"email"`
  Username string `json:"username"`
  Password string `json:"password"`
  RefreshToken string `json:"token"`
}

type Repl struct {
	Name string 
	Template string 
	IsPublic bool 
    UpdatedAt time.Time 
}

var Mongodb = connectMongoDB()
var sqldb = connectPrismaDB()


var	mongoDB = Mongodb.Database("RCE")
var	mongoCollection = mongoDB.Collection("users")

func AddUser(user User) (string, error) {
    ctx := context.Background()

    // Check if the user already exists by ID if provided
    existingUserByID, err := sqldb.User.FindUnique(
        db.User.ID.Equals(user.ID),
    ).Exec(ctx)
    if err != nil && err != db.ErrNotFound {
        return "", fmt.Errorf("failed to check if user exists by ID: %v", err)
    }

    // If the user already exists, return the existing ID
    if existingUserByID != nil{
        fmt.Println("User already exists!")
        return existingUserByID.ID, nil
    }

    // Creating User in MongoDB
    mongoUser := bson.M{
        "sqlUserId": user.ID,
    }
    result, err := mongoCollection.InsertOne(ctx, mongoUser)
    if err != nil {
        return "", fmt.Errorf("failed to insert user: %v", err)
    }

    // Extract the MongoDB user ID and update the user
    user.MongoUserId = result.InsertedID.(primitive.ObjectID).Hex()

    // Creating user in SQLDB using Prisma client
    createdUser, err := sqldb.User.CreateOne(
        db.User.Mongouserid.Set(user.MongoUserId),
        db.User.Username.Set(user.Username),
        db.User.Email.Set(user.Email),
		db.User.CreatedAt.Set(time.Now()),
		db.User.UpdatedAt.Set(time.Now()),
		db.User.ID.Set(user.ID),
        db.User.Password.Set(user.Password),
        db.User.Token.Set(user.RefreshToken),
    ).Exec(ctx)
    if err != nil {
        return "", fmt.Errorf("failed to insert user: %v", err)
    }

    fmt.Println("User added successfully!")
    return createdUser.ID, nil
}

func UpdateUser(user User) (User, error) {
    ctx := context.Background()

    // Retrieve the existing user from the database
    existingUser, err := sqldb.User.FindUnique(
        db.User.ID.Equals(user.ID),
    ).Exec(ctx)
    if err != nil {
        return User{}, fmt.Errorf("failed to find existing user: %v", err)
    }
updatedUser := User{
        ID:           existingUser.ID,
        MongoUserId:  existingUser.Mongouserid,
        Email:        existingUser.Email,
        Username:     existingUser.Username,
    }

    // Handle the password and token fields properly
    existingPassword, _ := existingUser.Password()
    existingToken, _ := existingUser.Token()

    // Update only the non-empty fields from the user input
    if user.Username != "" {
        updatedUser.Username = user.Username
    }
    if user.Password != "" {
        updatedUser.Password = user.Password
    } else {
        updatedUser.Password = existingPassword
    }
    if user.RefreshToken != "" {
        updatedUser.RefreshToken = user.RefreshToken
    } else {
        updatedUser.RefreshToken = existingToken
    }

    // Update the user in the database using UpdateOne
	 _, err = sqldb.User.FindMany(
        db.User.ID.Equals(user.ID),
    ).Update(
		db.User.Username.Set(updatedUser.Username),
        db.User.Password.Set(updatedUser.Password),
        db.User.Token.Set(updatedUser.RefreshToken),
        db.User.UpdatedAt.Set(time.Now()),
	).Exec(ctx)

    if err != nil {
        return User{}, fmt.Errorf("failed to update user: %v", err)
    }

    fmt.Println("User updated successfully!")

    return updatedUser,nil
}

func getUserFromDB(username string) (User, error) {
    var user User

	ctx := context.Background()

    // Find the user by username using Prisma
    foundUser, err := sqldb.User.FindFirst(
        db.User.Username.Equals(username),
    ).Exec(ctx)
    if err != nil {
        return user, err
    }

    // Map the Prisma user to the custom User struct
    user.ID = foundUser.ID
    user.Email = foundUser.Email
    user.Username = foundUser.Username
    user.Password,_ = foundUser.Password()
    user.MongoUserId = foundUser.Mongouserid
    user.RefreshToken,_ = foundUser.Token()

    return user, nil
}


func getUserDataFromDB(username string) (User, []Repl, error) {
    var user User
    var repls []Repl

    ctx := context.Background()

    // Find the user by username using Prisma
    foundUser, err := sqldb.User.FindFirst(
        db.User.Username.Equals(username),
    ).Exec(ctx)
    if err != nil {
        return user, repls, fmt.Errorf("error fetching user data: %w", err)
    }

    // Map the Prisma user to the custom User struct
    user.ID = foundUser.ID
    user.Email = foundUser.Email
    user.Username = foundUser.Username
    user.Password, _ = foundUser.Password()
    user.MongoUserId = foundUser.Mongouserid
    user.RefreshToken, _ = foundUser.Token()

    // Find the user's repls using Prisma
    foundRepls, err := sqldb.Repl.FindMany(
        db.Repl.Userid.Equals(foundUser.ID),
    ).Exec(ctx)
    if err != nil {
        return user, repls, fmt.Errorf("error querying user's repls: %w", err)
    }

    // Map the Prisma repls to the custom Repl struct
    for _, foundRepl := range foundRepls {
        repl := Repl{
            Name:      foundRepl.Replname,
            Template:  foundRepl.Repltemplate,
            IsPublic:  foundRepl.Ispublic,
            UpdatedAt: foundRepl.UpdatedAt,
        }
        repls = append(repls, repl)
    }

    return user, repls, nil
}
