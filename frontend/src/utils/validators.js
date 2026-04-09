export const validators = {
  name: (val) => {
    if (!val) return "Name is required";
    if (val.length < 5) return "Name must be at least 5 characters";
    if (val.length > 60) return "Name must be at most 60 characters";
    return null;
  },
  email: (val) => {
    if (!val) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
      return "Enter a valid email address";
    return null;
  },
  address: (val) => {
    if (!val) return "Address is required";
    if (val.length > 400) return "Address must be at most 400 characters";
    return null;
  },
  password: (val) => {
    if (!val) return "Password is required";
    if (val.length < 8 || val.length > 16)
      return "Password must be 8-16 characters";
    if (!/[A-Z]/.test(val))
      return "Password must include at least one uppercase letter";
    if (!/[^A-Za-z0-9]/.test(val))
      return "Password must include at least one special character";
    return null;
  },
};

export const validateForm = (fields) => {
  const errors = {};
  Object.keys(fields).forEach((key) => {
    if (validators[key]) {
      const err = validators[key](fields[key]);
      if (err) errors[key] = err;
    }
  });
  return errors;
};
