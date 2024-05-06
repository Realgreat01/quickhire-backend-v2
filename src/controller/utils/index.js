import { todaysRate } from '../../utils/data';

const getExchangeRate = async (req, res) => {
  return res.status(400).json(todaysRate(req.query.base ?? 'NGN'));
};

export default { getExchangeRate };
