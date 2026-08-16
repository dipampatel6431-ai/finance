const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Frontend se aaya hua token pakdo
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "Access Denied! Koi token nahi mila." });
    }

    try {
        // Token ko verify karo
        const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET || 'supersecretkey123');
        req.user = verified; // User ki ID yahan mil jayegi
        next(); // Sab sahi hai, aage badho
    } catch (err) {
        res.status(400).json({ message: "Invalid Token!" });
    }
};

module.exports = authMiddleware;