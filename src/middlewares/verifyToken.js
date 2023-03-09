import jwt from "jsonwebtoken";
import ForbiddenException from "../exceptions/ForbiddenException";
import UnauthorizedException from "../exceptions/UnauthorizedException";

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (token == null) throw new UnauthorizedException();

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) throw new ForbiddenException();

      req.user = user;
      next();
    });
  } catch (error) {
    res.clearCookie("accessToken");
  }
};

export default verifyToken;
