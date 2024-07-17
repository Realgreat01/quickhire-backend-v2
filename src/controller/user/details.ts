import { UserSchema } from '../../models';
import errorHandler from '../../errors';
import { UPLOAD_TO_CLOUDINARY } from '../../config/cloudinary';
import ContentBasedRecommender from 'content-based-recommender-ts';
import { NextFunction, Request, Response } from 'express';

// ALL USERS
export const GET_ALL_USERS = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserSchema.find().select('-password');
    return res.success(users);
  } catch (error) {
    next(res.error.NotFound('no user found'));
  }
};

// BASIC DETAILS
export const GET_USER_DETAILS = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user;
    const currentUser = await UserSchema.findById(id).select('-password');

    return res.success(currentUser);
  } catch (error) {
    next(res.error.NotFound('user not found'));
  }
};

//
export const GET_SINGLE_USER = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const user = await UserSchema.findOne({ username: id }).select('-password');
    if (user) {
      return res.success(user);
    } else throw Error('user not found');
  } catch (error) {
    next(res.error.NotFound('user not found'));
  }
};

export const GET_SIMILAR_USERS = async (req: Request, res: Response, next: NextFunction) => {
  const username = req.params.id;
  const recommender = new ContentBasedRecommender({
    minScore: 0.1,
    debug: false,
    maxVectorSize: 100,
    maxSimilarDocs: 4,
  });
  try {
    const user = await UserSchema.findOne({ username }).select('-password').lean();
    const users = await UserSchema.find({ username: { $ne: username } })
      .select('-password')
      .lean();

    if (user) {
      const aggregateUsers = users.map((user) => {
        const experience = user?.experience.map(({ company, role }) => `${company} ${role}`).join(' ');
        const education = user?.education.map((edu) => `${edu.institution} ${edu.course}`).join(' ');
        const skills = user?.skills?.top_skills.map(({ name }) => `${name}`).join(' ');
        return {
          id: user._id.toString(),
          content: `${user.username} ${user.header_bio} ${user.gender} ${experience} ${education} ${skills} ${user.address.country} ${user.firstname} ${user.lastname} ${user.skills?.stack} `,
        };
      });

      const currentUser = () => {
        const experience = user?.experience.map(({ company, role }) => `${company} ${role}`).join(' ');
        const education = user?.education.map((edu) => `${edu.institution} ${edu.course}`).join(' ');
        const skills = user?.skills?.top_skills.map(({ name }) => `${name}`).join(' ');
        return {
          id: user._id.toString(),
          content: `${user.username} ${user.header_bio} ${user.gender} ${experience} ${education} ${skills} ${user.address.country} ${user.firstname} ${user.lastname} ${user.skills?.stack} `,
        };
      };

      const formattedUser = currentUser();

      aggregateUsers.push(formattedUser);
      recommender.train(aggregateUsers);
      const matchedUsers = recommender.getSimilarDocuments(formattedUser.id);
      const similarUsers = matchedUsers.map(({ id }) => users.find((user) => id === user._id.toString()));
      return res.success(similarUsers);
    } else throw Error('user not found');
  } catch (error) {
    return next(res.error.NotFound('user not found'));
  }
};

// SUBMIT BASIC DETAILS
export const UPDATE_USER_DETAILS = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  const { email, password, status, skills, ...updateData } = req.body;
  try {
    const currentUser = await UserSchema.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');
    return res.success(currentUser, 201);
  } catch (error) {
    next(res.createError(400, '', error));
  }
};

export const UPLOAD_PROFILE_PICTURE = async (req: Request, res: Response, next: NextFunction) => {
  //converting buffer to usable format

  /*  #swagger.consumes = ['multipart/form-data']
		#swagger.description = 'uploading user profile picture '
		#swagger.summary = 'Some for user profile picture '
        #swagger.parameters['profile_picture'] = {
		in: 'formData',
		type: 'file',
		required: 'true',
    }
	*/

  const options = {
    overwrite: false,
    unique_filename: true,
    folder: 'quickhire',
  };

  const { id } = req.user;

  try {
    if (req.file) {
      const imageURL = await UPLOAD_TO_CLOUDINARY(req.file);
      await UserSchema.findByIdAndUpdate(id, { profile_picture: imageURL });
      return res.success({ profile_picture: imageURL }, 'Profile picture updated successfully !');
    } else return next(res.error.BadRequest());
  } catch (error) {
    next(res.createError(500, '', errorHandler(error)));
  }
};
