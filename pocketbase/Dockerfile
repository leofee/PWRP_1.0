FROM alpine:latest AS builder

ARG PB_VERSION=0.38.2

RUN apk add --no-cache wget unzip

RUN ARCH=$(uname -m) && \
    case "$ARCH" in \
        x86_64)  ARCH=amd64 ;; \
        aarch64) ARCH=arm64 ;; \
        armv7l)  ARCH=armv7 ;; \
    esac && \
    wget -q https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${ARCH}.zip \
    -O /tmp/pb.zip && \
    unzip /tmp/pb.zip -d /pb/ && \
    rm /tmp/pb.zip

FROM alpine:latest
RUN apk add --no-cache ca-certificates
COPY --from=builder /pb/pocketbase /pb/pocketbase
EXPOSE 8090
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb_data", "--migrationsDir=/pb_migrations", "--hooksDir=/pb_hooks"]
