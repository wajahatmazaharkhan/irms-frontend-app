import { useEffect } from "react";

const useTitle = (title) => {
  useEffect(() => {
    document.title = `IRMS | ${title}`;
  }, []);
};

export default useTitle;
