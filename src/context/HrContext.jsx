import { createContext,useContext,useState } from "react";

const HrContext = createContext();


export const HrProvider = ({ children }) => {
    const [hrid, setHrid] = useState(null);
    return (
        <HrContext.Provider value={{hrid,setHrid}}>
            {children}
        </HrContext.Provider>
    );   
};

export const useHrContext = () => {
    return useContext(HrContext);
};
