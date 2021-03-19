import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret = String(process.env.SECRET);

export default (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized. No token provided.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length != 2) {
    return res.status(401).json({ error: 'Token error' });
  }

  const [
    scheme,
    token
  ] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token malformatted'})
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: 'Token invalid',
        token: token,
        secret: secret,
        authHeader: authHeader
      });
    }

    return next();
  })
}