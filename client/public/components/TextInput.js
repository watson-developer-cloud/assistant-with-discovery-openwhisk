'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};/*
This implementation was modeled after the input in
https://conversation-simple.mybluemix.net/
 */var _react=require('react');var _react2=_interopRequireDefault(_react);var _classnames=require('classnames');var _classnames2=_interopRequireDefault(_classnames);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var padding=2;exports.default=_react2.default.createClass({displayName:'TextInput',// all html input[type="text"] properties are valid
propTypes:{onInput:_react2.default.PropTypes.func},getDefaultProps:function getDefaultProps(){return{id:'textinput-'+Math.round(Math.random()*1000),placeholder:'Type Something',onInput:function onInput(){}};},getInitialState:function getInitialState(){return{inputWidth:padding};},onInput:function onInput(e){var dummy=e.target.nextSibling;// this is a hack for when you type space,
// input text gets shifted because of mismatched width between
// dummy and real input.  Char 'r' is used because it has the same
// length as a char ' ' in order for the width of the space to count.
// eslint-disable-next-line
e.target.value=e.target.value.replace(/\t/g,' ');// change tabs to spaces
var text=e.target.value.replace(/\s/g,'r');dummy.textContent=text;this.setState({inputWidth:dummy.offsetWidth+padding});if(this.props.onInput){this.props.onInput.call(this,e);}},render:function render(){return _react2.default.createElement('label',{// eslint-disable-next-line react/prop-types
htmlFor:this.props.id,className:'text-input'},_react2.default.createElement('input',_extends({type:'text',className:(0,_classnames2.default)('text-input--input','base--input',{empty:this.state.inputWidth===padding}),style:{width:this.state.inputWidth>padding?this.state.inputWidth+'px':'100%'}},this.props,{onInput:this.onInput})),_react2.default.createElement('span',{className:'text-input--dummy'}));}});module.exports=exports['default'];
//# sourceMappingURL=TextInput.js.map
