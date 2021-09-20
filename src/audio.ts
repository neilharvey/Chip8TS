export interface Audio {
    beep():void;
}

export class NullAudio implements Audio {
    beep(): void {
    }
}