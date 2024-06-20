package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type initialEvent struct {
    ReplID string `json:"replID"`
}

type WebSocketServer struct {
	clients map[string]*websocket.Conn
	workers map[string]*websocket.Conn
	mu      sync.Mutex
}

func NewWebSocketServer() *WebSocketServer {
	return &WebSocketServer{
		clients: make(map[string]*websocket.Conn),
		workers: make(map[string]*websocket.Conn),
	}
}

func (server *WebSocketServer) handleClientConnections(w http.ResponseWriter, r *http.Request) {
    // Upgrade the HTTP connection to a WebSocket connection
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Fatalf("Failed to upgrade connection: %v", err)
        return
    }
    defer ws.Close()

    // Read the first message to get the replID
    _, msg, err := ws.ReadMessage()
    if err != nil {
        log.Printf("Error reading initial message: %v", err)
        return
    }

    var initialEvent initialEvent
    err = json.Unmarshal(msg, &initialEvent)
    if err != nil || initialEvent.ReplID == "" {
        log.Printf("Error unmarshalling initial event or missing replID: %v", err)
        return
    }

    replID := initialEvent.ReplID

    // Store the WebSocket connection in the server's clients map
    server.mu.Lock()
    server.clients[replID] = ws
    server.mu.Unlock()

	log.Printf("WebSocket connection established for client with replID: %s", replID)

    // Listen for messages from the WebSocket connection
    for {
        _, msg, err := ws.ReadMessage()
        if err != nil {
            log.Printf("Error reading message: %v", err)
            break
        }
		log.Printf("Received message from worker for replID %s: %s", replID, msg)

        // Process the message using the stored replID
        server.routeToWorker(replID, msg)
    }

    // Clean up the client connection when done
    server.mu.Lock()
    if conn, ok := server.clients[replID]; ok && conn == ws {
        delete(server.clients, replID)
    }
    server.mu.Unlock()
    log.Printf("WebSocket connection closed for client with replID: %s.", replID)
}

func (server *WebSocketServer) handleWorkerConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatalf("Failed to upgrade connection: %v", err)
		return
	}
	defer ws.Close()

	var initialEvent initialEvent
	_, msg, err := ws.ReadMessage()
	if err != nil {
		log.Printf("Error reading replID: %v", err)
		return
	}

	err = json.Unmarshal(msg, &initialEvent)
	if err != nil {
		log.Printf("Error unmarshalling replID: %v", err)
		return
	}

	replID := initialEvent.ReplID
	server.mu.Lock()
	server.workers[replID] = ws
	server.mu.Unlock()

	log.Printf("WebSocket connection established for worker with replID: %s", replID)

	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			log.Printf("Error reading message: %v", err)
			break
		}

		log.Printf("Received message from worker for replID %s: %s", replID, msg)

		server.routeToClient(replID, msg)
	}

	server.mu.Lock()
	delete(server.workers, replID)
	server.mu.Unlock()
	log.Printf("WebSocket connection closed for worker with replID: %s", replID)
}

func (server *WebSocketServer) routeToWorker(replID string, msg []byte) {
	server.mu.Lock()
	defer server.mu.Unlock()

	if ws, ok := server.workers[replID]; ok {
		err := ws.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			log.Printf("Error routing message to worker with replID %s: %v", replID, err)
		}
	}
}

func (server *WebSocketServer) routeToClient(replID string, msg []byte) {
	server.mu.Lock()
	defer server.mu.Unlock()

	if ws, ok := server.clients[replID]; ok {
		err := ws.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			log.Printf("Error routing message to client with replID %s: %v", replID, err)
		}
	}
}



func main() {
	server := NewWebSocketServer()

	http.HandleFunc("/client", server.handleClientConnections)
	http.HandleFunc("/worker", server.handleWorkerConnections)

	log.Println("WebSocket server starting on :8099")
	err := http.ListenAndServe(":8099", nil)
	if err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}