import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import authConfig from '../../config/auth';
import User from '../models/User';

class SessionController {
  async index(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'The authentication provided is not valid' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'The email provided doesnt exist' });
    }

    if (!(await user.checkPassword(password))) {
      return res
        .status(400)
        .json({ error: 'The password provided for this email doesnt match' });
    }

    const { id, name } = user;

    const auth = await jwt.sign(
      {
        id,
        name,
        email,
      },
      authConfig.secret,
      {
        expiresIn: authConfig.expiresIn,
      }
    );

    return res.json(auth);
  }
}

export default new SessionController();
