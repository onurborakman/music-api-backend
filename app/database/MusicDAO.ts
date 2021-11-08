import { Artist } from "../models/Artist";
import { Album } from "../models/Album";
import { Track } from "../models/Track";
import * as mysql from "mysql";
import * as util from "util";

export class MusicDAO
{
    private host:string = "";
    private port:number = 3306;
    private username:string = "";
    private password:string = "";
    private schema:string = "oe0d8prguymnrsa5";
    private pool = this.initDbConnection();
    
    /**
     * Non-default constructor.
     * 
     * @param host Database Hostname
     * @param username Database Username
     * @param password Database Password
     */
    constructor(host:string, port:number, username:string, password:string)
    {
        // Set all class properties
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.pool = this.initDbConnection();
    }

   /**
     * CRUD method to return all Artists.
     * 
     * @param callback Callback function with an Array of type Artist.
     */
    public findArtists(callback: any)
    {
        // List of Artist to return
        let artists:Artist[] = [];
        
        // Get a pooled connection to the database, run the query to get all the distinct Artists, and return the List of Artists
        this.pool.getConnection(function(err:any, connection:any)
        {
            // Throw error if an error
            if (err) throw err

            // Run query    
            connection.query('SELECT distinct ARTIST FROM ALBUM', function (err:any, rows:any, fields:any) 
            {
                // Release connection in the pool
                connection.release();

                // Throw error if an error
                if (err) throw err
    
                // Loop over result set and save the Artist Name in the List of Artists
                for(let x=0;x < rows.length;++x)
                {
                    artists.push(new Artist(x, rows[x].ARTIST));
                }
    
                // Do a callback to return the results
                callback(artists);
            });
    
        });
     }

     /**
     * CRUD method to return all Albums for an artist.
     * 
     * @param artist Name of the Artist to retrieve Albums for.
     * @param callback Callback function with an Array of type Album.
     */
    public findAlbums(artist:string, callback: any)
    {
         // List of Albums to return
         let albums:Album[] = [];

        // Get pooled database connection and run queries   
        this.pool.getConnection(async function(err:any, connection:any)
        {
            // Release connection in the pool
            connection.release();

            // Throw error if an error
            if (err) throw err;

            // Use Promisfy Util to make an async function and run query to get all Albums for specific Artist
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query('SELECT * FROM ALBUM WHERE ARTIST=? ORDER BY YEAR, TITLE', [artist]);
            for(let x=0;x < result1.length;++x)
            {
                 // Use Promisfy Util to make an async function and run query to get all Tracks for this Album
                let albumId = result1[x].ID;
                let tracks:Track[] = [];
                let result2 = await connection.query('SELECT * FROM TRACK WHERE ALBUM_ID=?', [albumId]);
                for(let y=0;y < result2.length;++y)
                {
                    tracks.push(new Track(result2[y].ID, result2[y].NUMBER, result2[y].TITLE, result2[y].LYRICS, result2[y].VIDEO_URL));
                }

                // Add Album and its Tracks to the list
                albums.push(new Album(result1[x].ID, result1[x].TITLE, result1[x].ARTIST, result1[x].DESCRIPTION, result1[x].YEAR, result1[x].IMAGE_NAME, tracks)); 
            }

            // Do a callback to return the results
            callback(albums);
         });
    }            

    /**
     * CRUD method to return all Albums.
     * 
     * @param callback Callback function with an Array of type Album.
     */
    public findAllAlbums(callback: any)
    {
         // List of Albums to return
         let albums:Album[] = [];

        // Get pooled database connection and run queries   
        this.pool.getConnection(async function(err:any, connection:any)
        {
            // Release connection in the pool
            connection.release();

            // Throw error if an error
            if (err) throw err;

            // Use Promisfy Util to make an async function and run query to get all Albums
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query('SELECT * FROM ALBUM ORDER BY YEAR, TITLE');
            for(let x=0;x < result1.length;++x)
            {
                 // Use Promisfy Util to make an async function and run query to get all Tracks for this Album
                let albumId = result1[x].ID;
                let tracks:Track[] = [];
                let result2 = await connection.query('SELECT * FROM TRACK WHERE ALBUM_ID=?', [albumId]);
                for(let y=0;y < result2.length;++y)
                {
                    tracks.push(new Track(result2[y].ID, result2[y].NUMBER, result2[y].TITLE, result2[y].LYRICS, result2[y].VIDEO_URL));
                }

                // Add Album and its Tracks to the list
                albums.push(new Album(result1[x].ID, result1[x].TITLE, result1[x].ARTIST, result1[x].DESCRIPTION, result1[x].YEAR, result1[x].IMAGE_NAME, tracks)); 
            }

            // Do a callback to return the results
            callback(albums);
         });
    }

