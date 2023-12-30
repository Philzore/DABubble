export class Message {
    from: string;
    profileImg:string;
    time: string;
    timeStamp: Date;
    calculatedTime:string;
    lastThreadTime:string;
    text: string;
    id:string;
    numberOfThreadMsgs:number
    reactionsCount: { [emoji: string]: number } = {};
    reactions: [];
    imageUrl: string;
    fileUploaded: boolean;


    constructor(obj?: any) {
        this.from = obj ? obj.from : '';
        this.profileImg = obj ? obj.profileImg : '' ;
        this.time = obj ? obj.time : '';
        this.timeStamp = obj ? obj.timeStamp : '';
        this.calculatedTime = obj ? obj.calculatedTime : '';
        this.lastThreadTime = obj ? obj.lastThreadTime : '';
        this.text = obj ? obj.text : '';
        this.id = obj ? obj.id : '';
        this.numberOfThreadMsgs = obj ? obj.numberOfThreadMsgs : 0 ;
        this.reactionsCount = obj ? obj.reactionsCount : {};
        this.reactions = obj ? obj.reactions : [];
        this.imageUrl = obj ? obj.imageUrl : '';
        this.fileUploaded = obj && typeof obj.fileUploaded === 'boolean' ? obj.fileUploaded : false;

    }

    public toJSON() {
        return {
            from: this.from,
            profileImg: this.profileImg,
            time: this.time,
            timeStamp: this.timeStamp,
            calculatedTime: this.calculatedTime,
            lastThreadTime: this.lastThreadTime,
            text: this.text,
            id: this.id,
            numberOfThreadMsgs : this.numberOfThreadMsgs,
            reactionsCount: this.reactionsCount,
            reactions: this.reactions,
            imageUrl: this.imageUrl,
            fileUploaded: this.fileUploaded
        }
    }
}