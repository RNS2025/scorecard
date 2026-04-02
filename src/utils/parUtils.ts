import type { Course } from "./interfaces/Course.ts";

/**
 * Returns the par for a specific hole, respecting the course's parMode.
 *
 * - "manual" (default / fodboldgolf): uses holes[i].par
 * - "calculated" (minigolf): uses calculatedHolePars[i], falling back to holes[i].par
 *
 * Returns undefined if no par is available.
 */
export const getHolePar = (course: Course, holeIndex: number): number | undefined => {
    if (course.parMode === "calculated") {
        return course.calculatedHolePars?.[holeIndex] ?? course.holes[holeIndex]?.par;
    }
    return course.holes[holeIndex]?.par;
};

/**
 * Returns the total par for the course, respecting the course's parMode.
 *
 * - "manual": uses course.par (the manually set total)
 * - "calculated": uses calculatedTotalPar, falling back to course.par
 *
 * Returns undefined if no par is available.
 */
export const getTotalPar = (course: Course): number | undefined => {
    if (course.parMode === "calculated") {
        return course.calculatedTotalPar ?? course.par;
    }
    return course.par;
};

/**
 * Returns true if the course has par data available (either manual or calculated).
 */
export const hasParData = (course: Course): boolean => {
    if (course.parMode === "calculated") {
        return (course.calculatedHolePars?.length ?? 0) > 0;
    }
    return course.holes.some(h => h.par !== undefined);
};

/**
 * Returns the sport-specific term for a single attempt (e.g. "spark", "slag").
 */
export const getShotLabel = (sport?: string): string => {
    switch (sport?.toLowerCase()) {
        case "fodboldgolf": return "spark";
        case "minigolf": return "slag";
        default: return "slag";
    }
};

/**
 * Returns the sport-specific column header for shots (e.g. "Spark", "Slag").
 */
export const getShotHeader = (sport?: string): string => {
    switch (sport?.toLowerCase()) {
        case "fodboldgolf": return "Spark";
        case "minigolf": return "Slag";
        default: return "Slag";
    }
};
