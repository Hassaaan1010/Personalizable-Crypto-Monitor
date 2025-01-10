const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,100}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^.{6,100}$/;
const tokenRegex = /^[a-f0-9]{64}$/; // Hexadecimal token, 64 characters long

export { passwordRegex, emailRegex, usernameRegex, tokenRegex };
