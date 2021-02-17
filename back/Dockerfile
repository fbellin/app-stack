FROM hayd/alpine-deno:1.6.1
RUN deno upgrade
RUN deno install -qAf --unstable https://raw.githubusercontent.com/denosaurs/denon/main/denon.ts
WORKDIR /back
COPY src /back/src
EXPOSE 8080/tcp
ENV PORT=8080
ENTRYPOINT ["deno", "run", "--allow-net", "--allow-env", "/back/src/index.js"]
