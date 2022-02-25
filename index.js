import http from "http";

import axios from "axios";

import got from "got";

import ky from "ky-universal";

import {request} from "undici";
import fetch from "node-fetch"

import Benchmark from "benchmark";

const HOST = '0.0.0.0', PORT = '55709', PATH = '/basket-service/baskets/v2/basketId',
    PATH_POST = '/basket-service/baskets/v2/basketId', URL = `http://${HOST}:${PORT}${PATH}`,
    URL_POST = `http://${HOST}:${PORT}${PATH_POST}`, suite = new Benchmark.Suite;

suite.add('http.request\t', {
    defer: true,
    fn: (defer) => {
        http.request({path: PATH, host: HOST, port: PORT, headers: {'Content-Type': 'application/json'}}, (res) => {
            res.resume().on('end', () => defer.resolve());
        }).end();
    }
});

suite.add('axios\t\t', {
    defer: true,
    fn: (defer) => {
        axios.get(URL, {headers: {'Content-Type': 'application/json'}}).then(() => defer.resolve())
    }
});

suite.add('got\t\t', {
    defer: true,
    fn: (defer) => {
        got(URL, {method: "GET", headers: {'Content-Type': 'application/json'}}).then(() => defer.resolve())
    }
});

suite.add('node-fetch\t', {
    defer: true,
    fn: (defer) => {
        fetch(URL).then(() => defer.resolve())
    }
});

suite.add('undici\t\t', {
    defer: true,
    fn: (defer) => {
        request(URL).then(() => defer.resolve())
    }
});

suite.add('ky\t\t', {
    defer: true,
    fn: (defer) => {
        ky.get(URL).then(() => defer.resolve())
    }
});

suite.on('complete', function (defer) {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
});

suite.on('cycle', function (event) {
    console.log(String(event.target));
});

suite.run({async: true});
