# Sketchbook (Storybook) deployment


Every push to `main` builds this repo's Storybook and deploys it to
**https://sketchbook.chaos-ops.de** — a live, always-current reference for
every token/primitive/web component in this package, gated behind the same
authelia login as `logs.chaos-ops.de` (it's a dev tool, not customer-facing).
This is independent of the npm package release above — the sketchbook
tracks `main`, not tagged versions.

`.github/workflows/deploy-sketchbook.yml` builds `Dockerfile` (which runs
`pnpm run build-storybook` and serves the static output via nginx), pushes
it to `ghcr.io/<owner>/chaosops-sketchbook`, then SSHes into the server and
runs `docker compose up -d` against `docker-compose.yml` in this repo.

**One-time setup this repo needs** (this is a separate GitHub repo from
`ChaosOps`, so none of this is inherited even though the values may be the
same):

- Repo secrets: `PROD_HOST`, `SERVER_USER`, `SSH_PRIVATE_KEY` (same server
  as the rest of the stack).
- Repo variable: `DEPLOY_DIR_SKETCHBOOK` — a directory on that server
  containing a copy of this repo's `docker-compose.yml` (nothing else is
  needed there; the sketchbook has no database/API dependency).
- DNS: an A/CNAME record for `sketchbook.chaos-ops.de` pointing at the same
  host as `chaos-ops.de`.
- Confirm `authelia-chaos@docker` is the correct Traefik middleware name on
  that host (copied from the `dozzle` service in `ChaosOps/docker-compose.yml`).

To deploy manually (e.g. after setup, or to force a rebuild), trigger
`Deploy Sketchbook` via `workflow_dispatch` in the Actions tab.
