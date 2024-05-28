package handlers

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Repl struct {
	OwnerID string `json:"ownerId"`
	ReplName    string `json:"replName"`
	ReplTempale string `json:"replTemplate"`
}


var Mongodb = connectMongoDB()

var	mongoDB = Mongodb.Database("RCE")
var	mongoCollection = mongoDB.Collection("repl")

func CreateRepl(repl Repl) (Repl,error) {

	Owner_objectID, err := primitive.ObjectIDFromHex(repl.OwnerID)

	if err != nil {
		return Repl{}, fmt.Errorf("failed to make objectId of Owner: %v", err)
	}
	
	mongoRepl := bson.M{
		"ownerID":Owner_objectID ,
		"replName":repl.ReplName ,
		"replTemplete":repl.ReplTempale ,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    _, err = mongoCollection.InsertOne(ctx, mongoRepl)
    if err != nil {
		return Repl{}, fmt.Errorf("failed to insert user: %v", err)
	}
	
	return repl,nil

}