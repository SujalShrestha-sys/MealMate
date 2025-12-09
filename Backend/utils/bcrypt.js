import bcrypt from "bcrypt";

export const hashedPassword = async (password) => {
  return bcrypt.hashSync(password, 10);
};

export const comparePassword = async (password, hashed) => {
  return bcrypt.compareSync(password, hashed);
};
