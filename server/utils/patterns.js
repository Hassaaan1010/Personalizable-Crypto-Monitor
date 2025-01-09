const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,100}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /.{6,100}/;

export { passwordRegex, emailRegex, usernameRegex };
