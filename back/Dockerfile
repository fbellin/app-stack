FROM hayd/alpine-deno:1.6.1
RUN deno upgrade
RUN deno install -qAf --unstable https://raw.githubusercontent.com/denosaurs/denon/main/denon.ts
EXPOSE 8080/tcp
ENV PORT=8080
