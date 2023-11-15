import { useState, createContext, useContext } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

import { useEffect } from "react";
const MyContext = createContext();
export const MyProvider = ({ children }) => {
  const [listings, setListings] = useState([])
  const [currentUser, setCurrentUser] = useState();
  const [token, setToken] = useState();
  useEffect(() => {
    getUpdateData()

  }, [])

  const getUpdateData = () => {
    const starCountRef = ref(getDatabase(), 'listings/');
    onValue(starCountRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const data = snapshot.val();

          const postDataArray = Object.keys(data).map((id) => ({ id, ...data[id] }));
          setListings(postDataArray)

        } else {
          console.error('No data found in the snapshot.');
        }
      } catch (error) {
        console.error('Error fetching data from Firebase:', error);
      }
    });
  }

  return (
    <MyContext.Provider value={{ listings, setListings, getUpdateData, currentUser, setCurrentUser, token, setToken }}>
      {children}
    </MyContext.Provider>
  );
};
export const useDataContext = () => {
  return useContext(MyContext);
};
