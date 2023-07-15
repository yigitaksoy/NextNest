import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = (props) => {
  const { children } = props;

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return <main>{children}</main>;
};

export default ScrollToTop;