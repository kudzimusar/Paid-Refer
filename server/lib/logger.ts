export const logger = {
  info: (msg: string, meta?: object) =>
    console.log(JSON.stringify({ level: "info", msg, ...meta, ts: Date.now() })),
  warn: (msg: string, meta?: object) =>
    console.warn(JSON.stringify({ level: "warn", msg, ...meta, ts: Date.now() })),
  error: (msg: string, meta?: object) =>
    console.error(JSON.stringify({ level: "error", msg, ...meta, ts: Date.now() })),
};
