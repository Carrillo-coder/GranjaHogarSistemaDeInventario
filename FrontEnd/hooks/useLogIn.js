
import { useState, useCallback } from 'react';
import LogInServiceProxy from '../proxies/LogInServiceProxy';

/**
 * Custom hook to handle user login.
 * 
 * @returns {{ 
 *   logIn: (username, password) => Promise<void>,
 *   loading: boolean,
 *   error: string | null,
 *   data: object | null
 * }}
 */
const useLogIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // We instantiate the proxy inside the hook.
  const logInService = LogInServiceProxy();

  const logIn = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await logInService.logInUser(username, password);
      setData(response); // On success, store the response data (token, user info)
    } catch (e) {
      // The proxy throws an error on failure, which we catch here.
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, []); // The dependency array is empty as logInService is stable.

  return { logIn, loading, error, data };
};

export default useLogIn;
