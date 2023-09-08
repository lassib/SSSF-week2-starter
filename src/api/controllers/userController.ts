// TODO: create the following functions:
// - userGet - get user by id
// - userListGet - get all users
// - userPost - create new user. Remember to hash password
// - userPutCurrent - update current user
// - userDeleteCurrent - delete current user
// - checkToken - check if current user token is valid: return data from req.user. No need for database query
import {Request, Response, NextFunction} from 'express';
import {User, UserOutput} from '../../interfaces/User';
import CustomError from '../../classes/CustomError';
import userModel from '../models/userModel';
import bcrypt = require('bcryptjs');

const userGet = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user = await userModel.findById(id);
    if (user) {
      const output: UserOutput = {
        _id: user._id,
        user_name: user.user_name,
        email: user.email,
      };
      return res.json(output);
    } else {
      return res.status(404).json({error: 'User not found'});
    }
  } catch (err) {
    return res.status(500).json({err});
  }
};

const userListGet = async (req: Request, res: Response) => {
  try {
    const users = await userModel.find();
    if (users) {
      const output: UserOutput[] = users.map((user: User) => {
        return {
          _id: user._id,
          user_name: user.user_name,
          email: user.email,
        };
      });
      return res.json(output);
    } else {
      return res.status(404).json({error: 'Users not found'});
    }
  } catch (err) {
    return res.status(500).json({err});
  }
};

const userPost = async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(user.password!, salt);
    user.password = hash;
    const newUser = await userModel.create(user);
    if (newUser) {
      res.json({message: 'User created', data: newUser});
    } else {
      res.status(500).json({error: 'User not created'});
    }
  } catch (err) {
    res.status(500).json({err});
  }
};

const userPutCurrent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: User = req.body;
  const {user_name, email, password} = req.body;
  const updatedUser: User = await userModel.findByIdAndUpdate(
    user._id,
    {user_name, email, password},
    {new: true}
  );
  if (!updatedUser) {
    return next(new CustomError('User not updated', 500));
  }
  res.json({message: 'User updated', data: updatedUser});
};

const userDeleteCurrent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: User = req.body as User;
  const deletedUser = await userModel.findByIdAndDelete(user._id);
  if (!deletedUser) {
    return next(new CustomError('User not deleted', 500));
  }
  res.json({message: 'User deleted', data: deletedUser});
};

const checkToken = async (req: Request, res: Response) => {
  const user: User = req.user as User;
  try {
    if (!user) {
      throw new Error('User not found');
    }
    const output: UserOutput = {
      _id: user._id,
      user_name: user.user_name,
      email: user.email,
    };
    return res.json(output);
  } catch (err) {
    return res.status(500).json({err});
  }
};

export {
  userGet,
  userListGet,
  userPost,
  userPutCurrent,
  userDeleteCurrent,
  checkToken,
};
