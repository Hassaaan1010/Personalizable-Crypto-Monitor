import { useParams, useSearchParams } from "react-router-dom";

function ResetPassword() {
  const { id } = useParams(); // Get the dynamic ID
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Get the token from the query string

  return (
    <div>
      <h1>Reset Password</h1>
      <p>ID: {id}</p>
      <p>Token: {token}</p>
    </div>
  );
}

export default ResetPassword;
