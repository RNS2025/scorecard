import api from "../utils/axiosBase.tsx";
import type {Game} from "../utils/interfaces/Game.ts"

class GameService {
    static async createGame(game: Game): Promise<Game> {
        await api.post('/games', game)
        return game
    }

    static async updateGame(game: Game): Promise<Game> {
        await api.put('/games/' + game.id, game)
        return game
    }

    static async getGameById(id: string): Promise<Game> {
        const response = await api.get(`/games/${id}`)
        return response.data as Game
    }
}

export default GameService;