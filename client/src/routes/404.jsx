import { Link } from "react-router-dom";

const Error = () => {
  return (
    <section id="404" className="font-degular">
      <div className="grid h-screen place-items-center bg-white">
        <div className="text-center text-black">
          <p className="py-2 text-2xl font-bold">404</p>
          <p className="py-2 text-2xl font-heavy">Page Not Found</p>
          <p className="py-2 text-lg">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
          <p>
            Let&apos;s get you back to{" "}
            <Link to="/">
              <span className="underline">safety</span>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Error;
