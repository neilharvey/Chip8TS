Number.prototype.toHex = function(bits?:number):string {
    return this.toString(16).padStart(bits || 1, '0');
}