import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "../auth/AuthContext";

const UserContext = createContext();

export function UserProvider({ children }) {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (user) {
      setUserInfo({
        fullName: user.user_metadata?.fullName || "",
        gender: user.user_metadata?.gender || "",
        phone: user.user_metadata?.phone || "",
        email: user.email,
        dob: user.user_metadata?.dob || { day: "", month: "", year: "" },
      });
    } else {
      setUserInfo(null);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
