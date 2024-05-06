import { LIMIT_ARRAY } from '../../config';
import { UserSkills } from '../../types';
import { Schema } from 'mongoose';

export const SkillSchema = new Schema<UserSkills>({
  stack: {
    type: String,
    default: 'Frontend Development',
    required: [true, 'Please kindly indicate your stack'],
  },
  top_skills: {
    type: [
      {
        name: { type: String, required: [true, 'skill name is required'] },
        icon: { type: String, required: [true, 'skill icon name is required'] },
      },
    ],
    validate: [LIMIT_ARRAY(3), 'Top skills must be less than three'],
    required: [true, 'top skills is required'],
  },
  programming_languages: {
    type: [
      {
        name: { type: String, required: [true, 'langauge name is required'] },
        icon: { type: String, required: [true, 'language icon name is required'] },
      },
    ],
    required: [true, 'programming languages are required'],
  },
  frameworks: {
    type: [
      {
        name: { type: String, required: [true, 'framework name is required'] },
        icon: { type: String, required: [true, 'framework icon name is required'] },
      },
    ],
    required: [true, 'frameworks is required'],
  },
  technologies: [
    {
      name: { type: String, required: [true, 'technology name is required'] },
      icon: { type: String, required: [true, 'technology icon name is required'] },
    },
  ],
  others: [{ type: String }],
  soft_skills: [{ type: String }],
});
