const logMiddleware = (req, _res, next) => {
  const simdi = new Date().toISOString();
  console.log(`[${simdi}] ${req.method} ${req.originalUrl}`);
  next();
};

module.exports = logMiddleware;
