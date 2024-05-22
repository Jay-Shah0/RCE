package handlers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var jwtKey = []byte("Jay")

type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

func initGoogleOAuthConfig() (oauth2.Config) {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
		panic(err)
	}
	googleOauthConfig := oauth2.Config{
		RedirectURL:  "http://localhost:3000/auth/google/callback",
		ClientID:     os.Getenv("GOOGLE_OAUTH_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_OAUTH_CLIENT_SECRET"),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
		Endpoint:     google.Endpoint,
	}

	return googleOauthConfig
}

func connectToDB() (*sql.DB) {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
		panic(err)
	}
	connectionString := os.Getenv("DATABASE_URL")

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

func EnableCORS(w http.ResponseWriter, allowedMethods []string) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", strings.Join(allowedMethods, ", "))
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
}

func generateToken(username string, expirationTime time.Time) (string, error) {
	claims := &Claims{
		Username: username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}

func decodeToken(tokenStr string) (string, error) {
    claims := &Claims{}
    token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
        return jwtKey, nil
    })
    if err != nil {
        return "", err
    }
    if !token.Valid {
        return "", fmt.Errorf("invalid token")
    }
    return claims.Username, nil
}




