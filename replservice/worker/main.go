package main

import (
	"bytes"
	"encoding/json"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/gorilla/websocket"
)

type TerminalSession struct {
	curDir string
	replID string
	ws     *websocket.Conn
}

type Event struct {
	Output     string `json:"output"`
	CurrentDir string `json:"currentDir"`
}

type InitialEvent struct {
    ReplID string `json:"replID"`
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
			log.Printf("cd: %s: No such file or directory\n", newDir)
		}
	}

	currentDir := session.curDir
	output := strings.TrimRight(stdout.String(), "\n") + strings.TrimRight(stderr.String(), "\n")

	if cmd == "ls" || strings.HasPrefix(cmd, "ls ") {
		lines := strings.Split(output, "\n")
		output = strings.Join(lines, "  ")
	}

	return output, currentDir
}

func (session *TerminalSession) sendInitialEvent(event InitialEvent) {
	eventBytes, err := json.Marshal(event)
	if err != nil {
		log.Printf("Error marshalling event to JSON: %v", err)
		return
	}

	err = session.ws.WriteMessage(websocket.TextMessage, eventBytes)
	if err != nil {
		log.Printf("Error sending Initial message: %v", err)
	}
}

func (session *TerminalSession) sendEvent(event Event) {
	eventBytes, err := json.Marshal(event)
	if err != nil {
		log.Printf("Error marshalling event to JSON: %v", err)
		return
	}

	err = session.ws.WriteMessage(websocket.TextMessage, eventBytes)
	if err != nil {
		log.Printf("Error sending message: %v", err)
	}
}

func main() {
	replID := os.Getenv("REPL_ID")
	if replID == "" {
		log.Printf("REPL_ID environment variable is not set")
		replID = "1"
	}
	wsURL := "ws://socket-server:8099/worker"

	ws, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		log.Fatalf("Failed to connect to WebSocket server: %v", err)
	}
	defer ws.Close()

	session := &TerminalSession{curDir: "/", replID: replID, ws: ws}

	initialEvent := InitialEvent{ReplID: replID}
	session.sendInitialEvent(initialEvent)

	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			log.Printf("Error reading message: %v", err)
			break
		}

		cmd := string(msg)

		log.Printf("Received command for replID %s: %s", replID, cmd )
		output, currentDir := session.executeCommand(cmd)

		responseEvent := Event{
			Output:     output,
			CurrentDir: currentDir,
		}

		session.sendEvent(responseEvent)
	}
}
