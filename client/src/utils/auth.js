import { useNavigate } from "react-router-dom";
const navigate = useNavigate();
const tokenValid = async (token) => {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const currentTimeInSecs = Math.floor(Date.now() / 1000);
  return decodedToken.exp < currentTimeInSecs;
};

// const authMain = async () => {
//   const availableToken = localStorage.getItem("token");
//   if (availableToken && tokenValid(availableToken)) {
//     navigate("/home");
//   } else {
//     localStorage.clear();
//   }
// };

export { tokenValid, checkAuthorization };
