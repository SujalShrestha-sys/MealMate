import bcrypt from "bcrypt";

export const hashedPassword = async (password) => {
  return bcrypt.hashSync(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};
