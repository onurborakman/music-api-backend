"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MusicDAO = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _Artist = require("../models/Artist");

var _Album = require("../models/Album");

var _Track = require("../models/Track");

var mysql = _interopRequireWildcard(require("mysql"));

var util = _interopRequireWildcard(require("util"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var MusicDAO = /*#__PURE__*/function () {
  /**
   * Non-default constructor.
   * 
   * @param host Database Hostname
   * @param username Database Username
   * @param password Database Password
   */
  function MusicDAO(host, port, username, password) {
    (0, _classCallCheck2["default"])(this, MusicDAO);
    (0, _defineProperty2["default"])(this, "host", "");
    (0, _defineProperty2["default"])(this, "port", 3306);
    (0, _defineProperty2["default"])(this, "username", "");
    (0, _defineProperty2["default"])(this, "password", "");
    (0, _defineProperty2["default"])(this, "schema", "MUSIC");
    (0, _defineProperty2["default"])(this, "pool", this.initDbConnection());
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


  (0, _createClass2["default"])(MusicDAO, [{
    key: "findArtists",
    value: function findArtists(callback) {
      // List of Artist to return
      var artists = []; // Get a pooled connection to the database, run the query to get all the distinct Artists, and return the List of Artists

      this.pool.getConnection(function (err, connection) {
        // Throw error if an error
        if (err) throw err; // Run query    

        connection.query('SELECT distinct ARTIST FROM ALBUM', function (err, rows, fields) {
          // Release connection in the pool
          connection.release(); // Throw error if an error

          if (err) throw err; // Loop over result set and save the Artist Name in the List of Artists

          for (var x = 0; x < rows.length; ++x) {
            artists.push(new _Artist.Artist(x, rows[x].ARTIST));
          } // Do a callback to return the results


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

  }, {
    key: "findAlbums",
    value: function findAlbums(artist, callback) {
      // List of Albums to return
      var albums = []; // Get pooled database connection and run queries   

      this.pool.getConnection( /*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(err, connection) {
          var result1, x, albumId, tracks, result2, y;
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  // Release connection in the pool
                  connection.release(); // Throw error if an error

                  if (!err) {
                    _context.next = 3;
                    break;
                  }

                  throw err;

                case 3:
                  // Use Promisfy Util to make an async function and run query to get all Albums for specific Artist
                  connection.query = util.promisify(connection.query);
                  _context.next = 6;
                  return connection.query('SELECT * FROM ALBUM WHERE ARTIST=? ORDER BY YEAR, TITLE', [artist]);

                case 6:
                  result1 = _context.sent;
                  x = 0;

                case 8:
                  if (!(x < result1.length)) {
                    _context.next = 19;
                    break;
                  }

                  // Use Promisfy Util to make an async function and run query to get all Tracks for this Album
                  albumId = result1[x].ID;
                  tracks = [];
                  _context.next = 13;
                  return connection.query('SELECT * FROM TRACK WHERE ALBUM_ID=?', [albumId]);

                case 13:
                  result2 = _context.sent;

                  for (y = 0; y < result2.length; ++y) {
                    tracks.push(new _Track.Track(result2[y].ID, result2[y].NUMBER, result2[y].TITLE, result2[y].LYRICS, result2[y].VIDEO_URL));
                  } // Add Album and its Tracks to the list


                  albums.push(new _Album.Album(result1[x].ID, result1[x].TITLE, result1[x].ARTIST, result1[x].DESCRIPTION, result1[x].YEAR, result1[x].IMAGE_NAME, tracks));

                case 16:
                  ++x;
                  _context.next = 8;
                  break;

                case 19:
                  // Do a callback to return the results
                  callback(albums);

                case 20:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
    }
    /**
     * CRUD method to return all Albums.
     * 
     * @param callback Callback function with an Array of type Album.
     */

  }, {
    key: "findAllAlbums",
    value: function findAllAlbums(callback) {
      // List of Albums to return
      var albums = []; // Get pooled database connection and run queries   

      this.pool.getConnection( /*#__PURE__*/function () {
        var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err, connection) {
          var result1, x, albumId, tracks, result2, y;
          return _regenerator["default"].wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  // Release connection in the pool
                  connection.release(); // Throw error if an error

                  if (!err) {
                    _context2.next = 3;
                    break;
                  }

                  throw err;

                case 3:
                  // Use Promisfy Util to make an async function and run query to get all Albums
                  connection.query = util.promisify(connection.query);
                  _context2.next = 6;
                  return connection.query('SELECT * FROM ALBUM ORDER BY YEAR, TITLE');

                case 6:
                  result1 = _context2.sent;
                  x = 0;

                case 8:
                  if (!(x < result1.length)) {
                    _context2.next = 19;
                    break;
                  }

                  // Use Promisfy Util to make an async function and run query to get all Tracks for this Album
                  albumId = result1[x].ID;
                  tracks = [];
                  _context2.next = 13;
                  return connection.query('SELECT * FROM TRACK WHERE ALBUM_ID=?', [albumId]);

                case 13:
                  result2 = _context2.sent;

                  for (y = 0; y < result2.length; ++y) {
                    tracks.push(new _Track.Track(result2[y].ID, result2[y].NUMBER, result2[y].TITLE, result2[y].LYRICS, result2[y].VIDEO_URL));
                  } // Add Album and its Tracks to the list


                  albums.push(new _Album.Album(result1[x].ID, result1[x].TITLE, result1[x].ARTIST, result1[x].DESCRIPTION, result1[x].YEAR, result1[x].IMAGE_NAME, tracks));

                case 16:
                  ++x;
                  _context2.next = 8;
                  break;

                case 19:
                  // Do a callback to return the results
                  callback(albums);

                case 20:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        return function (_x3, _x4) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
    /**
     * CRUD method to searches for all Albums by a wildard search in Artist.
     * 
     * @param search wildcard Artist to search Albums for.
     * @param callback Callback function with an Array of type Album.
     */

  }, {
    key: "findAlbumsByArtist",
    value: function findAlbumsByArtist(search, callback) {
      // List of Albums to return
      var albums = []; // Get pooled database connection and run queries   

      this.pool.getConnection( /*#__PURE__*/function () {
        var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(err, connection) {
          var result1, x, albumId, tracks, result2, y;
          return _regenerator["default"].wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  // Release connection in the pool
                  connection.release(); // Throw error if an error

                  if (!err) {
                    _context3.next = 3;
                    break;
                  }

                  throw err;

                case 3:
                  // Use Promisfy Util to make an async function and run query to get all Albums for search partial Artist
                  connection.query = util.promisify(connection.query);
                  _context3.next = 6;
                  return connection.query("SELECT * FROM ALBUM WHERE ARTIST LIKE ? ORDER BY YEAR, TITLE", ['%' + search + '%']);

                case 6:
                  result1 = _context3.sent;
                  x = 0;

                case 8:
                  if (!(x < result1.length)) {
                    _context3.next = 19;
                    break;
                  }

                  // Use Promisfy Util to make an async function and run query to get all Tracks for this Album
                  albumId = result1[x].ID;
                  tracks = [];
                  _context3.next = 13;
                  return connection.query('SELECT * FROM TRACK WHERE ALBUM_ID=?', [albumId]);

                case 13:
                  result2 = _context3.sent;

                  for (y = 0; y < result2.length; ++y) {
                    tracks.push(new _Track.Track(result2[y].ID, result2[y].NUMBER, result2[y].TITLE, result2[y].LYRICS, result2[y].VIDEO_URL));
                  } // Add Album and its Tracks to the list


                  albums.push(new _Album.Album(result1[x].ID, result1[x].TITLE, result1[x].ARTIST, result1[x].DESCRIPTION, result1[x].YEAR, result1[x].IMAGE_NAME, tracks));

                case 16:
                  ++x;
                  _context3.next = 8;
                  break;

                case 19:
                  // Do a callback to return the results
                  callback(albums);

                case 20:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));

        return function (_x5, _x6) {
          return _ref3.apply(this, arguments);
        };
      }());
    }
    /**
    * CRUD method to searches for all Albums by a wildcard serach in Description.
    * 
    * @param search wildcard Description to search Albums for.
    * @param callback Callback function with an Array of type Album.
    */

  }, {
    key: "findAlbumsByDescription",
    value: function findAlbumsByDescription(search, callback) {
      // List of Albums to return
      var albums = []; // Get pooled database connection and run queries   

      this.pool.getConnection( /*#__PURE__*/function () {
        var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(err, connection) {
          var result1, x, albumId, tracks, result2, y;
          return _regenerator["default"].wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  // Release connection in the pool
                  connection.release(); // Throw error if an error

                  if (!err) {
                    _context4.next = 3;
                    break;
                  }

                  throw err;

                case 3:
                  // Use Promisfy Util to make an async function and run query to get all Albums for search partial Artist
                  connection.query = util.promisify(connection.query);
                  _context4.next = 6;
                  return connection.query("SELECT * FROM ALBUM WHERE DESCRIPTION LIKE ? ORDER BY YEAR, TITLE", ['%' + search + '%']);

                case 6:
                  result1 = _context4.sent;
                  x = 0;

                case 8:
                  if (!(x < result1.length)) {
                    _context4.next = 19;
                    break;
                  }

                  // Use Promisfy Util to make an async function and run query to get all Tracks for this Album
                  albumId = result1[x].ID;
                  tracks = [];
                  _context4.next = 13;
                  return connection.query('SELECT * FROM TRACK WHERE ALBUM_ID=?', [albumId]);

                case 13:
                  result2 = _context4.sent;

                  for (y = 0; y < result2.length; ++y) {
                    tracks.push(new _Track.Track(result2[y].ID, result2[y].NUMBER, result2[y].TITLE, result2[y].LYRICS, result2[y].VIDEO_URL));
                  } // Add Album and its Tracks to the list


                  albums.push(new _Album.Album(result1[x].ID, result1[x].TITLE, result1[x].ARTIST, result1[x].DESCRIPTION, result1[x].YEAR, result1[x].IMAGE_NAME, tracks));

                case 16:
                  ++x;
                  _context4.next = 8;
                  break;

                case 19:
                  // Do a callback to return the results
                  callback(albums);

                case 20:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        return function (_x7, _x8) {
          return _ref4.apply(this, arguments);
        };
      }());
    }
    /**
     * CRUD method to return an Album.
     * 
     * @param albumId Album ID to retrieve Album for.
     * @param callback Callback function with an Array of type Album.
     */

  }, {
    key: "findAlbum",
    value: function findAlbum(albumId, callback) {
      // Get pooled database connection and run queries   
      this.pool.getConnection( /*#__PURE__*/function () {
        var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(err, connection) {
          var result1, tracks, result2, y, album;
          return _regenerator["default"].wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  // Release connection in the pool
                  connection.release(); // Throw error if an error

                  if (!err) {
                    _context5.next = 3;
                    break;
                  }

                  throw err;

                case 3:
                  // Use Promisfy Util to make an async function and run query to get all Albums for specific Artist
                  connection.query = util.promisify(connection.query);
                  _context5.next = 6;
                  return connection.query('SELECT * FROM ALBUM WHERE ID=?', [albumId]);

                case 6:
                  result1 = _context5.sent;
                  if (result1.length != 1) callback(null); // Use Promisfy Util to make an async function and run query to get all Tracks for this Album

                  tracks = [];
                  _context5.next = 11;
                  return connection.query('SELECT * FROM TRACK WHERE ALBUM_ID=?', [albumId]);

                case 11:
                  result2 = _context5.sent;

                  for (y = 0; y < result2.length; ++y) {
                    tracks.push(new _Track.Track(result2[y].ID, result2[y].NUMBER, result2[y].TITLE, result2[y].LYRICS, result2[y].VIDEO_URL));
                  } // Create an Album and its Tracks for return


                  album = new _Album.Album(result1[0].ID, result1[0].TITLE, result1[0].ARTIST, result1[0].DESCRIPTION, result1[0].YEAR, result1[0].IMAGE_NAME, tracks); // Do a callback to return the results

                  callback(album);

                case 15:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5);
        }));

        return function (_x9, _x10) {
          return _ref5.apply(this, arguments);
        };
      }());
    }
    /**
     * CRUD method to create an Album.
     * 
     * @param album Album to insert.
     * @param callback Callback function with -1 if an error else Album ID created.  
     */

  }, {
    key: "create",
    value: function create(album, callback) {
      // Get pooled database connection and run queries   
      this.pool.getConnection( /*#__PURE__*/function () {
        var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(err, connection) {
          var result1, albumId, y, result2;
          return _regenerator["default"].wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  // Release connection in the pool
                  connection.release(); // Throw error if an error

                  if (!err) {
                    _context6.next = 3;
                    break;
                  }

                  throw err;

                case 3:
                  // Use Promisfy Util to make an async function and insert Album
                  connection.query = util.promisify(connection.query);
                  _context6.next = 6;
                  return connection.query('INSERT INTO ALBUM (TITLE, ARTIST, DESCRIPTION, YEAR, IMAGE_NAME) VALUES(?,?,?,?,?)', [album.Title, album.Artist, album.Description, album.Year, album.Image]);

                case 6:
                  result1 = _context6.sent;
                  if (result1.affectedRows != 1) callback(-1); // Use Promisfy Util to make an async function and run query to insert all Tracks for this Album

                  albumId = result1.insertId;
                  y = 0;

                case 10:
                  if (!(y < album.Tracks.length)) {
                    _context6.next = 17;
                    break;
                  }

                  _context6.next = 13;
                  return connection.query('INSERT INTO TRACK (ALBUM_ID, TITLE, NUMBER, VIDEO_URL) VALUES(?,?,?,?)', [albumId, album.Tracks[y].Title, album.Tracks[y].Number, album.Tracks[y].Video]);

                case 13:
                  result2 = _context6.sent;

                case 14:
                  ++y;
                  _context6.next = 10;
                  break;

                case 17:
                  // Do a callback to return the results
                  callback(albumId);

                case 18:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6);
        }));

        return function (_x11, _x12) {
          return _ref6.apply(this, arguments);
        };
      }());
    }
    /**
     * CRUD method to update an Album.
     * 
     * @param album Album to update.
     * @param callback Callback function with number of rows updated.  
     */

  }, {
    key: "update",
    value: function update(album, callback) {
      // Get pooled database connection and run queries   
      this.pool.getConnection( /*#__PURE__*/function () {
        var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(err, connection) {
          var changes, result1, y, result2;
          return _regenerator["default"].wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  // Release connection in the pool
                  connection.release(); // Throw error if an error

                  if (!err) {
                    _context7.next = 3;
                    break;
                  }

                  throw err;

                case 3:
                  // Use Promisfy Util to make an async function and update Album
                  changes = 0;
                  connection.query = util.promisify(connection.query);
                  _context7.next = 7;
                  return connection.query('UPDATE ALBUM SET TITLE=?, ARTIST=?, DESCRIPTION=?, YEAR=?, IMAGE_NAME=? WHERE ID=?', [album.Title, album.Artist, album.Description, album.Year, album.Image, album.Id]);

                case 7:
                  result1 = _context7.sent;
                  if (result1.changedRows != 0) ++changes; // Use Promisfy Util to make an async function and run query to update all Tracks for this Album

                  y = 0;

                case 10:
                  if (!(y < album.Tracks.length)) {
                    _context7.next = 18;
                    break;
                  }

                  _context7.next = 13;
                  return connection.query('UPDATE TRACK SET TITLE=?, NUMBER=?, VIDEO_URL=? WHERE ID=? AND ALBUM_ID=?', [album.Tracks[y].Title, album.Tracks[y].Number, album.Tracks[y].Video, album.Tracks[y].Id, album.Id]);

                case 13:
                  result2 = _context7.sent;
                  if (result2.changedRows != 0) ++changes;

                case 15:
                  ++y;
                  _context7.next = 10;
                  break;

                case 18:
                  // Do a callback to return the results
                  callback(changes);

                case 19:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7);
        }));

        return function (_x13, _x14) {
          return _ref7.apply(this, arguments);
        };
      }());
    }
    /**
    * CRUD method to delete an Album.
    * 
    * @param album Album ID to delete.
    * @param callback Callback function with number of rows deleted.  
    * */

  }, {
    key: "delete",
    value: function _delete(albumId, callback) {
      // Get pooled database connection and run queries   
      this.pool.getConnection( /*#__PURE__*/function () {
        var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(err, connection) {
          var changes, result1, result2;
          return _regenerator["default"].wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  // Release connection in the pool
                  connection.release(); // Throw error if an error

                  if (!err) {
                    _context8.next = 3;
                    break;
                  }

                  throw err;

                case 3:
                  // Use Promisfy Util to make an async function and run query to delete the tracks for an Album
                  changes = 0;
                  connection.query = util.promisify(connection.query);
                  _context8.next = 7;
                  return connection.query('DELETE FROM TRACK WHERE ALBUM_ID=?', [albumId]);

                case 7:
                  result1 = _context8.sent;
                  changes = changes + result1.affectedRows; // Use Promisfy Util to make an async function and run query to delete the Album

                  _context8.next = 11;
                  return connection.query('DELETE FROM ALBUM WHERE ID=?', [albumId]);

                case 11:
                  result2 = _context8.sent;
                  changes = changes + result2.affectedRows; // Do a callback to return the results

                  callback(changes);

                case 14:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8);
        }));

        return function (_x15, _x16) {
          return _ref8.apply(this, arguments);
        };
      }());
    } //* **************** Private Helper Methods **************** */

    /**
     * Private helper method to initialie a Database Connection
     */

  }, {
    key: "initDbConnection",
    value: function initDbConnection() {
      return mysql.createPool({
        host: this.host,
        port: this.port,
        user: this.username,
        password: this.password,
        database: this.schema,
        connectionLimit: 10
      });
    }
  }]);
  return MusicDAO;
}();

exports.MusicDAO = MusicDAO;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9kYXRhYmFzZS9NdXNpY0RBTy50cyJdLCJuYW1lcyI6WyJNdXNpY0RBTyIsImhvc3QiLCJwb3J0IiwidXNlcm5hbWUiLCJwYXNzd29yZCIsImluaXREYkNvbm5lY3Rpb24iLCJwb29sIiwiY2FsbGJhY2siLCJhcnRpc3RzIiwiZ2V0Q29ubmVjdGlvbiIsImVyciIsImNvbm5lY3Rpb24iLCJxdWVyeSIsInJvd3MiLCJmaWVsZHMiLCJyZWxlYXNlIiwieCIsImxlbmd0aCIsInB1c2giLCJBcnRpc3QiLCJBUlRJU1QiLCJhcnRpc3QiLCJhbGJ1bXMiLCJ1dGlsIiwicHJvbWlzaWZ5IiwicmVzdWx0MSIsImFsYnVtSWQiLCJJRCIsInRyYWNrcyIsInJlc3VsdDIiLCJ5IiwiVHJhY2siLCJOVU1CRVIiLCJUSVRMRSIsIkxZUklDUyIsIlZJREVPX1VSTCIsIkFsYnVtIiwiREVTQ1JJUFRJT04iLCJZRUFSIiwiSU1BR0VfTkFNRSIsInNlYXJjaCIsImFsYnVtIiwiVGl0bGUiLCJEZXNjcmlwdGlvbiIsIlllYXIiLCJJbWFnZSIsImFmZmVjdGVkUm93cyIsImluc2VydElkIiwiVHJhY2tzIiwiTnVtYmVyIiwiVmlkZW8iLCJjaGFuZ2VzIiwiSWQiLCJjaGFuZ2VkUm93cyIsIm15c3FsIiwiY3JlYXRlUG9vbCIsInVzZXIiLCJkYXRhYmFzZSIsInNjaGVtYSIsImNvbm5lY3Rpb25MaW1pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztJQUVhQSxRO0FBU1Q7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSSxvQkFBWUMsSUFBWixFQUF5QkMsSUFBekIsRUFBc0NDLFFBQXRDLEVBQXVEQyxRQUF2RCxFQUNBO0FBQUE7QUFBQSxtREFmc0IsRUFldEI7QUFBQSxtREFkc0IsSUFjdEI7QUFBQSx1REFiMEIsRUFhMUI7QUFBQSx1REFaMEIsRUFZMUI7QUFBQSxx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QjtBQVlwQjBCLGtCQUFBQSxPQUFPLEdBQUdBLE9BQU8sR0FBRzFCLE9BQU8sQ0FBQ3FCLFlBQTVCLENBWm9CLENBY3BCOztBQWRvQjtBQUFBLHlCQWVBbkMsVUFBVSxDQUFDQyxLQUFYLENBQWlCLDhCQUFqQixFQUFpRCxDQUFDYyxPQUFELENBQWpELENBZkE7O0FBQUE7QUFlaEJHLGtCQUFBQSxPQWZnQjtBQWdCcEJzQixrQkFBQUEsT0FBTyxHQUFHQSxPQUFPLEdBQUd0QixPQUFPLENBQUNpQixZQUE1QixDQWhCb0IsQ0FrQnBCOztBQUNBdkMsa0JBQUFBLFFBQVEsQ0FBQzRDLE9BQUQsQ0FBUjs7QUFuQm9CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBQXhCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBcUJILEssQ0FFRDs7QUFFQTtBQUNKO0FBQ0E7Ozs7V0FDSSw0QkFDQTtBQUNJLGFBQU9HLEtBQUssQ0FBQ0MsVUFBTixDQUFpQjtBQUFDdEQsUUFBQUEsSUFBSSxFQUFFLEtBQUtBLElBQVo7QUFBa0JDLFFBQUFBLElBQUksRUFBRSxLQUFLQSxJQUE3QjtBQUFtQ3NELFFBQUFBLElBQUksRUFBRSxLQUFLckQsUUFBOUM7QUFBd0RDLFFBQUFBLFFBQVEsRUFBRSxLQUFLQSxRQUF2RTtBQUFpRnFELFFBQUFBLFFBQVEsRUFBRSxLQUFLQyxNQUFoRztBQUF3R0MsUUFBQUEsZUFBZSxFQUFFO0FBQXpILE9BQWpCLENBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFydGlzdCB9IGZyb20gXCIuLi9tb2RlbHMvQXJ0aXN0XCI7XHJcbmltcG9ydCB7IEFsYnVtIH0gZnJvbSBcIi4uL21vZGVscy9BbGJ1bVwiO1xyXG5pbXBvcnQgeyBUcmFjayB9IGZyb20gXCIuLi9tb2RlbHMvVHJhY2tcIjtcclxuaW1wb3J0ICogYXMgbXlzcWwgZnJvbSBcIm15c3FsXCI7XHJcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSBcInV0aWxcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNdXNpY0RBT1xyXG57XHJcbiAgICBwcml2YXRlIGhvc3Q6c3RyaW5nID0gXCJcIjtcclxuICAgIHByaXZhdGUgcG9ydDpudW1iZXIgPSAzMzA2O1xyXG4gICAgcHJpdmF0ZSB1c2VybmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHJpdmF0ZSBwYXNzd29yZDpzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHJpdmF0ZSBzY2hlbWE6c3RyaW5nID0gXCJNVVNJQ1wiO1xyXG4gICAgcHJpdmF0ZSBwb29sID0gdGhpcy5pbml0RGJDb25uZWN0aW9uKCk7XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogTm9uLWRlZmF1bHQgY29uc3RydWN0b3IuXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBob3N0IERhdGFiYXNlIEhvc3RuYW1lXHJcbiAgICAgKiBAcGFyYW0gdXNlcm5hbWUgRGF0YWJhc2UgVXNlcm5hbWVcclxuICAgICAqIEBwYXJhbSBwYXNzd29yZCBEYXRhYmFzZSBQYXNzd29yZFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihob3N0OnN0cmluZywgcG9ydDpudW1iZXIsIHVzZXJuYW1lOnN0cmluZywgcGFzc3dvcmQ6c3RyaW5nKVxyXG4gICAge1xyXG4gICAgICAgIC8vIFNldCBhbGwgY2xhc3MgcHJvcGVydGllc1xyXG4gICAgICAgIHRoaXMuaG9zdCA9IGhvc3Q7XHJcbiAgICAgICAgdGhpcy5wb3J0ID0gcG9ydDtcclxuICAgICAgICB0aGlzLnVzZXJuYW1lID0gdXNlcm5hbWU7XHJcbiAgICAgICAgdGhpcy5wYXNzd29yZCA9IHBhc3N3b3JkO1xyXG4gICAgICAgIHRoaXMucG9vbCA9IHRoaXMuaW5pdERiQ29ubmVjdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgLyoqXHJcbiAgICAgKiBDUlVEIG1ldGhvZCB0byByZXR1cm4gYWxsIEFydGlzdHMuXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBDYWxsYmFjayBmdW5jdGlvbiB3aXRoIGFuIEFycmF5IG9mIHR5cGUgQXJ0aXN0LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZmluZEFydGlzdHMoY2FsbGJhY2s6IGFueSlcclxuICAgIHtcclxuICAgICAgICAvLyBMaXN0IG9mIEFydGlzdCB0byByZXR1cm5cclxuICAgICAgICBsZXQgYXJ0aXN0czpBcnRpc3RbXSA9IFtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEdldCBhIHBvb2xlZCBjb25uZWN0aW9uIHRvIHRoZSBkYXRhYmFzZSwgcnVuIHRoZSBxdWVyeSB0byBnZXQgYWxsIHRoZSBkaXN0aW5jdCBBcnRpc3RzLCBhbmQgcmV0dXJuIHRoZSBMaXN0IG9mIEFydGlzdHNcclxuICAgICAgICB0aGlzLnBvb2wuZ2V0Q29ubmVjdGlvbihmdW5jdGlvbihlcnI6YW55LCBjb25uZWN0aW9uOmFueSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIFRocm93IGVycm9yIGlmIGFuIGVycm9yXHJcbiAgICAgICAgICAgIGlmIChlcnIpIHRocm93IGVyclxyXG5cclxuICAgICAgICAgICAgLy8gUnVuIHF1ZXJ5ICAgIFxyXG4gICAgICAgICAgICBjb25uZWN0aW9uLnF1ZXJ5KCdTRUxFQ1QgZGlzdGluY3QgQVJUSVNUIEZST00gQUxCVU0nLCBmdW5jdGlvbiAoZXJyOmFueSwgcm93czphbnksIGZpZWxkczphbnkpIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBSZWxlYXNlIGNvbm5lY3Rpb24gaW4gdGhlIHBvb2xcclxuICAgICAgICAgICAgICAgIGNvbm5lY3Rpb24ucmVsZWFzZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFRocm93IGVycm9yIGlmIGFuIGVycm9yXHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnJcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gTG9vcCBvdmVyIHJlc3VsdCBzZXQgYW5kIHNhdmUgdGhlIEFydGlzdCBOYW1lIGluIHRoZSBMaXN0IG9mIEFydGlzdHNcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgeD0wO3ggPCByb3dzLmxlbmd0aDsrK3gpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJ0aXN0cy5wdXNoKG5ldyBBcnRpc3QoeCwgcm93c1t4XS5BUlRJU1QpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gRG8gYSBjYWxsYmFjayB0byByZXR1cm4gdGhlIHJlc3VsdHNcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGFydGlzdHMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgIH1cclxuXHJcbiAgICAgLyoqXHJcbiAgICAgKiBDUlVEIG1ldGhvZCB0byByZXR1cm4gYWxsIEFsYnVtcyBmb3IgYW4gYXJ0aXN0LlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gYXJ0aXN0IE5hbWUgb2YgdGhlIEFydGlzdCB0byByZXRyaWV2ZSBBbGJ1bXMgZm9yLlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uIHdpdGggYW4gQXJyYXkgb2YgdHlwZSBBbGJ1bS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGZpbmRBbGJ1bXMoYXJ0aXN0OnN0cmluZywgY2FsbGJhY2s6IGFueSlcclxuICAgIHtcclxuICAgICAgICAgLy8gTGlzdCBvZiBBbGJ1bXMgdG8gcmV0dXJuXHJcbiAgICAgICAgIGxldCBhbGJ1bXM6QWxidW1bXSA9IFtdO1xyXG5cclxuICAgICAgICAvLyBHZXQgcG9vbGVkIGRhdGFiYXNlIGNvbm5lY3Rpb24gYW5kIHJ1biBxdWVyaWVzICAgXHJcbiAgICAgICAgdGhpcy5wb29sLmdldENvbm5lY3Rpb24oYXN5bmMgZnVuY3Rpb24oZXJyOmFueSwgY29ubmVjdGlvbjphbnkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBSZWxlYXNlIGNvbm5lY3Rpb24gaW4gdGhlIHBvb2xcclxuICAgICAgICAgICAgY29ubmVjdGlvbi5yZWxlYXNlKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBUaHJvdyBlcnJvciBpZiBhbiBlcnJvclxyXG4gICAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcblxyXG4gICAgICAgICAgICAvLyBVc2UgUHJvbWlzZnkgVXRpbCB0byBtYWtlIGFuIGFzeW5jIGZ1bmN0aW9uIGFuZCBydW4gcXVlcnkgdG8gZ2V0IGFsbCBBbGJ1bXMgZm9yIHNwZWNpZmljIEFydGlzdFxyXG4gICAgICAgICAgICBjb25uZWN0aW9uLnF1ZXJ5ID0gdXRpbC5wcm9taXNpZnkoY29ubmVjdGlvbi5xdWVyeSk7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQxID0gYXdhaXQgY29ubmVjdGlvbi5xdWVyeSgnU0VMRUNUICogRlJPTSBBTEJVTSBXSEVSRSBBUlRJU1Q9PyBPUkRFUiBCWSBZRUFSLCBUSVRMRScsIFthcnRpc3RdKTtcclxuICAgICAgICAgICAgZm9yKGxldCB4PTA7eCA8IHJlc3VsdDEubGVuZ3RoOysreClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgIC8vIFVzZSBQcm9taXNmeSBVdGlsIHRvIG1ha2UgYW4gYXN5bmMgZnVuY3Rpb24gYW5kIHJ1biBxdWVyeSB0byBnZXQgYWxsIFRyYWNrcyBmb3IgdGhpcyBBbGJ1bVxyXG4gICAgICAgICAgICAgICAgbGV0IGFsYnVtSWQgPSByZXN1bHQxW3hdLklEO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRyYWNrczpUcmFja1tdID0gW107XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0MiA9IGF3YWl0IGNvbm5lY3Rpb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gVFJBQ0sgV0hFUkUgQUxCVU1fSUQ9PycsIFthbGJ1bUlkXSk7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IHk9MDt5IDwgcmVzdWx0Mi5sZW5ndGg7Kyt5KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYWNrcy5wdXNoKG5ldyBUcmFjayhyZXN1bHQyW3ldLklELCByZXN1bHQyW3ldLk5VTUJFUiwgcmVzdWx0Mlt5XS5USVRMRSwgcmVzdWx0Mlt5XS5MWVJJQ1MsIHJlc3VsdDJbeV0uVklERU9fVVJMKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQWRkIEFsYnVtIGFuZCBpdHMgVHJhY2tzIHRvIHRoZSBsaXN0XHJcbiAgICAgICAgICAgICAgICBhbGJ1bXMucHVzaChuZXcgQWxidW0ocmVzdWx0MVt4XS5JRCwgcmVzdWx0MVt4XS5USVRMRSwgcmVzdWx0MVt4XS5BUlRJU1QsIHJlc3VsdDFbeF0uREVTQ1JJUFRJT04sIHJlc3VsdDFbeF0uWUVBUiwgcmVzdWx0MVt4XS5JTUFHRV9OQU1FLCB0cmFja3MpKTsgXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIERvIGEgY2FsbGJhY2sgdG8gcmV0dXJuIHRoZSByZXN1bHRzXHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGFsYnVtcyk7XHJcbiAgICAgICAgIH0pO1xyXG4gICAgfSAgICAgICAgICAgIFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ1JVRCBtZXRob2QgdG8gcmV0dXJuIGFsbCBBbGJ1bXMuXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBDYWxsYmFjayBmdW5jdGlvbiB3aXRoIGFuIEFycmF5IG9mIHR5cGUgQWxidW0uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBmaW5kQWxsQWxidW1zKGNhbGxiYWNrOiBhbnkpXHJcbiAgICB7XHJcbiAgICAgICAgIC8vIExpc3Qgb2YgQWxidW1zIHRvIHJldHVyblxyXG4gICAgICAgICBsZXQgYWxidW1zOkFsYnVtW10gPSBbXTtcclxuXHJcbiAgICAgICAgLy8gR2V0IHBvb2xlZCBkYXRhYmFzZSBjb25uZWN0aW9uIGFuZCBydW4gcXVlcmllcyAgIFxyXG4gICAgICAgIHRoaXMucG9vbC5nZXRDb25uZWN0aW9uKGFzeW5jIGZ1bmN0aW9uKGVycjphbnksIGNvbm5lY3Rpb246YW55KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gUmVsZWFzZSBjb25uZWN0aW9uIGluIHRoZSBwb29sXHJcbiAgICAgICAgICAgIGNvbm5lY3Rpb24ucmVsZWFzZSgpO1xyXG5cclxuICAgICAgICAgICAgLy8gVGhyb3cgZXJyb3IgaWYgYW4gZXJyb3JcclxuICAgICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG5cclxuICAgICAgICAgICAgLy8gVXNlIFByb21pc2Z5IFV0aWwgdG8gbWFrZSBhbiBhc3luYyBmdW5jdGlvbiBhbmQgcnVuIHF1ZXJ5IHRvIGdldCBhbGwgQWxidW1zXHJcbiAgICAgICAgICAgIGNvbm5lY3Rpb24ucXVlcnkgPSB1dGlsLnByb21pc2lmeShjb25uZWN0aW9uLnF1ZXJ5KTtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDEgPSBhd2FpdCBjb25uZWN0aW9uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIEFMQlVNIE9SREVSIEJZIFlFQVIsIFRJVExFJyk7XHJcbiAgICAgICAgICAgIGZvcihsZXQgeD0wO3ggPCByZXN1bHQxLmxlbmd0aDsrK3gpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAvLyBVc2UgUHJvbWlzZnkgVXRpbCB0byBtYWtlIGFuIGFzeW5jIGZ1bmN0aW9uIGFuZCBydW4gcXVlcnkgdG8gZ2V0IGFsbCBUcmFja3MgZm9yIHRoaXMgQWxidW1cclxuICAgICAgICAgICAgICAgIGxldCBhbGJ1bUlkID0gcmVzdWx0MVt4XS5JRDtcclxuICAgICAgICAgICAgICAgIGxldCB0cmFja3M6VHJhY2tbXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdDIgPSBhd2FpdCBjb25uZWN0aW9uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIFRSQUNLIFdIRVJFIEFMQlVNX0lEPT8nLCBbYWxidW1JZF0pO1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCB5PTA7eSA8IHJlc3VsdDIubGVuZ3RoOysreSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0cmFja3MucHVzaChuZXcgVHJhY2socmVzdWx0Mlt5XS5JRCwgcmVzdWx0Mlt5XS5OVU1CRVIsIHJlc3VsdDJbeV0uVElUTEUsIHJlc3VsdDJbeV0uTFlSSUNTLCByZXN1bHQyW3ldLlZJREVPX1VSTCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIEFkZCBBbGJ1bSBhbmQgaXRzIFRyYWNrcyB0byB0aGUgbGlzdFxyXG4gICAgICAgICAgICAgICAgYWxidW1zLnB1c2gobmV3IEFsYnVtKHJlc3VsdDFbeF0uSUQsIHJlc3VsdDFbeF0uVElUTEUsIHJlc3VsdDFbeF0uQVJUSVNULCByZXN1bHQxW3hdLkRFU0NSSVBUSU9OLCByZXN1bHQxW3hdLllFQVIsIHJlc3VsdDFbeF0uSU1BR0VfTkFNRSwgdHJhY2tzKSk7IFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBEbyBhIGNhbGxiYWNrIHRvIHJldHVybiB0aGUgcmVzdWx0c1xyXG4gICAgICAgICAgICBjYWxsYmFjayhhbGJ1bXMpO1xyXG4gICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENSVUQgbWV0aG9kIHRvIHNlYXJjaGVzIGZvciBhbGwgQWxidW1zIGJ5IGEgd2lsZGFyZCBzZWFyY2ggaW4gQXJ0aXN0LlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gc2VhcmNoIHdpbGRjYXJkIEFydGlzdCB0byBzZWFyY2ggQWxidW1zIGZvci5cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBDYWxsYmFjayBmdW5jdGlvbiB3aXRoIGFuIEFycmF5IG9mIHR5cGUgQWxidW0uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBmaW5kQWxidW1zQnlBcnRpc3Qoc2VhcmNoOnN0cmluZywgY2FsbGJhY2s6IGFueSlcclxuICAgIHtcclxuICAgICAgICAgLy8gTGlzdCBvZiBBbGJ1bXMgdG8gcmV0dXJuXHJcbiAgICAgICAgIGxldCBhbGJ1bXM6QWxidW1bXSA9IFtdO1xyXG5cclxuICAgICAgICAvLyBHZXQgcG9vbGVkIGRhdGFiYXNlIGNvbm5lY3Rpb24gYW5kIHJ1biBxdWVyaWVzICAgXHJcbiAgICAgICAgdGhpcy5wb29sLmdldENvbm5lY3Rpb24oYXN5bmMgZnVuY3Rpb24oZXJyOmFueSwgY29ubmVjdGlvbjphbnkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBSZWxlYXNlIGNvbm5lY3Rpb24gaW4gdGhlIHBvb2xcclxuICAgICAgICAgICAgY29ubmVjdGlvbi5yZWxlYXNlKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBUaHJvdyBlcnJvciBpZiBhbiBlcnJvclxyXG4gICAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcblxyXG4gICAgICAgICAgICAvLyBVc2UgUHJvbWlzZnkgVXRpbCB0byBtYWtlIGFuIGFzeW5jIGZ1bmN0aW9uIGFuZCBydW4gcXVlcnkgdG8gZ2V0IGFsbCBBbGJ1bXMgZm9yIHNlYXJjaCBwYXJ0aWFsIEFydGlzdFxyXG4gICAgICAgICAgICBjb25uZWN0aW9uLnF1ZXJ5ID0gdXRpbC5wcm9taXNpZnkoY29ubmVjdGlvbi5xdWVyeSk7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQxID0gYXdhaXQgY29ubmVjdGlvbi5xdWVyeShcIlNFTEVDVCAqIEZST00gQUxCVU0gV0hFUkUgQVJUSVNUIExJS0UgPyBPUkRFUiBCWSBZRUFSLCBUSVRMRVwiLCBbJyUnICsgc2VhcmNoICsgJyUnXSk7XHJcbiAgICAgICAgICAgIGZvcihsZXQgeD0wO3ggPCByZXN1bHQxLmxlbmd0aDsrK3gpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAvLyBVc2UgUHJvbWlzZnkgVXRpbCB0byBtYWtlIGFuIGFzeW5jIGZ1bmN0aW9uIGFuZCBydW4gcXVlcnkgdG8gZ2V0IGFsbCBUcmFja3MgZm9yIHRoaXMgQWxidW1cclxuICAgICAgICAgICAgICAgIGxldCBhbGJ1bUlkID0gcmVzdWx0MVt4XS5JRDtcclxuICAgICAgICAgICAgICAgIGxldCB0cmFja3M6VHJhY2tbXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdDIgPSBhd2FpdCBjb25uZWN0aW9uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIFRSQUNLIFdIRVJFIEFMQlVNX0lEPT8nLCBbYWxidW1JZF0pO1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCB5PTA7eSA8IHJlc3VsdDIubGVuZ3RoOysreSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0cmFja3MucHVzaChuZXcgVHJhY2socmVzdWx0Mlt5XS5JRCwgcmVzdWx0Mlt5XS5OVU1CRVIsIHJlc3VsdDJbeV0uVElUTEUsIHJlc3VsdDJbeV0uTFlSSUNTLCByZXN1bHQyW3ldLlZJREVPX1VSTCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIEFkZCBBbGJ1bSBhbmQgaXRzIFRyYWNrcyB0byB0aGUgbGlzdFxyXG4gICAgICAgICAgICAgICAgYWxidW1zLnB1c2gobmV3IEFsYnVtKHJlc3VsdDFbeF0uSUQsIHJlc3VsdDFbeF0uVElUTEUsIHJlc3VsdDFbeF0uQVJUSVNULCByZXN1bHQxW3hdLkRFU0NSSVBUSU9OLCByZXN1bHQxW3hdLllFQVIsIHJlc3VsdDFbeF0uSU1BR0VfTkFNRSwgdHJhY2tzKSk7IFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBEbyBhIGNhbGxiYWNrIHRvIHJldHVybiB0aGUgcmVzdWx0c1xyXG4gICAgICAgICAgICBjYWxsYmFjayhhbGJ1bXMpO1xyXG4gICAgICAgICB9KTtcclxuICAgIH0gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgKiBDUlVEIG1ldGhvZCB0byBzZWFyY2hlcyBmb3IgYWxsIEFsYnVtcyBieSBhIHdpbGRjYXJkIHNlcmFjaCBpbiBEZXNjcmlwdGlvbi5cclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHNlYXJjaCB3aWxkY2FyZCBEZXNjcmlwdGlvbiB0byBzZWFyY2ggQWxidW1zIGZvci5cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBDYWxsYmFjayBmdW5jdGlvbiB3aXRoIGFuIEFycmF5IG9mIHR5cGUgQWxidW0uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBmaW5kQWxidW1zQnlEZXNjcmlwdGlvbihzZWFyY2g6c3RyaW5nLCBjYWxsYmFjazogYW55KVxyXG4gICAge1xyXG4gICAgICAgICAvLyBMaXN0IG9mIEFsYnVtcyB0byByZXR1cm5cclxuICAgICAgICAgbGV0IGFsYnVtczpBbGJ1bVtdID0gW107XHJcblxyXG4gICAgICAgIC8vIEdldCBwb29sZWQgZGF0YWJhc2UgY29ubmVjdGlvbiBhbmQgcnVuIHF1ZXJpZXMgICBcclxuICAgICAgICB0aGlzLnBvb2wuZ2V0Q29ubmVjdGlvbihhc3luYyBmdW5jdGlvbihlcnI6YW55LCBjb25uZWN0aW9uOmFueSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIFJlbGVhc2UgY29ubmVjdGlvbiBpbiB0aGUgcG9vbFxyXG4gICAgICAgICAgICBjb25uZWN0aW9uLnJlbGVhc2UoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFRocm93IGVycm9yIGlmIGFuIGVycm9yXHJcbiAgICAgICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuXHJcbiAgICAgICAgICAgIC8vIFVzZSBQcm9taXNmeSBVdGlsIHRvIG1ha2UgYW4gYXN5bmMgZnVuY3Rpb24gYW5kIHJ1biBxdWVyeSB0byBnZXQgYWxsIEFsYnVtcyBmb3Igc2VhcmNoIHBhcnRpYWwgQXJ0aXN0XHJcbiAgICAgICAgICAgIGNvbm5lY3Rpb24ucXVlcnkgPSB1dGlsLnByb21pc2lmeShjb25uZWN0aW9uLnF1ZXJ5KTtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDEgPSBhd2FpdCBjb25uZWN0aW9uLnF1ZXJ5KFwiU0VMRUNUICogRlJPTSBBTEJVTSBXSEVSRSBERVNDUklQVElPTiBMSUtFID8gT1JERVIgQlkgWUVBUiwgVElUTEVcIiwgWyclJyArIHNlYXJjaCArICclJ10pO1xyXG4gICAgICAgICAgICBmb3IobGV0IHg9MDt4IDwgcmVzdWx0MS5sZW5ndGg7Kyt4KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgLy8gVXNlIFByb21pc2Z5IFV0aWwgdG8gbWFrZSBhbiBhc3luYyBmdW5jdGlvbiBhbmQgcnVuIHF1ZXJ5IHRvIGdldCBhbGwgVHJhY2tzIGZvciB0aGlzIEFsYnVtXHJcbiAgICAgICAgICAgICAgICBsZXQgYWxidW1JZCA9IHJlc3VsdDFbeF0uSUQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHJhY2tzOlRyYWNrW10gPSBbXTtcclxuICAgICAgICAgICAgICAgIGxldCByZXN1bHQyID0gYXdhaXQgY29ubmVjdGlvbi5xdWVyeSgnU0VMRUNUICogRlJPTSBUUkFDSyBXSEVSRSBBTEJVTV9JRD0/JywgW2FsYnVtSWRdKTtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgeT0wO3kgPCByZXN1bHQyLmxlbmd0aDsrK3kpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhY2tzLnB1c2gobmV3IFRyYWNrKHJlc3VsdDJbeV0uSUQsIHJlc3VsdDJbeV0uTlVNQkVSLCByZXN1bHQyW3ldLlRJVExFLCByZXN1bHQyW3ldLkxZUklDUywgcmVzdWx0Mlt5XS5WSURFT19VUkwpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBZGQgQWxidW0gYW5kIGl0cyBUcmFja3MgdG8gdGhlIGxpc3RcclxuICAgICAgICAgICAgICAgIGFsYnVtcy5wdXNoKG5ldyBBbGJ1bShyZXN1bHQxW3hdLklELCByZXN1bHQxW3hdLlRJVExFLCByZXN1bHQxW3hdLkFSVElTVCwgcmVzdWx0MVt4XS5ERVNDUklQVElPTiwgcmVzdWx0MVt4XS5ZRUFSLCByZXN1bHQxW3hdLklNQUdFX05BTUUsIHRyYWNrcykpOyBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gRG8gYSBjYWxsYmFjayB0byByZXR1cm4gdGhlIHJlc3VsdHNcclxuICAgICAgICAgICAgY2FsbGJhY2soYWxidW1zKTtcclxuICAgICAgICAgfSk7XHJcbiAgICB9ICAgICAgICAgICAgXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDUlVEIG1ldGhvZCB0byByZXR1cm4gYW4gQWxidW0uXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBhbGJ1bUlkIEFsYnVtIElEIHRvIHJldHJpZXZlIEFsYnVtIGZvci5cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBDYWxsYmFjayBmdW5jdGlvbiB3aXRoIGFuIEFycmF5IG9mIHR5cGUgQWxidW0uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBmaW5kQWxidW0oYWxidW1JZDpudW1iZXIsIGNhbGxiYWNrOiBhbnkpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gR2V0IHBvb2xlZCBkYXRhYmFzZSBjb25uZWN0aW9uIGFuZCBydW4gcXVlcmllcyAgIFxyXG4gICAgICAgIHRoaXMucG9vbC5nZXRDb25uZWN0aW9uKGFzeW5jIGZ1bmN0aW9uKGVycjphbnksIGNvbm5lY3Rpb246YW55KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gUmVsZWFzZSBjb25uZWN0aW9uIGluIHRoZSBwb29sXHJcbiAgICAgICAgICAgIGNvbm5lY3Rpb24ucmVsZWFzZSgpO1xyXG5cclxuICAgICAgICAgICAgLy8gVGhyb3cgZXJyb3IgaWYgYW4gZXJyb3JcclxuICAgICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG5cclxuICAgICAgICAgICAgLy8gVXNlIFByb21pc2Z5IFV0aWwgdG8gbWFrZSBhbiBhc3luYyBmdW5jdGlvbiBhbmQgcnVuIHF1ZXJ5IHRvIGdldCBhbGwgQWxidW1zIGZvciBzcGVjaWZpYyBBcnRpc3RcclxuICAgICAgICAgICAgY29ubmVjdGlvbi5xdWVyeSA9IHV0aWwucHJvbWlzaWZ5KGNvbm5lY3Rpb24ucXVlcnkpO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MSA9IGF3YWl0IGNvbm5lY3Rpb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gQUxCVU0gV0hFUkUgSUQ9PycsIFthbGJ1bUlkXSk7XHJcbiAgICAgICAgICAgIGlmKHJlc3VsdDEubGVuZ3RoICE9IDEpXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFVzZSBQcm9taXNmeSBVdGlsIHRvIG1ha2UgYW4gYXN5bmMgZnVuY3Rpb24gYW5kIHJ1biBxdWVyeSB0byBnZXQgYWxsIFRyYWNrcyBmb3IgdGhpcyBBbGJ1bVxyXG4gICAgICAgICAgICBsZXQgdHJhY2tzOlRyYWNrW10gPSBbXTtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDIgPSBhd2FpdCBjb25uZWN0aW9uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIFRSQUNLIFdIRVJFIEFMQlVNX0lEPT8nLCBbYWxidW1JZF0pO1xyXG4gICAgICAgICAgICBmb3IobGV0IHk9MDt5IDwgcmVzdWx0Mi5sZW5ndGg7Kyt5KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0cmFja3MucHVzaChuZXcgVHJhY2socmVzdWx0Mlt5XS5JRCwgcmVzdWx0Mlt5XS5OVU1CRVIsIHJlc3VsdDJbeV0uVElUTEUsIHJlc3VsdDJbeV0uTFlSSUNTLCByZXN1bHQyW3ldLlZJREVPX1VSTCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgYW4gQWxidW0gYW5kIGl0cyBUcmFja3MgZm9yIHJldHVyblxyXG4gICAgICAgICAgICBsZXQgYWxidW0gPSBuZXcgQWxidW0ocmVzdWx0MVswXS5JRCwgcmVzdWx0MVswXS5USVRMRSwgcmVzdWx0MVswXS5BUlRJU1QsIHJlc3VsdDFbMF0uREVTQ1JJUFRJT04sIHJlc3VsdDFbMF0uWUVBUiwgcmVzdWx0MVswXS5JTUFHRV9OQU1FLCB0cmFja3MpOyBcclxuXHJcbiAgICAgICAgICAgIC8vIERvIGEgY2FsbGJhY2sgdG8gcmV0dXJuIHRoZSByZXN1bHRzXHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGFsYnVtKTtcclxuICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDUlVEIG1ldGhvZCB0byBjcmVhdGUgYW4gQWxidW0uXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBhbGJ1bSBBbGJ1bSB0byBpbnNlcnQuXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgQ2FsbGJhY2sgZnVuY3Rpb24gd2l0aCAtMSBpZiBhbiBlcnJvciBlbHNlIEFsYnVtIElEIGNyZWF0ZWQuICBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNyZWF0ZShhbGJ1bTpBbGJ1bSwgY2FsbGJhY2s6IGFueSlcclxuICAgIHtcclxuICAgICAgICAvLyBHZXQgcG9vbGVkIGRhdGFiYXNlIGNvbm5lY3Rpb24gYW5kIHJ1biBxdWVyaWVzICAgXHJcbiAgICAgICAgdGhpcy5wb29sLmdldENvbm5lY3Rpb24oYXN5bmMgZnVuY3Rpb24oZXJyOmFueSwgY29ubmVjdGlvbjphbnkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBSZWxlYXNlIGNvbm5lY3Rpb24gaW4gdGhlIHBvb2xcclxuICAgICAgICAgICAgY29ubmVjdGlvbi5yZWxlYXNlKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBUaHJvdyBlcnJvciBpZiBhbiBlcnJvclxyXG4gICAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcblxyXG4gICAgICAgICAgICAvLyBVc2UgUHJvbWlzZnkgVXRpbCB0byBtYWtlIGFuIGFzeW5jIGZ1bmN0aW9uIGFuZCBpbnNlcnQgQWxidW1cclxuICAgICAgICAgICAgY29ubmVjdGlvbi5xdWVyeSA9IHV0aWwucHJvbWlzaWZ5KGNvbm5lY3Rpb24ucXVlcnkpO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MSA9IGF3YWl0IGNvbm5lY3Rpb24ucXVlcnkoJ0lOU0VSVCBJTlRPIEFMQlVNIChUSVRMRSwgQVJUSVNULCBERVNDUklQVElPTiwgWUVBUiwgSU1BR0VfTkFNRSkgVkFMVUVTKD8sPyw/LD8sPyknLCBbYWxidW0uVGl0bGUsIGFsYnVtLkFydGlzdCwgYWxidW0uRGVzY3JpcHRpb24sIGFsYnVtLlllYXIsIGFsYnVtLkltYWdlXSk7XHJcbiAgICAgICAgICAgIGlmKHJlc3VsdDEuYWZmZWN0ZWRSb3dzICE9IDEpXHJcbiAgICAgICAgICAgICAgIGNhbGxiYWNrKC0xKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFVzZSBQcm9taXNmeSBVdGlsIHRvIG1ha2UgYW4gYXN5bmMgZnVuY3Rpb24gYW5kIHJ1biBxdWVyeSB0byBpbnNlcnQgYWxsIFRyYWNrcyBmb3IgdGhpcyBBbGJ1bVxyXG4gICAgICAgICAgICBsZXQgYWxidW1JZCA9IHJlc3VsdDEuaW5zZXJ0SWQ7XHJcbiAgICAgICAgICAgIGZvcihsZXQgeT0wO3kgPCBhbGJ1bS5UcmFja3MubGVuZ3RoOysreSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdDIgPSBhd2FpdCBjb25uZWN0aW9uLnF1ZXJ5KCdJTlNFUlQgSU5UTyBUUkFDSyAoQUxCVU1fSUQsIFRJVExFLCBOVU1CRVIsIFZJREVPX1VSTCkgVkFMVUVTKD8sPyw/LD8pJywgW2FsYnVtSWQsIGFsYnVtLlRyYWNrc1t5XS5UaXRsZSwgYWxidW0uVHJhY2tzW3ldLk51bWJlciwgYWxidW0uVHJhY2tzW3ldLlZpZGVvXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIERvIGEgY2FsbGJhY2sgdG8gcmV0dXJuIHRoZSByZXN1bHRzXHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGFsYnVtSWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ1JVRCBtZXRob2QgdG8gdXBkYXRlIGFuIEFsYnVtLlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gYWxidW0gQWxidW0gdG8gdXBkYXRlLlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uIHdpdGggbnVtYmVyIG9mIHJvd3MgdXBkYXRlZC4gIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdXBkYXRlKGFsYnVtOkFsYnVtLCBjYWxsYmFjazogYW55KVxyXG4gICAge1xyXG4gICAgICAgICAvLyBHZXQgcG9vbGVkIGRhdGFiYXNlIGNvbm5lY3Rpb24gYW5kIHJ1biBxdWVyaWVzICAgXHJcbiAgICAgICAgIHRoaXMucG9vbC5nZXRDb25uZWN0aW9uKGFzeW5jIGZ1bmN0aW9uKGVycjphbnksIGNvbm5lY3Rpb246YW55KVxyXG4gICAgICAgICB7XHJcbiAgICAgICAgICAgICAvLyBSZWxlYXNlIGNvbm5lY3Rpb24gaW4gdGhlIHBvb2xcclxuICAgICAgICAgICAgIGNvbm5lY3Rpb24ucmVsZWFzZSgpO1xyXG4gXHJcbiAgICAgICAgICAgICAvLyBUaHJvdyBlcnJvciBpZiBhbiBlcnJvclxyXG4gICAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiBcclxuICAgICAgICAgICAgIC8vIFVzZSBQcm9taXNmeSBVdGlsIHRvIG1ha2UgYW4gYXN5bmMgZnVuY3Rpb24gYW5kIHVwZGF0ZSBBbGJ1bVxyXG4gICAgICAgICAgICAgbGV0IGNoYW5nZXMgPSAwO1xyXG4gICAgICAgICAgICAgY29ubmVjdGlvbi5xdWVyeSA9IHV0aWwucHJvbWlzaWZ5KGNvbm5lY3Rpb24ucXVlcnkpO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MSA9IGF3YWl0IGNvbm5lY3Rpb24ucXVlcnkoJ1VQREFURSBBTEJVTSBTRVQgVElUTEU9PywgQVJUSVNUPT8sIERFU0NSSVBUSU9OPT8sIFlFQVI9PywgSU1BR0VfTkFNRT0/IFdIRVJFIElEPT8nLCBbYWxidW0uVGl0bGUsIGFsYnVtLkFydGlzdCwgYWxidW0uRGVzY3JpcHRpb24sIGFsYnVtLlllYXIsIGFsYnVtLkltYWdlLCBhbGJ1bS5JZF0pO1xyXG4gICAgICAgICAgICBpZihyZXN1bHQxLmNoYW5nZWRSb3dzICE9IDApXHJcbiAgICAgICAgICAgICAgICArK2NoYW5nZXM7XHJcblxyXG4gICAgICAgICAgICAgLy8gVXNlIFByb21pc2Z5IFV0aWwgdG8gbWFrZSBhbiBhc3luYyBmdW5jdGlvbiBhbmQgcnVuIHF1ZXJ5IHRvIHVwZGF0ZSBhbGwgVHJhY2tzIGZvciB0aGlzIEFsYnVtXHJcbiAgICAgICAgICAgICBmb3IobGV0IHk9MDt5IDwgYWxidW0uVHJhY2tzLmxlbmd0aDsrK3kpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0MiA9IGF3YWl0IGNvbm5lY3Rpb24ucXVlcnkoJ1VQREFURSBUUkFDSyBTRVQgVElUTEU9PywgTlVNQkVSPT8sIFZJREVPX1VSTD0/IFdIRVJFIElEPT8gQU5EIEFMQlVNX0lEPT8nLCBbYWxidW0uVHJhY2tzW3ldLlRpdGxlLCBhbGJ1bS5UcmFja3NbeV0uTnVtYmVyLCBhbGJ1bS5UcmFja3NbeV0uVmlkZW8sIGFsYnVtLlRyYWNrc1t5XS5JZCwgYWxidW0uSWRdKTtcclxuICAgICAgICAgICAgICAgICBpZihyZXN1bHQyLmNoYW5nZWRSb3dzICE9IDApXHJcbiAgICAgICAgICAgICAgICAgICAgKytjaGFuZ2VzO1xyXG4gICAgICAgICAgICB9XHJcbiBcclxuICAgICAgICAgICAgLy8gRG8gYSBjYWxsYmFjayB0byByZXR1cm4gdGhlIHJlc3VsdHNcclxuICAgICAgICAgICAgY2FsbGJhY2soY2hhbmdlcyk7XHJcbiAgICAgICAgIH0pO1xyXG4gICAgIH1cclxuXHJcbiAgICAgLyoqXHJcbiAgICAgKiBDUlVEIG1ldGhvZCB0byBkZWxldGUgYW4gQWxidW0uXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBhbGJ1bSBBbGJ1bSBJRCB0byBkZWxldGUuXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgQ2FsbGJhY2sgZnVuY3Rpb24gd2l0aCBudW1iZXIgb2Ygcm93cyBkZWxldGVkLiAgXHJcbiAgICAgKiAqL1xyXG4gICAgcHVibGljIGRlbGV0ZShhbGJ1bUlkOm51bWJlciwgY2FsbGJhY2s6IGFueSlcclxuICAgIHtcclxuICAgICAgICAvLyBHZXQgcG9vbGVkIGRhdGFiYXNlIGNvbm5lY3Rpb24gYW5kIHJ1biBxdWVyaWVzICAgXHJcbiAgICAgICAgdGhpcy5wb29sLmdldENvbm5lY3Rpb24oYXN5bmMgZnVuY3Rpb24oZXJyOmFueSwgY29ubmVjdGlvbjphbnkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBSZWxlYXNlIGNvbm5lY3Rpb24gaW4gdGhlIHBvb2xcclxuICAgICAgICAgICAgY29ubmVjdGlvbi5yZWxlYXNlKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBUaHJvdyBlcnJvciBpZiBhbiBlcnJvclxyXG4gICAgICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuXHJcbiAgICAgICAgICAgIC8vIFVzZSBQcm9taXNmeSBVdGlsIHRvIG1ha2UgYW4gYXN5bmMgZnVuY3Rpb24gYW5kIHJ1biBxdWVyeSB0byBkZWxldGUgdGhlIHRyYWNrcyBmb3IgYW4gQWxidW1cclxuICAgICAgICAgICAgbGV0IGNoYW5nZXMgPSAwO1xyXG4gICAgICAgICAgICBjb25uZWN0aW9uLnF1ZXJ5ID0gdXRpbC5wcm9taXNpZnkoY29ubmVjdGlvbi5xdWVyeSk7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQxID0gYXdhaXQgY29ubmVjdGlvbi5xdWVyeSgnREVMRVRFIEZST00gVFJBQ0sgV0hFUkUgQUxCVU1fSUQ9PycsIFthbGJ1bUlkXSk7XHJcbiAgICAgICAgICAgIGNoYW5nZXMgPSBjaGFuZ2VzICsgcmVzdWx0MS5hZmZlY3RlZFJvd3M7XHJcblxyXG4gICAgICAgICAgICAvLyBVc2UgUHJvbWlzZnkgVXRpbCB0byBtYWtlIGFuIGFzeW5jIGZ1bmN0aW9uIGFuZCBydW4gcXVlcnkgdG8gZGVsZXRlIHRoZSBBbGJ1bVxyXG4gICAgICAgICAgICBsZXQgcmVzdWx0MiA9IGF3YWl0IGNvbm5lY3Rpb24ucXVlcnkoJ0RFTEVURSBGUk9NIEFMQlVNIFdIRVJFIElEPT8nLCBbYWxidW1JZF0pO1xyXG4gICAgICAgICAgICBjaGFuZ2VzID0gY2hhbmdlcyArIHJlc3VsdDIuYWZmZWN0ZWRSb3dzO1xyXG5cclxuICAgICAgICAgICAgLy8gRG8gYSBjYWxsYmFjayB0byByZXR1cm4gdGhlIHJlc3VsdHNcclxuICAgICAgICAgICAgY2FsbGJhY2soY2hhbmdlcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8qICoqKioqKioqKioqKioqKiogUHJpdmF0ZSBIZWxwZXIgTWV0aG9kcyAqKioqKioqKioqKioqKioqICovXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcml2YXRlIGhlbHBlciBtZXRob2QgdG8gaW5pdGlhbGllIGEgRGF0YWJhc2UgQ29ubmVjdGlvblxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGluaXREYkNvbm5lY3Rpb24oKTphbnlcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbXlzcWwuY3JlYXRlUG9vbCh7aG9zdDogdGhpcy5ob3N0LCBwb3J0OiB0aGlzLnBvcnQsIHVzZXI6IHRoaXMudXNlcm5hbWUsIHBhc3N3b3JkOiB0aGlzLnBhc3N3b3JkLCBkYXRhYmFzZTogdGhpcy5zY2hlbWEsIGNvbm5lY3Rpb25MaW1pdDogMTB9KTtcclxuICAgIH1cclxufSJdfQ==