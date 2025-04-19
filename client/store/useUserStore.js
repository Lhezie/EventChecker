import { create } from 'zustand';

const useUserStore = create((set) => ({
  formData: {
    username: '',
    email: '',
    dob: '',
  },
  setFormData: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),
  resetFormData: () =>
    set({
      formData: { username: '', email: '', dob: '' },
    }),
}));

export default useUserStore;