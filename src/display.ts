export interface Display {
    render(pixels: boolean[][]): void;
}

export class NullDisplay implements Display {
    render(pixels: boolean[][]): void {
    }
}

export class CanvasDisplay implements Display {

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor(id: string) {
        this.canvas = <HTMLCanvasElement>document.getElementById(id);
        this.context = <CanvasRenderingContext2D>this.canvas.getContext("2d");
    }

    render(pixels: boolean[][]): void {

        let canvasWidth: number = this.canvas.width;
        let canvasHeight: number = this.canvas.height;
        let pixelSize: number = this.canvas.width / 64;

        this.context.clearRect(0, 0, canvasWidth, canvasHeight);
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, canvasWidth, canvasHeight);

        this.context.fillStyle = "white";

        for (var x = 0; x < 64; x++) {
            for (var y = 0; y < 32; y++) {
                if (pixels[x][y]) {
                    this.context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                }
            }
        }
    }
}