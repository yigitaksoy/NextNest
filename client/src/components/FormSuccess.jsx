import { motion } from "framer-motion";

const FormSuccess = () => {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.1,
        ease: [0, 0.71, 0.2, 1.01],
        scale: {
          type: "spring",
          damping: 8,
          stiffness: 100,
          restDelta: 0.001,
        },
      }}
    >
      <div className="mx-auto mt-10 flex flex-col items-center justify-center px-6 py-8 lg:py-0">
        <div
          id="form-success"
          className="w-full rounded-lg bg-white font-degular sm:max-w-md md:mt-0 md:shadow-searchBar xl:p-0"
        >
          <div className="rounded-tl-3xl rounded-tr-3xl bg-custom-green">
            <h1 className="p-4 text-center font-marker text-xl font-bold leading-tight tracking-tight text-black md:text-2xl">
              Success! 🎉
            </h1>
          </div>
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <div className="space-y-4 text-custom-black md:space-y-6">
              <div>
                <p className="py-2">
                  Your request has been received, please check your inbox!
                </p>
                <p className="py-2">
                  <span className="font-heavy">Note:</span> It may take a while
                  before you start receiving new listings. But don&apos;t worry!
                  We&apos;ll be checking every 15 minutes to make sure you find
                  your next nest<span className="font-heavy"> ASAP!🚀</span>
                </p>
                <p className="pt-10 text-center">
                  Thank you for using{" "}
                  <span className="font-nove">NextNest! ♥️</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default FormSuccess;
