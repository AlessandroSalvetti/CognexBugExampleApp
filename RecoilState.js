import { atom } from 'recoil';

export const globaAppState = atom({
    key: 'globaAppState',
    default: {
      state: undefined,
      active: false,
      changeToActive: false,
    },
  });
