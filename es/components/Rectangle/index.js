import React, { useState, useLayoutEffect } from 'react';
import { Rnd as Resizable } from 'react-rnd';
import { percentageToPx, pxToPercentage } from '../../utils/offsetCoordinates';
function Rectangle(props) {
  var _props$annotation = props.annotation,
    geometry = _props$annotation.geometry,
    data = _props$annotation.data;
  if (!geometry) return null;
  var _useState = useState({
      width: 0,
      height: 0
    }),
    parentDimensions = _useState[0],
    setParentDimensions = _useState[1];
  useLayoutEffect(function () {
    var updateParentDimensions = function updateParentDimensions() {
      var parent = document.getElementById('container-RIA');
      var _parent$getBoundingCl = parent.getBoundingClientRect(),
        width = _parent$getBoundingCl.width,
        height = _parent$getBoundingCl.height;
      setParentDimensions({
        width: width,
        height: height
      });
    };
    var handleLoad = function handleLoad() {
      updateParentDimensions();
    };
    updateParentDimensions();
    window.addEventListener('load', handleLoad);
    window.addEventListener('resize', handleLoad);
    return function () {
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('resize', handleLoad);
    };
  }, [props.annotation]);
  if (!parentDimensions.width || !parentDimensions.height) {
    return null;
  }
  var handleDragStop = function handleDragStop(e, d) {
    var newX = pxToPercentage(d.x, parentDimensions.width);
    var newY = pxToPercentage(d.y, parentDimensions.height);
    geometry.x = newX;
    geometry.y = newY;
    props.onChange(props.annotation);
    props.onModify(props.annotation);
  };
  var handleResizeStop = function handleResizeStop(e, direction, ref, d) {
    var newWidth = parseFloat(ref.style.width);
    var newHeight = parseFloat(ref.style.height);
    geometry.width = newWidth;
    geometry.height = newHeight;
    props.onChange(props.annotation);
    props.onModify(props.annotation);
  };
  return /*#__PURE__*/React.createElement(Resizable, {
    id: data.id,
    style: {
      border: 'dashed 3px red',
      pointerEvents: 'auto',
      zIndex: 10,
      backgroundColor: 'rgba(128, 0, 0, 0.5)'
    },
    bounds: "parent",
    onDragStop: handleDragStop,
    onResizeStop: handleResizeStop,
    position: {
      y: percentageToPx(geometry.y, parentDimensions.height),
      x: percentageToPx(geometry.x, parentDimensions.width)
    },
    size: {
      width: geometry.width + "%",
      height: geometry.height + "%"
    }
  });
}
Rectangle.defaultProps = {
  className: '',
  style: {}
};
export default Rectangle;