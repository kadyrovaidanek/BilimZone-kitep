import { FaUser, FaPen, FaBuilding } from 'react-icons/fa';
import type { UserRegistrationData } from './types';

export const USER_TYPES = {
  READER: {
    id: 'reader',
    icon: FaUser,
    label: 'Читатель',
  },
  AUTHOR: {
    id: 'author',
    icon: FaPen,
    label: 'Автор',
  },
  ORGANIZATION: {
    id: 'organization',
    icon: FaBuilding,
    label: 'Организация',
  },
} as const;

export const INITIAL_REGISTRATION_DATA: UserRegistrationData = {
  username: '',
  email: '',
  password: '',
  verificationCode: '',

  userType: '',

  lastName: '',
  firstName: '',
  fatherName: '',
  phone_number: '',
  photo: null,

  specialization: '',
  bio: '',

  organization_name: '',
  legal_name: '',
  address: '',
  website: '',

  contractAccepted: false,
};