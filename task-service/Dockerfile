FROM golang:1.19-alpine as builder

RUN apk add --no-cache git ca-certificates
ENV GONOSUMDB=github.com/hoangduonng/*

RUN mkdir /app
ADD . /app/
WORKDIR /app
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .

FROM alpine
WORKDIR /app/
COPY --from=builder /app/app .
COPY --from=builder /app/migrations ./migrations
ENTRYPOINT ["./app"]
