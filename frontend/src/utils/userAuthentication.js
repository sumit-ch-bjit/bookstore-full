import axios from "axios"
import { removeCurrentUser } from '../store/user/user.reducer'
import { useDispatch } from "react-redux"

const userLogin = async (email, password) => {
    try {
        const res = await axios.post('http://localhost:3000/api/auth/login', { email, password })
        console.log(res)
        return res.data
    } catch (error) {
        // console.log(error)
        return error.response.status
    }
    // axios.post('http://localhost:3001/api/auth/login', { email, password })
    //     .then(res => console.log(res.status))
    //     .catch(error => console.log(error))
}


export { userLogin }