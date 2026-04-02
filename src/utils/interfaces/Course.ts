export interface Course {
    id?: string;
    name: string;
    address: string;
    city: string;
    zipCode: string | number;
    country: string;
    website: string;
    description?: string;
    numberOfHoles: number;
    difficulty?: string;
    par?: number;
    length?: number;
    abbreviation?: string;
    phoneNumber?: string;
    email: string;
    holes: Hole[];
    rules?: string[];
    sport?: string;
    parMode?: "manual" | "calculated";
    calculatedHolePars?: number[];
    calculatedTotalPar?: number;
}

export interface Hole {
    number: number;
    par?: number;
    length?: number;
}