export class Track{
    private id: number = -1;
    private number: number = -1;
    private title: string = "";
    private lyrics: string = "";
    private video: string = "";

    constructor(id:number, number:number, title:string, lyrics:string, video:string){
        this.id = id;
        this.number = number;
        this.title = title;
        this.lyrics = lyrics;
        this.video = video;
    }

    get Id():number{
        return this.id;
    }
    set Id(id:number){
        this.id = id;
    }

    get Number():number{
        return this.number;
    }
    set Number(number:number){
        this.number = number;
    }

    get Title():string{
        return this.title;
    }
    set Title(title:string){
        this.title = title;
    }
    get Lyrics():string{
        return this.lyrics;
    }
    set Lyrics(lyrics:string){
        this.lyrics = lyrics;
    }

    get Video():string{
        return this.video;
    }
    set Video(video:string){
        this.video = video;
    }
}