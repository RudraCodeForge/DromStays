import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { VerifyAccount } from "../../services/auth.service";
import { fetchCurrentUser } from "../../redux/authThunks";
import { toast } from "react-toastify";
const Verify = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.warning("Verification token missing");
      navigate("/login");
      return;
    }

    const verify = async () => {
      try {
        const res = await VerifyAccount(token);

        if (res.success) {
          toast.success("Account verified successfully ✅");

          // 🔥 REAL WORLD FIX
          // backend se fresh user lao
          dispatch(fetchCurrentUser());

          navigate("/profile");
        }
      } catch (err) {
        toast.error(err?.message || "Verification failed");
        navigate("/login");
      }
    };

    verify();
  }, [token, dispatch, navigate]);

  return <h2>Verifying your account...</h2>;
};

export default Verify;
