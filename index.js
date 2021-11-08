//Application Dependencies
const {Album} = require('./lib/app/models/Album.js');
const {Track} = require('./lib/app/models/Track.js');
const {MusicDAO} = require('./lib/app/database/MusicDAO.js');
const bodyParser = require('body-parser');
//Create instance of an Express Application on Port 3000
const express = require('express');
const { restart } = require('nodemon');
const app = express();
const port = process.env.PORT || 3000;
//Database Configuration
const dbHost = "localhost";
const dbPort = 3306;
const dbUsername = "root";
const dbPassword = "root";
//Images
app.use(express.static('app/images'));
app.use(bodyParser.json());
//Access-Control-Allow-Origin
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
//Routes
app.get('/', function(req, res){
    res.send('This is the default root Route');
});
app.get('/artists', function(req, res){
    let dao = new MusicDAO(dbHost, dbPort, dbUsername, dbPassword);
    dao.findArtists(function(artists){
        res.json(artists);
    });
});
app.get('/albums/:artist', function(req, res){
    let dao = new MusicDAO(dbHost, dbPort, dbUsername, dbPassword);
    dao.findAlbums(req.params.artist, function(albums){
        res.json(albums);
    });
});
app.get('/albums', function(req, res){
    let dao = new MusicDAO(dbHost, dbPort, dbUsername, dbPassword);
    dao.findAllAlbums(function(album){
        res.json(album);
    })
});
app.get('/albums/:artist/:id', function(req, res){
    let dao = new MusicDAO(dbHost, dbPort, dbUsername, dbPassword);
    dao.findAlbum(req.params.id, function(album){
        res.json(album);
    })
});
app.get('/albums/search/artist/:search', function(req, res){
    let dao = new MusicDAO(dbHost, dbPort, dbUsername, dbPassword);
    dao.findAlbumsByArtist(req.params.search, function(albums){
        res.json(albums);
    })
});
app.get('/albums/search/description/:search', function(req, res){
    let dao = new MusicDAO(dbHost, dbPort, dbUsername, dbPassword);
    dao.findAlbumsByDescription(req.params.search, function(albums){
        res.json(albums);
    })
});
app.post('/albums', function(req, res){
    console.log(req.body.tracks.length);
    if(!req.body.title){
        res.status(400).json({error: "Invalid Album Posted"});
    }else{
        /*let tracks = [];
        for(let x=0; x<req.body.tracks.length; ++x){
            tracks.push(new Track(
                req.body.tracks[x].id,
                req.body.tracks[x].number,
                req.body.tracks[x].title,
                req.body.tracks[x].lyrics,
                req.body.tracks[x].video
            ));
        }*/
        let album = new Album(
            -1,
            req.body.title,
            req.body.artist,
            req.body.description,
            req.body.year,
            req.body.image,
            []
        );

        let dao = new MusicDAO(
            dbHost,
            dbPort,
            dbUsername,
            dbPassword
        );
        dao.create(album, function(albumId){
            if(albumId == -1){
                res.status(200).json({"error": "Creating Album"});

            }else{
                res.status(200).json({"success": "Creating Album passed with an Album ID of " + albumId});
            }
        });
    }
});
app.put('/albums/:id', function(req, res){
    
        let dao = new MusicDAO(
            dbHost,
            dbPort,
            dbUsername,
            dbPassword
        );
        let tracks = [];
        for(let x=0; x<req.body.tracks.length; ++x){
            tracks.push(new Track(
                req.body.tracks[x].id,
                req.body.tracks[x].number,
                req.body.tracks[x].title,
                req.body.tracks[x].lyrics,
                req.body.tracks[x].video
            ));
        }
        let album = new Album(
            req.params.id,
            req.body.title,
            req.body.artist,
            req.body.description,
            req.body.year,
            req.body.image,
            tracks
        );
        dao.update(album, function(albumId){
            if(albumId == -1){
                res.status(200).json({"error": "Error Updating Album"});

            }else{
                res.status(200).json({"success": "Updated Album with an Album ID of " + req.params.id});
            }
        });
        
    
});
app.delete('/albums/:id', function(req, res){
    if(!req.params.id){
        res.status(400).json({error: "Invalid Album Posted"});
    }else{
        let dao = new MusicDAO(
            dbHost,
            dbPort,
            dbUsername,
            dbPassword
        );
        dao.delete(req.params.id, function(albumId){
            if(albumId == -1){
                res.status(200).json({"error": "Error Deleting Album"});

            }else{
                res.status(200).json({"success": "Deleted Album with an Album ID of " + (req.params.id)});
            }
        });
        
    }
});
app.listen(port, () =>
    {
        console.log(`Example app listening on port ${port}!`);
    }
);

