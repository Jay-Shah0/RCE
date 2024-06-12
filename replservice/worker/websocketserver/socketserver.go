package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type TerminalSession struct {
	curDir string
}

type Event struct {
    Output   string `json:"output"`
    CurrentDir string `json:"currentDir"`
}

func (session *TerminalSession) executeCommand(cmd string) (string, string) {
	var stdout bytes.Buffer
	var stderr bytes.Buffer

	command := exec.Command("bash", "-c", cmd)
	command.Stdout = &stdout
	command.Stderr = &stderr
	command.Dir = session.curDir

	err := command.Run()
	if err != nil {
		log.Printf("Error executing command: %s", err)
	}

	if strings.HasPrefix(cmd, "cd ") {
		newDir := strings.TrimSpace(cmd[3:])
		if !filepath.IsAbs(newDir) {
			newDir = filepath.Join(session.curDir, newDir)
		}
		if _, err := os.Stat(newDir); err == nil {
			session.curDir = newDir
		} else {
			fmt.Fprintf(&stderr, "cd: %s: No such file or directory\n", newDir)
		}
	}

	currentDir := session.curDir
    output := strings.TrimRight(stdout.String(), "\n") + strings.TrimRight(stderr.String(), "\n");

	if cmd == "ls" || strings.HasPrefix(cmd, "ls ") {
		lines := strings.Split(output, "\n")
		output = strings.Join(lines, "  ")
	}

	return output, currentDir
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatalf("Failed to upgrade connection: %v", err)
		return
	}
	defer ws.Close()

	session := &TerminalSession{curDir: "/"}

	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			log.Printf("Error reading message: %v", err)
			break
		}

		log.Printf("Received command: %s", msg)

		output,currentDir := session.executeCommand(string(msg))

		event := Event{
        Output:   output,
        CurrentDir: currentDir,
    	}

		fmt.Print(output + currentDir)

		eventBytes, err := json.Marshal(event)
		if err != nil {
			log.Printf("Error marshalling event to JSON: %v", err)
			break
		}

		err = ws.WriteMessage(websocket.TextMessage, eventBytes)
		if err != nil {
			log.Printf("Error writing message: %v", err)
			break
		}
	}
}

func main() {
	http.HandleFunc("/ws", handleConnections)

	log.Println("WebSocket server starting on :8099")
	err := http.ListenAndServe(":8099", nil)
	if err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
