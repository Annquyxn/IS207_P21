import { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const mockData = {
      fullName: 'Nguyễn Văn A',
      gender: 'Nam',
      phone: '0915468302',
      email: 'nguyenvanan@gmail.com',
      dob: {
        day: '01',
        month: '01',
        year: '2000',
      },
      avatar: 'https://i.pravatar.cc/150?img=32',
    };

    setUserInfo(mockData);
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
