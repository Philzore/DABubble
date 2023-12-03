export class Message {
    from: string;
    profileImg:string;
    time: Date;
    calculatedTime:string;
    text: string;
    id:string;
    numberOfThreadMsgs:number
    reactionsCount: { [emoji: string]: number } = {};
    reactions: [];
;
    
    constructor(obj?: any) {
        this.from = obj ? obj.from : '';
        this.profileImg = obj ? obj.profileImg : '' ;
        this.time = obj ? obj.time : '';
        this.calculatedTime = obj ? obj.calculatedTime : '';
        this.text = obj ? obj.text : '';
        this.id = obj ? obj.id : '';
        this.numberOfThreadMsgs = obj ? obj.numberOfThreadMsgs : 0 ;
        this.reactionsCount = obj ? obj.reactionsCount : {};
        this.reactions = obj ? obj.reactions : [];

    }

    public toJSON() {
        return {
            from: this.from,
            profileImg: this.profileImg,
            time: this.time,
            calculatedTime: this.calculatedTime,
            text: this.text,
            id: this.id,
            numberOfThreadMsgs : this.numberOfThreadMsgs,
            reactionsCount: this.reactionsCount,
            reactions: this.reactions
        }
    }
}