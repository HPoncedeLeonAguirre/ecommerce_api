const express = require("express");
const router = require("./routes/mainRouter");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const server = express();

const corsOptions = {
    origin: (origin, callback) => {
        // Permitir solicitudes desde localhost y desde herramientas como Insomnia o Thunder Client
        if (!origin || origin.startsWith('http://localhost')) {
            callback(null, true);
        } else {
            callback(new Error('No autorizado'));
        }
    },
    credentials: true, // Permite el uso de cookies
};

// Aplicar la configuración de CORS
server.use(cors(corsOptions));

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));

server.use("/", router);

server.use((err, req, res, next) => {
	const status = err.status || 500;
	const message = err.message || err;
	console.log(err);
	res.status(status).send(message);
});

module.exports = { server };