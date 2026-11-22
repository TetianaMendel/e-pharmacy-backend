import { Store } from '../models/store.js';
import { Pharmacy } from '../models/pharmacy.js';

export const getNearestStores = async (_req, res) => {
  const stores = await Store.find();

  res.status(200).json(stores);
};

export const getStores = async (_req, res) => {
  const stores = await Pharmacy.find();

  res.status(200).json(stores);
};
