

const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  console.log(
    `[${new Date().toISOString()}] --> ${req.method} ${req.originalUrl}`,
    req.body && Object.keys(req.body).length ? { body: req.body } : ""
  );

  // Capture whatever the route eventually sends back, without changing behavior.
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    res.locals.responseBody = body;
    return originalJson(body);
  };

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    console.log(
      `[${new Date().toISOString()}] <-- ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`,
      res.locals.responseBody ? { response: res.locals.responseBody } : ""
    );
  });

  next();
};

module.exports = requestLogger;