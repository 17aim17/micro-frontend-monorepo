# Micro frontends with Webpack Module Federation

Independent apps, built and deployed separately, composed at runtime in the browser by a host app ("container") that loads each remote's `remoteEntry.js`.

## Layout

| Folder | What it shows |
| --- | --- |
| [`vanilla-js/`](vanilla-js) | The mechanics with no framework: a container loading `products` and `cart` remotes, shared dependencies loaded once, and a `mount(el)` contract so a remote runs both standalone and inside the host. |
| [`react/`](react) | The same pattern with React: dev and prod webpack configs, remote URLs from the environment in production, and a GitHub Actions pipeline that builds the container and syncs it to S3. |

## Patterns used in both

- **Async boundary:** `index.js` only does `import('./bootstrap')`, so webpack can resolve shared modules before any app code runs.
- **Mount contract:** each remote exports `mount(el)` instead of rendering on load. In development it mounts itself into its own `index.html`, so it can be worked on without the host.
- **Shared dependencies:** listed in `ModuleFederationPlugin.shared`, so a library used by several remotes is downloaded once.

## Running locally

Each app is its own npm project. Start the remotes first, then the container.

```bash
# vanilla-js: products on :8081, cart on :8082, container on :8080
cd vanilla-js/products && npm install && npm start
cd vanilla-js/cart && npm install && npm start
cd vanilla-js/container && npm install && npm start

# react: marketing on :8081, container on :8080
cd react/marketing && npm install && npm start
cd react/container && npm install && npm start
```

Open http://localhost:8080.

## Deployment

`.github/workflows/container.yml` runs on pushes to `main` that touch `react/container/`. It builds the container and syncs `dist/` to an S3 bucket under `container/latest`. It needs these repository secrets: `AWS_S3_BUCKET_NAME`, `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

## Known issues

This is a learning project from 2023, kept as it was written.

- The deploy workflow has no secrets configured and sets `AWS_DEFAULT_REGION` to an empty string, so the S3 sync step fails.
- Only the container has a deploy workflow. There is none for `marketing`, and no CloudFront setup in front of the bucket.
- `react/auth` and `react/dashboard` (planned as a Vue remote) contain only a `package.json`, with no code yet.
- Dependencies are from 2020-2023 (React 17, Material UI v4, webpack-dev-server 3).
