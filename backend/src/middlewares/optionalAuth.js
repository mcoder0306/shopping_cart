import jwt from "jsonwebtoken"
export const optionalJWT = async (req, res, next) => {
    try {
        let token = req.cookies.accessToken;
        if (!token) {
            return next()
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
            if (!err) {
                req.userId=user.id
            }
            next();
        });
    } catch (error) {
        next()
    }

}