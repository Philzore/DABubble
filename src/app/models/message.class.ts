export class Message {
    from: string;
    time: number;
    text: string;
    
    constructor(obj?: any) {
        this.from = obj ? obj.from : '';
        this.time = obj ? obj.time : '';
        this.text = obj ? obj.text : '';
    }

    public toJSON() {
        return {
            from: this.from,
            time: this.time,
            text: this.text,
        }
    }
}