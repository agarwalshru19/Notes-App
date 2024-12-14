import jwt from "jsonwebtoken";

export const jwtGenerator = (id) => {
  const payload = {
    id: id,
  };
  return jwt.sign(payload, process.env.JWT_SECRET);
};