    /**
     * CRUD method to searches for all Albums by a wildard search in Artist.
     * 
     * @param search wildcard Artist to search Albums for.
     * @param callback Callback function with an Array of type Album.
     */
    public findAlbumsByArtist(search:string, callback: any)
    {
         // List of Albums to return
         let albums:Album[] = [];

        // Get pooled database connection and run queries   
        this.pool.getConnection(async function(err:any, connection:any)
        {
            // Release connection in the pool
            connection.release();

            // Throw error if an error
            if (err) throw err;

            // Use Promisfy Util to make an async function and run query to get all Albums for search partial Artist
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query("SELECT * FROM ALBUM WHERE ARTIST LIKE ? ORDER BY YEAR, TITLE", ['%' + search + '%']);
            for(let x=0;x < result1.length;++x)
            {
                 // Use Promisfy Util to make an async function and run query to get all Tracks for this Album
                let albumId = result1[x].ID;
                let tracks:Track[] = [];
                let result2 = await connection.query('SELECT * FROM TRACK WHERE ALBUM_ID=?', [albumId]);
                for(let y=0;y < result2.length;++y)
                {
                    tracks.push(new Track(result2[y].ID, result2[y].NUMBER, result2[y].TITLE, result2[y].LYRICS, result2[y].VIDEO_URL));
                }

                // Add Album and its Tracks to the list
                albums.push(new Album(result1[x].ID, result1[x].TITLE, result1[x].ARTIST, result1[x].DESCRIPTION, result1[x].YEAR, result1[x].IMAGE_NAME, tracks)); 
            }

            // Do a callback to return the results
            callback(albums);
         });
    }            

        /**
     * CRUD method to searches for all Albums by a wildcard serach in Description.
     * 
     * @param search wildcard Description to search Albums for.
     * @param callback Callback function with an Array of type Album.
     */
    public findAlbumsByDescription(search:string, callback: any)
    {
         // List of Albums to return
         let albums:Album[] = [];

        // Get pooled database connection and run queries   
        this.pool.getConnection(async function(err:any, connection:any)
        {
            // Release connection in the pool
            connection.release();

            // Throw error if an error
            if (err) throw err;

            // Use Promisfy Util to make an async function and run query to get all Albums for search partial Artist
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query("SELECT * FROM ALBUM WHERE DESCRIPTION LIKE ? ORDER BY YEAR, TITLE", ['%' + search + '%']);
            for(let x=0;x < result1.length;++x)
            {
                 // Use Promisfy Util to make an async function and run query to get all Tracks for this Album
                let albumId = result1[x].ID;
                let tracks:Track[] = [];
                let result2 = await connection.query('SELECT * FROM TRACK WHERE ALBUM_ID=?', [albumId]);
                for(let y=0;y < result2.length;++y)
                {
                    tracks.push(new Track(result2[y].ID, result2[y].NUMBER, result2[y].TITLE, result2[y].LYRICS, result2[y].VIDEO_URL));
                }

                // Add Album and its Tracks to the list
                albums.push(new Album(result1[x].ID, result1[x].TITLE, result1[x].ARTIST, result1[x].DESCRIPTION, result1[x].YEAR, result1[x].IMAGE_NAME, tracks)); 
            }

            // Do a callback to return the results
            callback(albums);
         });
    }            

    /**
     * CRUD method to return an Album.
     * 
     * @param albumId Album ID to retrieve Album for.
     * @param callback Callback function with an Array of type Album.
     */
    public findAlbum(albumId:number, callback: any)
    {
        // Get pooled database connection and run queries   
        this.pool.getConnection(async function(err:any, connection:any)
        {
            // Release connection in the pool
            connection.release();

            // Throw error if an error
            if (err) throw err;

            // Use Promisfy Util to make an async function and run query to get all Albums for specific Artist
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query('SELECT * FROM ALBUM WHERE ID=?', [albumId]);
            if(result1.length != 1)
                callback(null);

            // Use Promisfy Util to make an async function and run query to get all Tracks for this Album
            let tracks:Track[] = [];
            let result2 = await connection.query('SELECT * FROM TRACK WHERE ALBUM_ID=?', [albumId]);
            for(let y=0;y < result2.length;++y)
            {
                tracks.push(new Track(result2[y].ID, result2[y].NUMBER, result2[y].TITLE, result2[y].LYRICS, result2[y].VIDEO_URL));
            }

            // Create an Album and its Tracks for return
            let album = new Album(result1[0].ID, result1[0].TITLE, result1[0].ARTIST, result1[0].DESCRIPTION, result1[0].YEAR, result1[0].IMAGE_NAME, tracks); 

            // Do a callback to return the results
            callback(album);
         });
    }

