export class Message {
    from: string;
    time: string;
    text: string;
    id:string;
    
    constructor(obj?: any) {
        this.from = obj ? obj.from : '';
        this.time = obj ? obj.time : '';
        this.text = obj ? obj.text : '';
        this.id = obj ? obj.id : '';
    }

    public toJSON() {
        return {
            from: this.from,
            time: this.time,
            text: this.text,
            id: this.id,
        }
    }
}