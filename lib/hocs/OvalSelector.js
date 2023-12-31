"use strict";

exports.__esModule = true;
exports.TYPE = void 0;
exports.area = area;
exports["default"] = void 0;
exports.intersects = intersects;
exports.methods = void 0;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var square = function square(n) {
  return Math.pow(n, 2);
};
var getCoordPercentage = function getCoordPercentage(e) {
  return {
    x: e.nativeEvent.offsetX / e.currentTarget.offsetWidth * 100,
    y: e.nativeEvent.offsetY / e.currentTarget.offsetHeight * 100
  };
};
var TYPE = exports.TYPE = 'OVAL';
function intersects(_ref, geometry) {
  var x = _ref.x,
    y = _ref.y;
  var rx = geometry.width / 2;
  var ry = geometry.height / 2;
  var h = geometry.x + rx;
  var k = geometry.y + ry;
  var value = square(x - h) / square(rx) + square(y - k) / square(ry);
  return value <= 1;
}
function area(geometry) {
  var rx = geometry.width / 2;
  var ry = geometry.height / 2;
  return Math.PI * rx * ry;
}
var methods = exports.methods = {
  onMouseDown: function onMouseDown(annotation, e) {
    if (!annotation.selection) {
      var _getCoordPercentage = getCoordPercentage(e),
        anchorX = _getCoordPercentage.x,
        anchorY = _getCoordPercentage.y;
      return _extends({}, annotation, {
        selection: _extends({}, annotation.selection, {
          mode: 'SELECTING',
          anchorXpX: e.nativeEvent.offsetX,
          anchorYpX: e.nativeEvent.offsetY,
          anchorX: anchorX,
          anchorY: anchorY
        })
      });
    } else {
      return {};
    }
    return annotation;
  },
  onMouseUp: function onMouseUp(annotation, e) {
    if (annotation.selection) {
      var selection = annotation.selection,
        geometry = annotation.geometry;
      if (!geometry) {
        return {};
      }
      switch (annotation.selection.mode) {
        case 'SELECTING':
          return _extends({}, annotation, {
            selection: _extends({}, annotation.selection, {
              showEditor: true,
              mode: 'EDITING'
            })
          });
        default:
          break;
      }
    }
    return annotation;
  },
  onMouseMove: function onMouseMove(annotation, e) {
    if (annotation.selection && annotation.selection.mode === 'SELECTING') {
      var _annotation$selection = annotation.selection,
        anchorX = _annotation$selection.anchorX,
        anchorY = _annotation$selection.anchorY,
        anchorXpX = _annotation$selection.anchorXpX,
        anchorYpX = _annotation$selection.anchorYpX;
      var _getCoordPercentage2 = getCoordPercentage(e),
        newX = _getCoordPercentage2.x,
        newY = _getCoordPercentage2.y;
      var width = newX - anchorX;
      var height = newY - anchorY;
      return _extends({}, annotation, {
        geometry: _extends({}, annotation.geometry, {
          type: TYPE,
          x: width > 0 ? anchorX : newX,
          y: height > 0 ? anchorY : newY,
          width: Math.abs(width),
          height: Math.abs(height)
        })
      });
    }
    return annotation;
  }
};
var _default = exports["default"] = {
  TYPE: TYPE,
  intersects: intersects,
  area: area,
  methods: methods
};