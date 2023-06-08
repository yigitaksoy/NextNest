const verifyToken = (admin) => {
  return async (req, res, next) => {
    try {
      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader) {
        return res.status(401).json({ message: "Missing token" });
      }

      let token;
      if (authorizationHeader.startsWith("Bearer ")) {
        token = authorizationHeader.substring(7);
      } else {
        token = authorizationHeader;
      }

      if (!token) {
        return res.status(401).json({ message: "Missing token" });
      }

      console.log("admin.apps.length:", admin.apps?.length || 0);

      try {
        const decodedToken = await admin.auth().verifyIdToken(token);

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
