import api from "../utils/axiosBase.tsx";
import type {Game} from "../utils/interfaces/Game.ts"

class GameService {
    static async createGame(game: Game): Promise<Game> {
        const response = await api.post('/games', game)
        return response.data as Game
    }

    static async updateGame(game: Game): Promise<Game> {
        const response = await api.put('/games/' + game.id, game)
        return response.data as Game
    }

    static async getGameById(id: string): Promise<Game> {
        const response = await api.get(`/games/${id}`)
        return response.data as Game
    }
}

export default GameService;