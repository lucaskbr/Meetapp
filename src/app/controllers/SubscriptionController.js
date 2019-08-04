import { isPast } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

class SubcriptionController {
  async index(req, res) {
    const meetups = await Subscription.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: Meetup,
          where: {
            date: {
              [Op.gte]: new Date(),
            },
          },
        },
      ],
    });
    return res.json(meetups);
  }

  async store(req, res) {
    if (!req.params.id) {
      return res.status(400).json({ error: 'Meetup id was not passed' });
    }

    const meetup = await Meetup.findByPk(req.params.id);

    if (!meetup) {
      return res
        .status(400)
        .json({ error: 'The meetup doesnt exist or was deleted' });
    }

    const { date, user_id: organizer } = meetup;

    if (organizer === req.userId) {
      return res
        .status(400)
        .json({ error: 'The organizer cant subscribe his own meetup' });
    }

    if (isPast(date)) {
      return res
        .status()
        .json({ error: 'The meetup has a date that has passed' });
    }

    const alreadySubscribed = await Subscription.findOne({
      where: { user_id: req.userId, id: meetup.id },
    });

    if (alreadySubscribed) {
      return res.status(400).json({ error: 'Already subscribed to meetup' });
    }

    const subscribedInSameDate = await Subscription.findOne({
      where: { user_id: req.userId },
      include: {
        model: Meetup,
        where: {
          date,
        },
      },
    });

    if (subscribedInSameDate) {
      return res
        .status(400)
        .json({ error: 'Already subscribed in a meetup with the same date' });
    }

    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id: meetup.id,
    });

    return res.json(subscription);
  }
}

export default new SubcriptionController();
