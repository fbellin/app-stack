FROM hayd/alpine-deno:1.6.1
RUN deno upgrade
RUN deno install -qAf --unstable https://raw.githubusercontent.com/denosaurs/denon/main/denon.ts
WORKDIR /app
COPY src /app/src/
EXPOSE 8080/tcp
ENV PORT=8080
ENTRYPOINT ["deno", "run", "--allow-net", "--allow-env", "/app/src/index.js"]
