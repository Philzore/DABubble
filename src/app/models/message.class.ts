export class Message {
    from: string;
    time: number;
    text: string;
    
    constructor(obj?: any) {
        this.from = obj ? obj.name : '';
        this.time = obj ? obj.description : '';
        this.text = obj ? obj.created : '';
    }

    public toJSON() {
        return {
            from: this.from,
            time: this.time,
            text: this.text,
        }
    }
}