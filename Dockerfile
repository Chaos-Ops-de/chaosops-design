# syntax=docker/dockerfile:1
# Builds the "sketchbook" — the published Storybook build for this design
# system — and serves it as a static site. Not part of the product; a
# reference tool for development (see sketchbook.chaos-ops.de).
FROM node:22 AS builder

WORKDIR /usr/src/app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build-storybook

########## Production stage ##########
FROM nginx:alpine

COPY --from=builder /usr/src/app/storybook-static /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
