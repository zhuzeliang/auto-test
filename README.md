

### Launch

```sh
$ npm run dev
# Visit http://127.0.0.1:7300
```

## More Commands

```sh
# Build front-end assets
$ npm run build

# Run auto-test as production environment (You should run `build` first)
$ npm run start

# Run unit test
$ npm run test

# Test lint
$ npm run lint
```

## Deployment

> Please configure your configuration files before this step.

### PM2

We're recommending you to use [PM2](https://github.com/Unitech/pm2) as your
daemon process.

#### Install PM2 Globally

```sh
$ [sudo] npm install pm2 -g
```

#### Launch via PM2

> You should run `build` before this step.

```sh
$ NODE_ENV=production pm2 start app.js
```

