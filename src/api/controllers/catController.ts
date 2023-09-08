// TODO: create following functions:
// - catGetByUser - get all cats by current user id
// - catGetByBoundingBox - get all cats by bounding box coordinates (getJSON)
// - catPutAdmin - only admin can change cat owner
// - catDeleteAdmin - only admin can delete cat
// - catDelete - only owner can delete cat
// - catPut - only owner can update cat
// - catGet - get cat by id
// - catListGet - get all cats
// - catPost - create new cat
import {Request, Response, NextFunction} from 'express';
import {User} from '../../interfaces/User';
import {Cat} from '../../interfaces/Cat';
import catModel from '../models/catModel';
import mongoose = require('mongoose');

const catGetByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: User = req.user as User;
  const cats: Cat[] = await catModel.find({owner: user._id});
  res.json(cats);
  next(cats);
};

const catGetByBoundingBox = async (req: Request, res: Response) => {
  try {
    const cats = await catModel
      .find()
      .where('location.lat')
      .gt(0)
      .lt(100)
      .where('location.long')
      .gt(0)
      .lt(100);
    if (cats) {
      return res.json(cats);
    } else {
      return res.status(404).json({error: 'Cats not found'});
    }
  } catch (err) {
    return res.status(500).json({err});
  }
};

const catPutAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  const cat: Cat = await catModel.findById(id);
  if (!cat) {
    return res.status(404).json({error: 'Cat not found'});
  }
  cat.cat_name = req.body.cat_name;
  res.json({message: 'Cat updated', data: cat});
  next(cat);
};

const catDeleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {id} = req.params;
  const user: User = req.user as User;
  if (user.role !== 'admin') {
    return res.status(401).json({error: 'Unauthorized'});
  }
  const cat: Cat = await catModel.findByIdAndDelete(id);
  if (!cat) {
    return res.status(404).json({error: 'Cat not found'});
  }
  res.json({message: 'Cat deleted', data: cat});
  next(cat);
};

const catDelete = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  const user: User = req.user as User;
  const cat: Cat = await catModel.findById(id);
  if (!cat) {
    return res.status(404).json({error: 'Cat not found'});
  }
  if (
    !(cat.owner.owner_id as unknown as mongoose.Types.ObjectId).equals(
      user._id as unknown as mongoose.Types.ObjectId
    )
  ) {
    return res.status(401).json({error: 'Unauthorized'});
  }
  const deletedCat: Cat = await catModel.findByIdAndDelete(id);
  res.json({message: 'Cat deleted', data: deletedCat});
  next(deletedCat);
};

const catPut = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  const user: User = req.user as User;
  const {cat_name, birthdate, weight} = req.body;
  const cat: Cat = await catModel.findById(id);
  if (!cat) {
    return res.status(404).json({error: 'Cat not found'});
  }
  if (
    !(cat.owner.owner_id as unknown as mongoose.Types.ObjectId).equals(
      user._id as unknown as mongoose.Types.ObjectId
    )
  ) {
    return res.status(401).json({error: 'Unauthorized'});
  }
  const updatedCat: Cat = await catModel.findByIdAndUpdate(
    id,
    {cat_name, birthdate, weight},
    {new: true}
  );
  res.json({message: 'Cat updated', data: updatedCat});
  next(updatedCat);
};

const catGet = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  const cat: Cat = await catModel.findById(id);
  if (!cat) {
    return res.status(404).json({error: 'Cat not found'});
  }
  res.json(cat);
  next(cat);
};

const catListGet = async (req: Request, res: Response, next: NextFunction) => {
  const cats: Cat[] = await catModel.find();
  res.json(cats);
  next(cats);
};

const catPost = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = req.user as User;
  const {cat_name, birthdate, weight, filename} = req.body;
  const newCat: Cat = await catModel.create({
    cat_name,
    birthdate,
    weight,
    filename,
    location: location,
    owner: {
      owner_id: user._id,
      user_name: user.user_name,
      email: user.email,
    },
  });
  if (!newCat) {
    return res.status(500).json({error: 'Cat not created'});
  }
  res.json({message: 'Cat created', data: newCat});
  next(newCat);
};

export default {
  catGetByUser,
  catGetByBoundingBox,
  catPutAdmin,
  catDeleteAdmin,
  catDelete,
  catPut,
  catGet,
  catListGet,
  catPost,
};
