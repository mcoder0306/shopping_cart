import jwt from "jsonwebtoken"
export const verifyJWT = async (req, res, next) => {
    try {
        let token = req.cookies.accessToken;
        if (!req.cookies.accessToken) {
            return res.status(401).json({ message: "Unauthorized!" })
        }

        if (!token) {
            return res.status(403).json({ message: 'No token provided!' });
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized!' });
            }
            req.userId = user.id;
            next();
        });
    } catch (error) {
        next()
    }
}