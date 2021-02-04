FROM hayd/alpine-deno:1.6.1
RUN deno upgrade
RUN deno install -qAf --unstable https://raw.githubusercontent.com/denosaurs/denon/main/denon.ts
WORKDIR /app
COPY index.js /app/index.js
EXPOSE 8000/tcp
ENTRYPOINT ["deno", "run", "--allow-net", "index.js"]
