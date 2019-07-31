import jwt from 'jsonwebtoken';

import AuthConfig from '../../config/auth';

export default async (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json({ error: 'Authorization not provided in request' });
  }

  const [, token] = req.headers.authorization.split(' ');

  if (!token) {
    return res.status(401).json({ eror: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, AuthConfig.secret);
    req.userId = decoded.id;
  } catch (err) {
    return res.status(401).json('Token invalid');
  }
  next();
};
