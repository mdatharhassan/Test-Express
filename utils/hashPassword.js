import bcrypt from "bcryptjs";

const hashPassword = (password) => {
  // Hashing logic here
  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  return hashedPassword;
};

const verifyPassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

export { hashPassword, verifyPassword };
