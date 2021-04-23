package main

import (
	"fmt"
	"log"
	"net/http"
)

func hello(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, "hello")
}

func headers(w http.ResponseWriter, req *http.Request) {
	for name, headers := range req.Header {
		for _, h := range headers {
			fmt.Fprintf(w, "%v: %v\n", name, h)
		}
	}
}

func startServer(w http.ResponseWriter, req *http.Request) {
	fmt.Println("Starting server")
	fmt.Fprintf(w, "Server is running")
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/hello", hello)
	mux.HandleFunc("/headers", headers)

	s := &http.Server{
		Addr:    ":8000",
		Handler: mux,
	}
	log.Fatal(s.ListenAndServe())
}
