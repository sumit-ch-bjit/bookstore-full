import jwt from 'jwt-decode'
const decodeJwt = (token) => {
    const user = jwt(token)
    console.log(user)
    return user;
}

export default decodeJwt