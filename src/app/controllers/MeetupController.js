import * as Yup from 'yup';
import { isBefore } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
  async index(req, res) {}

  async store(req, res) {
    const shchema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      file_id: Yup.number().required(),
    });

    if (!(await shchema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'The request is missing some field' });
    }

    const { date } = req.body;

    if (await isBefore(date, new Date())) {
      return res.status(400).json({
        error: 'Meetup date is passed',
      });
    }

    const user_id = req.userId;

    const meetup = await Meetup.create({
      ...req.body,
      user_id,
    });

    return res.json(meetup);
  }
}

export default new MeetupController();
