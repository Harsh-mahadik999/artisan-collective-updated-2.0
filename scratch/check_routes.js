import express from "express";
import { registerRoutes } from "./server/routes.js";
import { createServer } from "http";

const app = express();
const server = await registerRoutes(app);

function print(path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
  } else if (layer.method) {
    console.log('%s /%s',
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join('/'))
  }
}

function split(thing) {
  if (typeof thing === 'string') {
    return thing.split('/')
  } else if (thing.fast_slash || thing.fast_star) {
    return ''
  } else {
    var r = thing.toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '')
      .replace(/\\\//g, '/')
      .replace(/:[^\/]+/g, ':id') // simplify
      .split('^/')[1]
      .split('\/')[0]
    return r
  }
}

app._router.stack.forEach(print.bind(null, []))
process.exit(0);
