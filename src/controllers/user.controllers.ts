import express from 'express'
import * as userService from '../services/users/crudUserService'

export const updateUser = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const updatedUser = await userService.updateUserService(
            req.params.id,
            req.body
        )
        res.status(updatedUser.status).json({ message: updatedUser.status })
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

// export const protect = async (req: express.Request, res: express. Response, next: NextFunction) => {
//     const token = req.headers ['access-token'];
//     if (token) {
//       jwt.verify (token, app.get('secrets'), (err , decoded) => {
//         if (err) {
//           return res.json ({mensaje: 'Token inválida'});
//         } else {
//           req.body.user = user;
//           next ();
//         }
//       });
//     } else {
//       res.send ( {
//           mensaje: 'Token no proveída.'
//       });
//     }
// };

// export const protect = async (
//     req: express.Request,
//     res: express.Response,
//     next: NextFunction
// ) => {
//     const bearer = req.headers.authorization

//     if (!bearer || !bearer.startsWith('Bearer ')) {
//         return res.status(401).end()
//     }

//     const token = bearer.split('Bearer ')[1]
//     let payload
//     try {
//         payload = await verifyToken(token)
//     } catch (e) {
//         return res.status(401).end()
//     }

//     const user = await prisma.user.findUnique({
//         where: {
//             id: payload.id,
//         },
//     })

//     if (!user) {
//         return res.status(401).end()
//     }

//     req.body.user = user
//     next()
// }
