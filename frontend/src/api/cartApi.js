import apiInstance from "./apiInstance";

const cartApi = async () => {
    const addToCart = async ({ cart }) => {
        try {
            const res = apiInstance.post('/cart/add-to-cart', cart)
            return res;
        } catch (error) {
            console.log(error)
        }

    }

    return { addToCart };
}

export default cartApi;