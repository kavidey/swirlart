export type config = {
    pause: boolean,
    field: {
        dx: string,
        dy: string,
        dz: string,
        additionalVars: string,
    },
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