// @ts-ignore
import server from '../dist/server.cjs';

const app = server?.default || server;

export default function handler(req: any, res: any) {
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
}
