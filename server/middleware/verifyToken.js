const verifyToken = (admin) => {
  return async (req, res, next) => {
    try {
      console.log("Verifying token...");

      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader) {
        console.log("No authorization header found");
        return res.status(401).json({ message: "Missing token" });
      }

      let token;
      if (authorizationHeader.startsWith("Bearer ")) {
        token = authorizationHeader.substring(7);
      } else {
        token = authorizationHeader;
      }

      if (!token) {
        console.log("No token found");
        return res.status(401).json({ message: "Missing token" });
      }

      try {
        console.log("Invoking Firebase Admin SDK...");
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log("Token verified");
        // Proceed with the next middleware or route handler
        req.user = {
          uid: decodedToken.uid,
        };
        return next();
      } catch (error) {
        console.error("Error while decoding token:", error);
        return res.status(401).json({ message: "Invalid token" });
      }
    } catch (error) {
      console.error("Error during token verification:", error);
      return res.status(500).json({ message: "Internal Error" });
    }
  };
};

module.exports = {
  verifyToken: verifyToken,
};
