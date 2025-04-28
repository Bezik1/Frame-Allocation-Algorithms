export const randomGaussianInRange = (mean: number, stdDev: number, min: number, max: number): number =>{
    let value;
    do {
        value = Math.floor(gaussianRandom(mean, stdDev));
    } while (value < min || value > max);
    return value;
}

export const gaussianRandom = (mean: number, stdDev: number): number =>{
    let u = 1 - Math.random();
    let v = 1 - Math.random();
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + z * stdDev;
}