function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React, { useLayoutEffect, useState } from 'react';
import { Rnd as Resizable } from 'react-rnd';
import { percentageToPx, pxToPercentage } from '../../utils/offsetCoordinates';
function Oval(props) {
  var _props$annotation = props.annotation,
    geometry = _props$annotation.geometry,
    data = _props$annotation.data,
    selection = _props$annotation.selection;
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
  if (!geometry) return null;
  return /*#__PURE__*/React.createElement(Resizable, {
    className: props.className,
    style: _extends({
      border: 'dashed 3px red',
      borderRadius: '100%',
      boxSizing: 'border-box',
      transition: 'box-shadow 0.21s ease-in-out',
      position: 'absolute',
      backgroundColor: 'rgba(128, 0, 0, 0.5)',
      zIndex: 100
    }, props.style),
    bounds: "parent",
    size: {
      height: geometry.height + "%",
      width: geometry.width + "%"
    },
    onDragStop: function onDragStop(e, d, k) {
      var newX = pxToPercentage(d.x, parentDimensions.width);
      var newY = pxToPercentage(d.y, parentDimensions.height);
      geometry.x = newX;
      geometry.y = newY;
      props.onChange(props.annotation);
      props.onModify(props.annotation);
    },
    enableResizing: !selection ? {
      bottom: true,
      top: true,
      left: true,
      right: true
    } : false,
    disableDragging: !selection ? false : true,
    onResizeStop: function onResizeStop(e, direction, ref, d) {
      var newWidth = parseFloat(ref.style.width);
      var newHeight = parseFloat(ref.style.height);
      geometry.width = newWidth;
      geometry.height = newHeight;
      props.onChange(props.annotation);
      props.onModify(props.annotation);
    },
    position: {
      y: percentageToPx(geometry.y, parentDimensions.height),
      x: percentageToPx(geometry.x, parentDimensions.width)
    }
  });
}
Oval.defaultProps = {
  className: '',
  style: {}
};
export default Oval;