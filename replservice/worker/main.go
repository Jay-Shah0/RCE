package main

import (
	"encoding/json"
	"log"
	"os"
	"os/exec"
	"sync"

	"github.com/creack/pty"
	"github.com/gorilla/websocket"
)

type InitialEvent struct {
    ReplID string `json:"replID"`
}

type Event struct {
	Event string `json:"event"`
	Data json.RawMessage `json:"data"`
}

type TerminalEvent struct {
	TermID string `json:"termId"`
	Action string `json:"action"`
	Cmd string `json:"cmd"`
}

type TerminalInstance struct {
	Cmd  *exec.Cmd
	Pty  *os.File
}

var terminals = make(map[string]*TerminalInstance)
var mu sync.Mutex


func main() {
	replID := os.Getenv("REPL_ID")
	if replID == "" {
		log.Printf("REPL_ID environment variable is not set")
		replID = "1"
	}
	wsURL := "ws://socket-server:8099/worker"
    initialEvent := InitialEvent{ReplID: replID}

	ws, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		log.Fatalf("Failed to connect to WebSocket server: %v", err)
	}
	defer ws.Close()

    sendInitialEvent( ws,initialEvent)

	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			log.Printf("Error reading message: %v", err)
			break
		}
		
		var message Event
		if err = json.Unmarshal(msg, &message); err != nil {
			log.Println("Unmarshal error:", err)
		}

		if message.Event == "term"{
			var terminalEvent TerminalEvent
			if err = json.Unmarshal(message.Data, &terminalEvent); err != nil {
				log.Println("Unmarshal error:", err)
				continue
			}
			err = terminalHandler(ws, terminalEvent)	
		}
	}
}

func terminalHandler(ws *websocket.Conn, event TerminalEvent) (err error) {
	mu.Lock()
	defer mu.Unlock()

	instance, exists := terminals[event.TermID]

	switch event.Action {
	case "start":
		if !exists {
			cmd := exec.Command("bash")
			ptmx, err := pty.Start(cmd)
			if err != nil {
				log.Println("Error starting pty:", err)
				return err
			}

			terminals[event.TermID] = &TerminalInstance{
				Cmd: cmd,
				Pty: ptmx,
			}

			// Goroutine to read from the terminal and send data to WebSocket
			go func(termID string) {
				buf := make([]byte, 1024)
				for {
					n, err := ptmx.Read(buf)
					if err != nil {
						log.Println("Error reading from pty:", err)
						break
					}
					message := map[string]string{
						"event": "term",
						"id": termID,
						"output": string(buf[:n]),
					}
					msg, _ := json.Marshal(message)
					if err := ws.WriteMessage(websocket.TextMessage, msg); err != nil {
						log.Println("Error writing to websocket:", err)
						break
					}
				}
			}(event.TermID)
		}
	case "cmd":
		if exists {
			if _, err := instance.Pty.Write([]byte(event.Cmd)); err != nil {
				log.Println("Error writing to pty:", err)
				return err
			}
		}
	case "close":
		if exists {
			if err := instance.Cmd.Process.Kill(); err != nil {
				log.Println("Error killing process:", err)
				return err
			}
			if err := instance.Pty.Close(); err != nil {
				log.Println("Error closing pty:", err)
				return err
			}
			delete(terminals, event.TermID)
		}
	default:
		log.Println("Unknown action:", event.Action)
	}
	return nil
}



func sendInitialEvent( ws *websocket.Conn,event InitialEvent) {
	eventBytes, err := json.Marshal(event)
	if err != nil {
		log.Printf("Error marshalling event to JSON: %v", err)
		return
	}

	err = ws.WriteMessage(websocket.TextMessage, eventBytes)
	if err != nil {
		log.Printf("Error sending Initial message: %v", err)
	}
}



