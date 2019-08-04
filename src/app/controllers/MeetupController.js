import { Op } from 'sequelize';
import { parseISO, startOfDay, endOfDay } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
  async index(req, res) {
    const { date = new Date().toISOString(), page = 0 } = req.query;

    const parsedDate = parseISO(date);

    const meetups = await Meetup.findAll({
      where: {
        date: { [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)] },
      },
      offset: 1 * page,
      limit: 10,
      order: ['date'],
    });

    return res.json(meetups);
  }
}

export default new MeetupController();
