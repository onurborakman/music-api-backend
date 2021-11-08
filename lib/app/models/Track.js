"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Track = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var Track = /*#__PURE__*/function () {
  function Track(id, number, title, lyrics, video) {
    (0, _classCallCheck2["default"])(this, Track);
    (0, _defineProperty2["default"])(this, "id", -1);
    (0, _defineProperty2["default"])(this, "number", -1);
    (0, _defineProperty2["default"])(this, "title", "");
    (0, _defineProperty2["default"])(this, "lyrics", "");
    (0, _defineProperty2["default"])(this, "video", "");
    this.id = id;
    this.number = number;
    this.title = title;
    this.lyrics = lyrics;
    this.video = video;
  }

  (0, _createClass2["default"])(Track, [{
    key: "Id",
    get: function get() {
      return this.id;
    },
    set: function set(id) {
      this.id = id;
    }
  }, {
    key: "Number",
    get: function get() {
      return this.number;
    },
    set: function set(number) {
      this.number = number;
    }
  }, {
    key: "Title",
    get: function get() {
      return this.title;
    },
    set: function set(title) {
      this.title = title;
    }
  }, {
    key: "Lyrics",
    get: function get() {
      return this.lyrics;
    },
    set: function set(lyrics) {
      this.lyrics = lyrics;
    }
  }, {
    key: "Video",
    get: function get() {
      return this.video;
    },
    set: function set(video) {
      this.video = video;
    }
  }]);
  return Track;
}();

exports.Track = Track;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9tb2RlbHMvVHJhY2sudHMiXSwibmFtZXMiOlsiVHJhY2siLCJpZCIsIm51bWJlciIsInRpdGxlIiwibHlyaWNzIiwidmlkZW8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztJQUFhQSxLO0FBT1QsaUJBQVlDLEVBQVosRUFBdUJDLE1BQXZCLEVBQXNDQyxLQUF0QyxFQUFvREMsTUFBcEQsRUFBbUVDLEtBQW5FLEVBQWdGO0FBQUE7QUFBQSxpREFOM0QsQ0FBQyxDQU0wRDtBQUFBLHFEQUx2RCxDQUFDLENBS3NEO0FBQUEsb0RBSnhELEVBSXdEO0FBQUEscURBSHZELEVBR3VEO0FBQUEsb0RBRnhELEVBRXdEO0FBQzVFLFNBQUtKLEVBQUwsR0FBVUEsRUFBVjtBQUNBLFNBQUtDLE1BQUwsR0FBY0EsTUFBZDtBQUNBLFNBQUtDLEtBQUwsR0FBYUEsS0FBYjtBQUNBLFNBQUtDLE1BQUwsR0FBY0EsTUFBZDtBQUNBLFNBQUtDLEtBQUwsR0FBYUEsS0FBYjtBQUNIOzs7O1NBRUQsZUFBZTtBQUNYLGFBQU8sS0FBS0osRUFBWjtBQUNILEs7U0FDRCxhQUFPQSxFQUFQLEVBQWlCO0FBQ2IsV0FBS0EsRUFBTCxHQUFVQSxFQUFWO0FBQ0g7OztTQUVELGVBQW1CO0FBQ2YsYUFBTyxLQUFLQyxNQUFaO0FBQ0gsSztTQUNELGFBQVdBLE1BQVgsRUFBeUI7QUFDckIsV0FBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0g7OztTQUVELGVBQWtCO0FBQ2QsYUFBTyxLQUFLQyxLQUFaO0FBQ0gsSztTQUNELGFBQVVBLEtBQVYsRUFBdUI7QUFDbkIsV0FBS0EsS0FBTCxHQUFhQSxLQUFiO0FBQ0g7OztTQUNELGVBQW1CO0FBQ2YsYUFBTyxLQUFLQyxNQUFaO0FBQ0gsSztTQUNELGFBQVdBLE1BQVgsRUFBeUI7QUFDckIsV0FBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0g7OztTQUVELGVBQWtCO0FBQ2QsYUFBTyxLQUFLQyxLQUFaO0FBQ0gsSztTQUNELGFBQVVBLEtBQVYsRUFBdUI7QUFDbkIsV0FBS0EsS0FBTCxHQUFhQSxLQUFiO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgVHJhY2t7XHJcbiAgICBwcml2YXRlIGlkOiBudW1iZXIgPSAtMTtcclxuICAgIHByaXZhdGUgbnVtYmVyOiBudW1iZXIgPSAtMTtcclxuICAgIHByaXZhdGUgdGl0bGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwcml2YXRlIGx5cmljczogc3RyaW5nID0gXCJcIjtcclxuICAgIHByaXZhdGUgdmlkZW86IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoaWQ6bnVtYmVyLCBudW1iZXI6bnVtYmVyLCB0aXRsZTpzdHJpbmcsIGx5cmljczpzdHJpbmcsIHZpZGVvOnN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMubnVtYmVyID0gbnVtYmVyO1xyXG4gICAgICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICB0aGlzLmx5cmljcyA9IGx5cmljcztcclxuICAgICAgICB0aGlzLnZpZGVvID0gdmlkZW87XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IElkKCk6bnVtYmVye1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlkO1xyXG4gICAgfVxyXG4gICAgc2V0IElkKGlkOm51bWJlcil7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBOdW1iZXIoKTpudW1iZXJ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubnVtYmVyO1xyXG4gICAgfVxyXG4gICAgc2V0IE51bWJlcihudW1iZXI6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLm51bWJlciA9IG51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgVGl0bGUoKTpzdHJpbmd7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGl0bGU7XHJcbiAgICB9XHJcbiAgICBzZXQgVGl0bGUodGl0bGU6c3RyaW5nKXtcclxuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICB9XHJcbiAgICBnZXQgTHlyaWNzKCk6c3RyaW5ne1xyXG4gICAgICAgIHJldHVybiB0aGlzLmx5cmljcztcclxuICAgIH1cclxuICAgIHNldCBMeXJpY3MobHlyaWNzOnN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5seXJpY3MgPSBseXJpY3M7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IFZpZGVvKCk6c3RyaW5ne1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZpZGVvO1xyXG4gICAgfVxyXG4gICAgc2V0IFZpZGVvKHZpZGVvOnN0cmluZyl7XHJcbiAgICAgICAgdGhpcy52aWRlbyA9IHZpZGVvO1xyXG4gICAgfVxyXG59Il19