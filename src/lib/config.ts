export type config = {
    pause: boolean,
    spawner: {
        bounds: {
            x: number,
            y: number,
            z: number
        },
        density: number,
    },
    rendering: {
        pointSize: number,
        integrationStep: number,
        decayRate: number,
        resetChance: number,
    },
}