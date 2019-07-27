import jwt from 'jsonwebtoken';

import AuthConfig from '../../config/auth';

export default async (req, res, next) => {
  const [, token] = req.headers.authorization.split(' ');

  if (!token) {
    return res.status(401).json({ eror: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, AuthConfig.secret);
    req.body.userId = decoded.id;
  } catch (err) {
    return res.status(401).json('Token invalid');
  }
  next();
};
