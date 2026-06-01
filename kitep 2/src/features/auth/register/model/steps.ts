import {
  FaKey,
  FaEnvelope,
  FaCheck,
  FaUsers,
  FaUser,
  FaPenNib,
  FaBuilding,
  FaFileContract,
} from 'react-icons/fa';

export const baseSteps = [
  { number: 1, title: 'Логин и пароль', icon: FaKey },
  { number: 2, title: 'Email', icon: FaEnvelope },
  { number: 3, title: 'Подтверждение', icon: FaCheck },
  { number: 4, title: 'Тип профиля', icon: FaUsers },
];

export const readerStep = {
  number: 5,
  title: 'Персональные данные',
  icon: FaUser,
};

export const authorStep = {
  number: 5,
  title: 'Данные автора',
  icon: FaPenNib,
};

export const organizationStep = {
  number: 5,
  title: 'Данные организации',
  icon: FaBuilding,
};

export const contractStep = {
  number: 6,
  title: 'Договор',
  icon: FaFileContract,
};