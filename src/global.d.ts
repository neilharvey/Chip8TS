export {};

declare global {
    interface Number {
        toHex(bits?:number):string
    }
}
