import { useRouter } from 'next/dist/client/router';
import { createContext, useState } from 'react';

const LogContext = createContext(0, () => {});

export const LogProvider = ({ children }) => {
  const [logged, change] = useState(0);
  const router = useRouter()
  const increment = () => change((log) => log = log + 1);

  return (
    <LogContext.Provider value={[logged, increment]}>
      {children}
    </LogContext.Provider>
  );
};

export default LogContext;