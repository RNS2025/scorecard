export interface Game {
    id?: string;
    courseId: string;
    name?: string;
    format: "slagspil" | "hulspil";
    numberOfPlayers: number;
    players: Player[];
    createdAt?: string;
    matchFinished?: boolean;
}

export interface Player {
    name: string;
    email?: string;
    scores: (number | null)[];
}