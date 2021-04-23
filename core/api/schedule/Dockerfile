FROM golang:alpine AS builder
WORKDIR /app
COPY . ./
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags '-extldflags "-static"' -o main .

FROM scratch
WORKDIR /app
COPY --from=builder /app/main . 
CMD ["./main"]
