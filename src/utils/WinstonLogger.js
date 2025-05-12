import winston from "winston";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

//__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logDir = path.resolve(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
	return `${timestamp} ${level}: ${message}`;
});

export class WinstonLogger {
	constructor({ level = "info", filePath = null } = {}) {
		if (!filePath) {
			const testFileName = path.basename(__filename, ".js");
			filePath = path.join(logDir, `${testFileName}.log`);
		}

		this.logger = winston.createLogger({
			level,
			format: winston.format.combine(winston.format.timestamp(), logFormat),
			transports: [
				// new winston.transports.Console({
				// 	format: winston.format.combine(winston.format.colorize(), logFormat),
				// }),
				new winston.transports.File({
					filename: filePath,
				}),
			],
		});
	}

	info(message) {
		this.logger.info(message);
	}

	warn(message) {
		this.logger.warn(message);
	}

	error(message) {
		this.logger.error(message);
	}

	debug(message) {
		this.logger.debug(message);
	}
}
