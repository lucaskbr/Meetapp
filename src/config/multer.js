import { extname, resolve } from 'path';
import crypto from 'crypto';
import multer from 'multer';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return cb(err);
        }
        return cb(null, buf.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
