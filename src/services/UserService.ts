import api from "../utils/axiosBase.tsx";

export class UserService {
    static async getAllUsers() {
        const response = await api.get('/users');
        return response.data;
    }
}