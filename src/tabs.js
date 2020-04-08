import fs from 'fs'

export default function tabs(server) {

    var staticBasePath = 'src/views/';
    // Setup home page
    server.get('/', (req, res, next) => {
        fs.readFile(staticBasePath + 'hello.html', 'utf8', function(err, data) {
            if (err) throw err;
            res.send(data);
        });
    });

    // Setup the static tab
    server.get('/hello', (req, res, next) => {
        fs.readFile(staticBasePath + 'hello.html', 'utf8', function(err, data) {
            if (err) throw err;
            res.send(data);
        });
    });

    // Setup the configure tab, with first and second as content tabs
    server.get('/configure', (req, res, next) => {
        fs.readFile(staticBasePath + 'configure.html', 'utf8', function(err, data) {
            if (err) throw err;
            res.send(data);
        });
    });

    server.get('/first', (req, res, next) => {
        fs.readFile(staticBasePath + 'first.html', 'utf8', function(err, data) {
            if (err) throw err;
            res.send(data);
        });
    });

    server.get('/second', (req, res, next) => {
        fs.readFile(staticBasePath + 'second.html', 'utf8', function(err, data) {
            if (err) throw err;
            res.send(data);
        });
    });
}



