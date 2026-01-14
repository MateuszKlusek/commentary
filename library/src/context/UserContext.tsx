import type { User } from "@shared/src/types/data";
import type { Nullable } from "@shared/src/types/helpers";
import { createContext, useContext } from "react";

const UserContext = createContext<{ user: Nullable<User>; isUserSet: boolean }>(
  { user: undefined, isUserSet: false }
);

export const UserProvider = ({
  user,
  children,
}: {
  user: Nullable<User>;
  children: React.ReactNode;
}) => {
  const isUserSet = Boolean(user);

  return (
    <UserContext.Provider value={{ user, isUserSet }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
