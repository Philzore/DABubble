export class Channel {
    name: string;
    description: string;
    created: string;
    members: {
        name:string ,
        imgNr:string,
    }[];
    id : string ;


    constructor(obj?: any) {
        this.name = obj ? obj.name : '';
        this.description = obj ? obj.description : '';
        this.created = obj ? obj.created : '';
        this.members = obj ? obj.members : [];
        this.id = obj ? obj.id : '' ;
    }

 
    public toJSON() {
        return {
            name: this.name,
            description: this.description,
            created: this.created,
            members: [{ name : this.members['name'], imgNr : this.members['imgNr']}],
            id : this.id ,
        }
    }




}