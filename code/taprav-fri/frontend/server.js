const { createServer } = require('https');
const { readFileSync } = require('fs');
const next = require('next');

const port = process.env.PORT || 3000;
const app = next({ dev: false });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: readFileSync('/etc/ssl/localcerts/nextjs.key'),
  cert: readFileSync('/etc/ssl/localcerts/nextjs.crt')
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    handle(req, res);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`Next.js HTTPS server running on https://localhost:${port}`);
  });
});
