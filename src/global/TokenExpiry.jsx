// TokenUtil.js
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "./AuthMechanism";

export const useTokenExpirationCheck = () => {
  const navigate = useNavigate();

  const checkTokenExpiration = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const isExpired = isTokenExpired(accessToken);
      console.log("is EXPIRED---------------------------- " + isExpired);
      if (isExpired) {
        navigate("/login");
      } else {
        // Token is valid, continue with the navigation
        const isLogout = localStorage.getItem("loggedOut");
        console.log("Logout " + isLogout);
        if (isLogout === null && window.location.pathname === "/") {
          navigate("/");
        }
      }
    }
  };

  return checkTokenExpiration;
};
