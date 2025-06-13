import jwt from "jsonwebtoken";
import ForbiddenException from "../exceptions/ForbiddenException";
import UnauthorizedException from "../exceptions/UnauthorizedException";

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (token == null) {
    return res.status(401).json({
      success: false,
      error: 'No access token provided'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.clearCookie("accessToken");
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    req.user = {
      ...req.cookies.user,
      _id: decoded.idUser,
      id: decoded.idUser
    };

    next();
  });
};

export default verifyToken;
