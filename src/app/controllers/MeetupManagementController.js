import * as Yup from 'yup';
import { isPast, isBefore, parseISO } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
  async index(req, res) {
    const meetups = await Meetup.findAll({ where: { user_id: req.userId } });

    return res.json(meetups);
  }

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

    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({ error: 'Meetup date invalid' });
    }

    const user_id = req.userId;

    const meetup = await Meetup.create({
      ...req.body,
      user_id,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const shchema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
      file_id: Yup.number(),
    });

    if (!(await shchema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'The request contain invalid parameters' });
    }

    if (!req.params.id) {
      return res.status(400).json({ error: 'The id of the meetup is missing' });
    }

    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== req.userId) {
      return res
        .status(400)
        .json({ error: 'The user is not the owner of the meetup' });
    }

    const { date } = req.body;

    if (date && (await isPast(date, new Date()))) {
      return res.status(400).json({
        error: 'Past dates are not allowed',
      });
    }

    const {
      id,
      title,
      location,
      description,
      user_id,
      file_id,
    } = await meetup.update(req.body);

    return res.json({
      id,
      title,
      location,
      description,
      date,
      user_id,
      file_id,
    });
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    if (!meetup) {
      return res
        .status(400)
        .json({ error: 'This meetups was deleted or doesnt exist' });
    }

    if (meetup.user_id !== req.userId) {
      return res
        .status(400)
        .json({ error: 'The user is not the owner of the meetup' });
    }

    const { date } = meetup;

    if (await isPast(date, new Date())) {
      return res.status(400).json({ error: 'Cant delete past meetups' });
    }

    await meetup.destroy();

    return res.send();
  }
}

export default new MeetupController();
