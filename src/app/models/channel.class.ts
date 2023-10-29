export class Channel {
    name: string;
    description?: string;
    created: string;
    members: string;


    constructor(obj?: any) {
        this.name = obj ? obj.name : '';
        this.description = obj ? obj.description : '';
        this.created = obj ? obj.created : '';
        this.members = obj ? obj.members : '';
    }

 
    public toJSON() {
        return {
            name: this.name,
            description: this.description,
            created: this.created,
            members: this.members,
        }
    }




}