export class ChannelInfo {
          name:string ;
          members:string[];
          created:string ;
          description:string ;
        id:string ;
      


    constructor(obj?: any) {
        this.name = obj ? obj.name : '';
        this.description = obj ? obj.description : '';
        this.created = obj ? obj.created : '';
        this.members = obj ? obj.members : [];
        this.id = obj ? obj.id : '';
    }

 
    public toJSON() {
        return {
            info : {
            name: this.name,
            description: this.description,
            created: this.created,
            members: this.members,
            },
            id : this.id,
        }
    }
}