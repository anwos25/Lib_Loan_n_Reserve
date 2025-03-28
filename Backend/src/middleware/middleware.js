export const validateFields =
  (requiredFields) => async (request, response, next) => {
    const missingFields = requiredFields.filter(
      (field) => !request.body[field]
    );

    if (missingFields.length > 0) {
      return response.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    next();
  };

export const isAdmin = (req, res, next) => {
  const { role } = req.headers; // จำลอง role (จริงๆ ควรดึงจาก token)
  if (role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }
  next();
};
