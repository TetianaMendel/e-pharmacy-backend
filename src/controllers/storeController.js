import { Store } from '../models/store.js';

export const getNearestStores = async (_req, res) => {
  const stores = await Store.find();

  res.status(200).json(stores);
};
