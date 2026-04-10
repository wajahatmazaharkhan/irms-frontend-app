import Navbar from "./Navbar";
import Wrapper from "@/Components/Wrapper";
import { motion } from "framer-motion";

const LoaderPage = () => {
  return (
    <>
      <Navbar />
      <div id="mainContent">
        <Wrapper>
          <div className="min-h-screen flex flex-row items-center justify-center bg-gray-50 dark:bg-slate-900">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <img
                className="w-10 h-10 mx-auto mb-4"
                src="https://cdn.pixabay.com/animation/2023/08/11/21/18/21-18-05-265_512.gif"
                alt="Loading"
              />
            </motion.div>
          </div>
        </Wrapper>
      </div>
    </>
  );
};

export default LoaderPage;
