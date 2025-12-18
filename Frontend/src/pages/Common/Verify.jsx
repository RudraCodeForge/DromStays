import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { VerifyAccount } from "../../services/auth";

const Verify = () => {
  const [params] = useSearchParams();
  const token = params.get("token");

  console.log("TOKEN FROM URL:", token); // 🔥 DEBUG

  useEffect(() => {
    if (!token) {
      alert("Verification token missing");
      return;
    }

    VerifyAccount(token)
      .then((res) => {
        alert(res.message);
      })
      .catch((err) => {
        alert(err.message);
      });
  }, [token]);

  return <h2>Verifying your account...</h2>;
};

export default Verify;
