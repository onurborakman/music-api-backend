export class Album{
    
    private id: number = -1;
    private title:string = "";
    private artist:string = "";
    private description:string = "";
    private year:number = -1;
    private image:string = "";
    private tracks:any = [];

    constructor(id:number, title:string, artist:string, description:string, year:number, image:string, tracks:any){
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.description = description;
        this.year = year;
        this.image = image;
        this.tracks = tracks;
    }

    get Id():number{
        return this.id;
    }
    set Id(id:number){
        this.id = id;
    }

    get Title():string{
        return this.title;
    }
    set Title(title:string){
        this.title = title;
    }

    get Artist():string{
        return this.artist;
    }
    set Artist(artist:string){
        this.artist = artist;
    }

    get Description():string{
        return this.description;
    }
    set Description(description:string){
        this.description = description;
    }

    get Year():number{
        return this.year;
    }
    set Year(year:number){
        this.year = year;
    }

    get Tracks():any{
        return this.tracks;
    }
    set Tracks(tracks:any){
        this.tracks = tracks;
    }

    get Image():string{
        return this.image;
    }
    set Image(image:string){
        this.image = image;
    }
}