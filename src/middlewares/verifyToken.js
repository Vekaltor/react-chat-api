import jwt from "jsonwebtoken";
import ForbiddenException from "../exceptions/ForbiddenException";
import UnauthorizedException from "../exceptions/UnauthorizedException";

const verifyToken = (req, res, next) => {
  const token = req.cookies.JWT;

  if (token == null) throw new UnauthorizedException();

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) throw new ForbiddenException();

    req.user = user;
    next();
  });
};

export default verifyToken;
