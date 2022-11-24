export type config = {
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
        trailLength: number,
        integrationStep: number,
        pause: boolean,
    },
}