"use strict";

exports.__esModule = true;
exports.TYPE = void 0;
exports.area = area;
exports["default"] = void 0;
exports.intersects = intersects;
exports.methods = void 0;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var MARGIN = 12;
var marginToPercentage = function marginToPercentage(container) {
  return {
    marginX: MARGIN / container.width * 100,
    marginY: MARGIN / container.height * 100
  };
};
var TYPE = exports.TYPE = "DRAWING";
function intersects(_ref, geometry, container) {
  var x = _ref.x,
    y = _ref.y;
  var _marginToPercentage = marginToPercentage(container),
    marginX = _marginToPercentage.marginX,
    marginY = _marginToPercentage.marginY;
  if (x < geometry.boxX - marginX) {
    return false;
  }
  if (y < geometry.boxY - marginY) {
    return false;
  }
  if (x > geometry.boxX + geometry.width + marginX) {
    return false;
  }
  if (y > geometry.boxY + geometry.height + marginY) {
    return false;
  }
  return true;
}
function area(geometry, container) {
  return geometry.height * geometry.width;
}
var methods = exports.methods = {
  onMouseDown: function onMouseDown(annotation, e) {
    return onPointerDown(annotation, e);
  },
  onMouseMove: function onMouseMove(annotation, e) {
    return onPointerMove(annotation, e);
  },
  onMouseUp: function onMouseUp(annotation, e) {
    return onPointerUp(annotation, e);
  },
  onTouchStart: function onTouchStart(annotation, e) {
    return onPointerDown(annotation, e);
  },
  onTouchMove: function onTouchMove(annotation, e) {
    return onPointerMove(annotation, e);
  },
  onTouchEnd: function onTouchEnd(annotation, e) {
    return onPointerUp(annotation, e);
  }
};
function onPointerDown(annotation, e) {
  if (!annotation.geometry) {
    var newPoint = relativeCoordinatesForEvent(e);
    return _extends({}, annotation, {
      selection: _extends({}, annotation.selection, {
        showEditor: false,
        mode: "SELECTING"
      }),
      geometry: {
        coordinates: [],
        x: newPoint.x,
        y: newPoint.y,
        boxX: newPoint.x,
        boxY: newPoint.y,
        height: 0,
        width: 0,
        type: TYPE
      },
      data: {
        id: Math.random()
      }
    });
  } else {
    return {};
  }
}
function onPointerMove(annotation, e) {
  if (annotation.selection && annotation.selection.mode === "SELECTING") {
    var _annotation$geometry = annotation.geometry,
      y = _annotation$geometry.y,
      boxX = _annotation$geometry.boxX,
      boxY = _annotation$geometry.boxY,
      height = _annotation$geometry.height,
      width = _annotation$geometry.width;
    var newPoint = relativeCoordinatesForEvent(e);
    if (newPoint.y < y || !y) {
      y = newPoint.y;
    }
    if (newPoint.y < boxY || !boxY) {
      height += boxY - newPoint.y;
      boxY = newPoint.y;
    } else if (newPoint.y > boxY + height || !height) {
      height = newPoint.y - boxY;
    }
    if (newPoint.x < boxX || !boxX) {
      width += boxX - newPoint.x;
      boxX = newPoint.x;
    } else if (newPoint.x > boxX + width || !width) {
      width = newPoint.x - boxX;
    }
    var middle = annotation.geometry.coordinates.reduce(function (prev, curr) {
      return {
        x: prev.x + curr.x,
        y: prev.y + curr.y
      };
    }, {
      x: 0,
      y: 0
    });
    middle.x /= annotation.geometry.coordinates.length;
    middle.y /= annotation.geometry.coordinates.length;
    return _extends({}, annotation, {
      selection: _extends({}, annotation.selection, {
        showEditor: false,
        mode: "SELECTING"
      }),
      geometry: {
        coordinates: [].concat(annotation.geometry.coordinates, [relativeCoordinatesForEvent(e)]),
        x: middle.x,
        y: y,
        boxX: boxX,
        boxY: boxY,
        height: height,
        width: width,
        type: TYPE
      }
    });
  } else {
    return annotation;
  }
}
function onPointerUp(annotation, e) {
  if (annotation.selection) {
    var geometry = annotation.geometry;
    if (!geometry) {
      return {};
    }
    switch (annotation.selection.mode) {
      case "SELECTING":
        return _extends({}, annotation, {
          selection: _extends({}, annotation.selection, {
            showEditor: true,
            mode: "EDITING"
          })
        });
      default:
        break;
    }
  }
  return annotation;
}
function relativeCoordinatesForEvent(e) {
  if (isTouchEvent(e)) {
    if (isValidTouchEvent(e)) {
      e.preventDefault();
      return getTouchRelativeCoordinates(e);
    } else {
      return {
        x: 0,
        y: 0
      };
    }
  } else {
    return getMouseRelativeCoordinates(e);
  }
}
var isTouchEvent = function isTouchEvent(e) {
  return e.targetTouches !== undefined;
};
var isValidTouchEvent = function isValidTouchEvent(e) {
  return e.targetTouches.length === 1;
};
var getTouchRelativeCoordinates = function getTouchRelativeCoordinates(e) {
  var touch = e.targetTouches[0];
  var boundingRect = e.currentTarget.getBoundingClientRect();
  var offsetX = touch.pageX - boundingRect.left;
  var offsetY = touch.pageY - (boundingRect.top + window.scrollY);
  return {
    x: offsetX / boundingRect.width * 100,
    y: offsetY / boundingRect.height * 100
  };
};
function getMouseRelativeCoordinates(e) {
  return {
    x: e.nativeEvent.offsetX / e.currentTarget.offsetWidth * 100,
    y: e.nativeEvent.offsetY / e.currentTarget.offsetHeight * 100
  };
}
var _default = exports["default"] = {
  TYPE: TYPE,
  intersects: intersects,
  area: area,
  methods: methods
};