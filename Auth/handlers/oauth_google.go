package handlers

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"time"
)


var googleOauthConfig = initGoogleOAuthConfig()

const oauthGoogleUrlAPI = "https://www.googleapis.com/oauth2/v2/userinfo?access_token="

func oauthGoogleLoginHandler(w http.ResponseWriter, r *http.Request) {

	// Create oauthState cookie
	oauthState := generateStateOauthCookie(w)

	/*
	AuthCodeURL receive state that is a token to protect the user from CSRF attacks. You must always provide a non-empty string and
	validate that it matches the the state query parameter on your redirect callback.
	*/
	u := googleOauthConfig.AuthCodeURL(oauthState)
	http.Redirect(w, r, u, http.StatusTemporaryRedirect)
}

func oauthGoogleCallbackHandler(w http.ResponseWriter, r *http.Request) {
	// Read oauthState from Cookie
	oauthState, err := r.Cookie("oauthstate")
	if err != nil {
		log.Println("Error reading oauthState cookie:", err)
		http.Redirect(w, r, getFrontendURL(r), http.StatusTemporaryRedirect)
		return
	}

	if r.FormValue("state") != oauthState.Value {
		log.Println("Invalid oauth google state")
		http.Redirect(w, r, getFrontendURL(r), http.StatusTemporaryRedirect)
		return
	}

	data, err := getUserDataFromGoogle(r.FormValue("code"))
	if err != nil {
		log.Println("Error getting user data from Google:", err)
		http.Redirect(w, r, getFrontendURL(r), http.StatusTemporaryRedirect)
		return
	}

	userInfo := bytetomap(data)

	user,err := createUserFromMap(userInfo)

	if err != nil {
		log.Println("error making User type:", err)
		http.Redirect(w, r, getFrontendURL(r), http.StatusTemporaryRedirect)
		return
	}

	id,UserExist,err := AddUser(*user)
	if err != nil {
		log.Println("error inserting user in database:", err)
		http.Redirect(w, r, getFrontendURL(r), http.StatusTemporaryRedirect)
		return
	}

	if (UserExist) {
		username := id;

		accessTokenExpiration := time.Now().Add(24 * time.Hour)

		accessToken, err := generateToken(username, accessTokenExpiration)
		if err != nil {
			http.Error(w, "Failed to generate access token", http.StatusInternalServerError)
			return
		}

		cookie := &http.Cookie{
        Name:     "access_token",
        Value:    accessToken,
        Path:     "/",
    	}

		http.SetCookie(w, cookie)

		redirectURL := getFrontendURL(r)
		http.Redirect(w, r, redirectURL, http.StatusTemporaryRedirect)
	}else{
		redirectURL := getFrontendURL(r) + "User/user?id=" + url.QueryEscape(id)
		http.Redirect(w, r, redirectURL, http.StatusTemporaryRedirect)
	}
}

func generateStateOauthCookie(w http.ResponseWriter) string {
	var expiration = time.Now().Add(20 * time.Minute)

	b := make([]byte, 16)
	rand.Read(b)
	state := base64.URLEncoding.EncodeToString(b)
	cookie := http.Cookie{Name: "oauthstate", Value: state, Expires: expiration}
	http.SetCookie(w, &cookie)

	return state
}

func getUserDataFromGoogle(code string) ([]byte, error) {

	// Use code to get token and get user info from Google.
	token, err := googleOauthConfig.Exchange(context.Background(), code)

	if err != nil {
		return nil, fmt.Errorf("code exchange wrong: %s", err.Error())
	}

	response, err := http.Get(oauthGoogleUrlAPI + token.AccessToken)
	if err != nil {
		return nil, fmt.Errorf("failed getting user info: %s", err.Error())
	}

	defer response.Body.Close()
	contents, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("failed read response: %s", err.Error())
	}

	return contents, nil
}

func getFrontendURL(r *http.Request) string {
	referer := r.Header.Get("Referer")
	return referer
}

func bytetomap (data []byte) (map[string]interface{}){
	var datamap map[string]interface{}
	if err := json.Unmarshal(data, &datamap); err != nil {
		log.Println("Error parsing user data:", err)
	}
	return datamap
}

func createUserFromMap(userInfo map[string]interface{}) (*User, error) {
  // Type assertion to access ID and email (handle potential errors)
  id, ok := userInfo["id"].(string)
  if !ok {
    return nil, fmt.Errorf("missing or invalid ID in user info")
  }
  email, ok := userInfo["email"].(string)
  if !ok {
    return nil, fmt.Errorf("missing or invalid email in user info")
  }
  
  // Create a new User struct
  user := &User{ID: id, Email: email}
  return user, nil
}
