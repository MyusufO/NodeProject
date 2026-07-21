

const jsonFileHandler = (options = {}) => {
  const { key = "data", required = true } = options;

  return (req, res, next) => {
    if (!req.file) {
      if (!required) return next();

      const error = new Error("JSON file is required");
      error.statusCode = 400;
      return next(error);
    }

    const filename = req.file.originalname || "";
    const isJsonMimeType = req.file.mimetype === "application/json";
    const isJsonExtension = filename.toLowerCase().endsWith(".json");

    if (!isJsonMimeType && !isJsonExtension) {
      const error = new Error("Uploaded file must be a .json file");
      error.statusCode = 400;
      return next(error);
    }

    let parsed;
    try {
      parsed = JSON.parse(req.file.buffer.toString("utf-8"));
    } catch (err) {
      const error = new Error("Uploaded file contains invalid JSON");
      error.statusCode = 400;
      return next(error);
    }

    req.body[key] = parsed;

    console.log(
      `[${new Date().toISOString()}] --> ${req.method} ${req.originalUrl} (parsed file "${filename}" into req.body.${key})`,
      { [key]: parsed }
    );

    next();
  };
};

module.exports = jsonFileHandler;