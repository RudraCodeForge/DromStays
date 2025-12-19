import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { VerifyAccount } from "../../services/auth";
import { fetchCurrentUser } from "../../redux/authThunks";

const Verify = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert("Verification token missing");
      navigate("/login");
      return;
    }

    const verify = async () => {
      try {
        const res = await VerifyAccount(token);

        if (res.success) {
          alert("Account verified successfully ✅");

          // 🔥 REAL WORLD FIX
          // backend se fresh user lao
          dispatch(fetchCurrentUser());

          navigate("/profile");
        }
      } catch (err) {
        alert("Verification failed or expired");
        navigate("/login");
      }
    };

    verify();
  }, [token, dispatch, navigate]);

  return <h2>Verifying your account...</h2>;
};

export default Verify;