    /**
     * CRUD method to create an Album.
     * 
     * @param album Album to insert.
     * @param callback Callback function with -1 if an error else Album ID created.  
     */
    public create(album:Album, callback: any)
    {
        // Get pooled database connection and run queries   
        this.pool.getConnection(async function(err:any, connection:any)
        {
            // Release connection in the pool
            connection.release();

            // Throw error if an error
            if (err) throw err;

            // Use Promisfy Util to make an async function and insert Album
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query('INSERT INTO ALBUM (TITLE, ARTIST, DESCRIPTION, YEAR, IMAGE_NAME) VALUES(?,?,?,?,?)', [album.Title, album.Artist, album.Description, album.Year, album.Image]);
            if(result1.affectedRows != 1)
               callback(-1);

            // Use Promisfy Util to make an async function and run query to insert all Tracks for this Album
            let albumId = result1.insertId;
            for(let y=0;y < album.Tracks.length;++y)
            {
                let result2 = await connection.query('INSERT INTO TRACK (ALBUM_ID, TITLE, NUMBER, VIDEO_URL) VALUES(?,?,?,?)', [albumId, album.Tracks[y].Title, album.Tracks[y].Number, album.Tracks[y].Video]);
            }

            // Do a callback to return the results
            callback(albumId);
        });
    }

    /**
     * CRUD method to update an Album.
     * 
     * @param album Album to update.
     * @param callback Callback function with number of rows updated.  
     */
    public update(album:Album, callback: any)
    {
         // Get pooled database connection and run queries   
         this.pool.getConnection(async function(err:any, connection:any)
         {
             // Release connection in the pool
             connection.release();
 
             // Throw error if an error
            if (err) throw err;
 
             // Use Promisfy Util to make an async function and update Album
             let changes = 0;
             connection.query = util.promisify(connection.query);
            let result1 = await connection.query('UPDATE ALBUM SET TITLE=?, ARTIST=?, DESCRIPTION=?, YEAR=?, IMAGE_NAME=? WHERE ID=?', [album.Title, album.Artist, album.Description, album.Year, album.Image, album.Id]);
            if(result1.changedRows != 0)
                ++changes;

             // Use Promisfy Util to make an async function and run query to update all Tracks for this Album
             for(let y=0;y < album.Tracks.length;++y)
            {
                 let result2 = await connection.query('UPDATE TRACK SET TITLE=?, NUMBER=?, VIDEO_URL=? WHERE ID=? AND ALBUM_ID=?', [album.Tracks[y].Title, album.Tracks[y].Number, album.Tracks[y].Video, album.Tracks[y].Id, album.Id]);
                 if(result2.changedRows != 0)
                    ++changes;
            }
 
            // Do a callback to return the results
            callback(changes);
         });
     }

     /**
     * CRUD method to delete an Album.
     * 
     * @param album Album ID to delete.
     * @param callback Callback function with number of rows deleted.  
     * */
    public delete(albumId:number, callback: any)
    {
        // Get pooled database connection and run queries   
        this.pool.getConnection(async function(err:any, connection:any)
        {
            // Release connection in the pool
            connection.release();

            // Throw error if an error
           if (err) throw err;

            // Use Promisfy Util to make an async function and run query to delete the tracks for an Album
            let changes = 0;
            connection.query = util.promisify(connection.query);
            let result1 = await connection.query('DELETE FROM TRACK WHERE ALBUM_ID=?', [albumId]);
            changes = changes + result1.affectedRows;

            // Use Promisfy Util to make an async function and run query to delete the Album
            let result2 = await connection.query('DELETE FROM ALBUM WHERE ID=?', [albumId]);
            changes = changes + result2.affectedRows;

            // Do a callback to return the results
            callback(changes);
        });
    }

    //* **************** Private Helper Methods **************** */

    /**
     * Private helper method to initialie a Database Connection
     */
    private initDbConnection():any
    {
        return mysql.createPool({host: this.host, port: this.port, user: this.username, password: this.password, database: this.schema, connectionLimit: 10});
    }
}