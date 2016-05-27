
// configuration begein
function getConfig (rootPath) {
    return [];
}
// configuration end

(function () {
    var port = +process.argv[2] || 80,
        config,
        Path = require("path"),
        connect = require('connect'),
        morgan = require('morgan'),
        serveIndex = require('serve-index'),
        serveStatic = require('serve-static'),
        server = connect(),
        serverInstance,
        serveRoot = Path.resolve( process.argv[3] || __dirname );

    console.log("http-server root: " + serveRoot);
    console.log("http-server port: " + port);

    // comment below line if you dont want log
    server.use(morgan("dev"));

    config = getConfig(serveRoot);
    buildServerFromConfig( server, config );

    server
        .use( serveIndex(serveRoot) )
        .use( serveStatic(serveRoot) )
        ;

    serverInstance = server.listen(port);

})();

function buildServerFromConfig(server, config) {
    var connect = require('connect'),
        serveIndex = require('serve-index'),
        serveStatic = require('serve-static');

    function build( app, route, path ) {
        var protocal = path.split(":", 1)[0];

        switch (protocal) {

        case "redirect":
            path = path.substring( protocal.length +1 );
        case "http":
            app.use( route, redirect(path) );
            break;

        case "file":
            path = path.substring( protocal.length +1 );
            if (path[0] === "/") path = serveRoot + path;
            app.use( route, serveFile(path) );
            break;

        case "dir":
            path = path.substring( protocal.length +1 );
        default:
            if (path[0] === "/") path = serveRoot + path;
            app.use( route, serveIndex(path) );
            app.use( route, serveStatic(path) );
        }
    }

    for2(config, function( appRoute, cfg ) {
        var app = connect();
        server.use(appRoute, app);

        if ( typeof cfg === "string" ) {
            build( server, appRoute, cfg );
        }
        else {
            for2( cfg, build( app, route, path ) );
        }
    });

}

function for2 (list, fn, i) {
    for (i |= 0; i< list.length; i += 2) fn(list[i], list[i+1]);
}

function redirect(location, status) {
    return function (req, res, next) {
        if (req.url === "/") req.url = "";
        res.writeHead(status || 302, { Location: location + req.url});
        res.end();
    };
}

function serveFile(path) {
    var send = require("send");
    return function (req, res, next) {
        send(req, path).pipe(res);
    };
}

