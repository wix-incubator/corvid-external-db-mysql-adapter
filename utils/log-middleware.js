const logMiddleware = (req, res, next) => {
  res.on("finish", () => {
    console.log({req, res});
  });
  next();
}

module.exports = logMiddleware