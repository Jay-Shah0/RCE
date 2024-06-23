package handlers

import (
	"context"
	"fmt"
	"replService/db"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Repl struct {
	ID          string `json:"id"`
	MongoReplId string `json:"mongoReplId"`
	OwnerSQLID  string `json:"ownersqlId"`
	OwnermongoId string `json:"ownermongoId"`
	ReplName    string `json:"replName"`
	ReplTempale string `json:"replTemplate"`
	IsPublic    bool   `json:"isPublic"`
	UpdatedAt time.Time `json:"updatedAt"`
}

var Mongodb = connectMongoDB()
var sqldb = connectPrismaDB()

var mongoDB = Mongodb.Database("RCE")
var mongoCollection = mongoDB.Collection("repl")

func CreateRepl(repl Repl) (Repl, error) {

	Owner_objectID, err := primitive.ObjectIDFromHex(repl.OwnermongoId)
	if err != nil {
		return Repl{}, fmt.Errorf("failed to make objectId of Owner: %v", err)
	}

	mongoRepl := bson.M{
		"ownerID":     Owner_objectID,
		"replName":    repl.ReplName,
		"replTemplate": repl.ReplTempale,
		"isPublic":    repl.IsPublic,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	replObjectId, err := mongoCollection.InsertOne(ctx, mongoRepl)
	if err != nil {
		return Repl{}, fmt.Errorf("failed to insert repl into MongoDB: %v", err)
	}

	repl.MongoReplId = replObjectId.InsertedID.(primitive.ObjectID).Hex()

	// Ensure correct types for Prisma's CreateOne method
	createdRepl, err := sqldb.Repl.CreateOne(
		db.Repl.Mongoreplid.Set(repl.MongoReplId),
		db.Repl.Replname.Set(repl.ReplName),
		db.Repl.Repltemplate.Set(repl.ReplTempale),
		db.Repl.Ispublic.Set(repl.IsPublic),
		db.Repl.Userid.Set(repl.OwnerSQLID),
		db.Repl.CreatedAt.Set(time.Now()),
		db.Repl.UpdatedAt.Set(time.Now()),
	).Exec(ctx)
	if err != nil {
		return Repl{}, fmt.Errorf("failed to insert repl into SQL: %v", err)
	}

	repl.UpdatedAt = createdRepl.UpdatedAt
	repl.ID = createdRepl.ID

	return repl, nil
}

func DeleteRepl(repl Repl) error {

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	deletedRepl, err := sqldb.Repl.FindUnique(
		db.Repl.ID.Equals(repl.ID),
	).Exec(ctx)
	if err != nil {
		return fmt.Errorf("failed to find repl from SQL: %v", err)
	}

	if (deletedRepl.Userid != repl.OwnerSQLID) {
		return fmt.Errorf("no such repl for the user: %v", err)
	}

	deletedRepl, err = sqldb.Repl.FindUnique(
		db.Repl.ID.Equals(repl.ID),
	).Delete().Exec(ctx)

	repl.MongoReplId = deletedRepl.Mongoreplid

	Repl_objectID, err := primitive.ObjectIDFromHex(repl.MongoReplId)
	if err != nil {
		return  fmt.Errorf("failed to make objectId of Repl: %v", err)
	}

	Owner_objectID, err := primitive.ObjectIDFromHex(repl.OwnermongoId)
	if err != nil {
		return fmt.Errorf("failed to make objectId of Owner: %v", err)
	}

	mongoRepl := bson.M{
		"_id":     Repl_objectID,
		"ownerID":     Owner_objectID,
	}

	ReplData,err := mongoCollection.DeleteOne(ctx,mongoRepl)

	if ReplData != nil {
		return nil
	}

	return fmt.Errorf("failed to delete the repl in mongo")
}

func VerifyUser(repl Repl) (bool, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	ReplData, err := sqldb.Repl.FindUnique(
		db.Repl.ID.Equals(repl.ID),
	).Exec(ctx)
	if err != nil {
		return false,fmt.Errorf("failed to find repl from SQL: %v", err)
	}

	if (ReplData.Userid != repl.OwnerSQLID) {
		return false,nil
	}

	return true,nil
}
