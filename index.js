/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/Modules/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Modules/Client.ts":
/*!*******************************!*\
  !*** ./src/Modules/Client.ts ***!
  \*******************************/
/*! exports provided: Client */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Client\", function() { return Client; });\n/* harmony import */ var _ChrisTalman_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ChrisTalman/request */ \"@ChrisTalman/request\");\n/* harmony import */ var _ChrisTalman_request__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ChrisTalman_request__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _Methods_Payments__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Methods/Payments */ \"./src/Modules/Methods/Payments/index.ts\");\n/* harmony import */ var _Methods_RedirectFlows__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Methods/RedirectFlows */ \"./src/Modules/Methods/RedirectFlows/index.ts\");\n\r\n\r\n\r\n\r\nclass Client {\r\n    constructor({ subdomain, accessToken, version }) {\r\n        this.payments = new _Methods_Payments__WEBPACK_IMPORTED_MODULE_1__[\"Payments\"]({ client: this });\r\n        this.redirectFlows = new _Methods_RedirectFlows__WEBPACK_IMPORTED_MODULE_2__[\"RedirectFlows\"]({ client: this });\r\n        this.subdomain = subdomain;\r\n        this.accessToken = accessToken;\r\n        this.version = version;\r\n        const url = 'https://' + this.subdomain + '.gocardless.com';\r\n        this.domain = new _ChrisTalman_request__WEBPACK_IMPORTED_MODULE_0__[\"Domain\"]({\r\n            path: url,\r\n            auth: () => 'Bearer ' + accessToken,\r\n            headers: {\r\n                'GoCardless-Version': version\r\n            }\r\n        });\r\n    }\r\n    ;\r\n}\r\n;\r\n\n\n//# sourceURL=webpack:///./src/Modules/Client.ts?");

/***/ }),

/***/ "./src/Modules/Methods/Payments/Create.ts":
/*!************************************************!*\
  !*** ./src/Modules/Methods/Payments/Create.ts ***!
  \************************************************/
/*! exports provided: create */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"create\", function() { return create; });\n\r\n;\r\n;\r\n;\r\n;\r\nasync function create({ amount, currency, metadata, mandate }) {\r\n    const body = {\r\n        amount,\r\n        currency,\r\n        metadata,\r\n        links: {\r\n            mandate\r\n        }\r\n    };\r\n    const result = await this._client.domain.request({\r\n        method: 'POST',\r\n        path: '/payments',\r\n        body,\r\n        jsonResponseSuccess: true,\r\n        jsonResponseError: true\r\n    });\r\n    if (result.json === undefined)\r\n        throw new Error('JSON undefined');\r\n    return result.json;\r\n}\r\n;\r\n\n\n//# sourceURL=webpack:///./src/Modules/Methods/Payments/Create.ts?");

/***/ }),

/***/ "./src/Modules/Methods/Payments/index.ts":
/*!***********************************************!*\
  !*** ./src/Modules/Methods/Payments/index.ts ***!
  \***********************************************/
/*! exports provided: Payments */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Payments\", function() { return Payments; });\n/* harmony import */ var src_Modules_Resource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/Modules/Resource */ \"./src/Modules/Resource.ts\");\n/* harmony import */ var _Create__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Create */ \"./src/Modules/Methods/Payments/Create.ts\");\n\r\n\r\n\r\n;\r\nclass Payments extends src_Modules_Resource__WEBPACK_IMPORTED_MODULE_0__[\"Resource\"] {\r\n    constructor() {\r\n        super(...arguments);\r\n        this.create = _Create__WEBPACK_IMPORTED_MODULE_1__[\"create\"];\r\n    }\r\n}\r\n;\r\n\n\n//# sourceURL=webpack:///./src/Modules/Methods/Payments/index.ts?");

/***/ }),

/***/ "./src/Modules/Methods/RedirectFlows/Actions/Complete.ts":
/*!***************************************************************!*\
  !*** ./src/Modules/Methods/RedirectFlows/Actions/Complete.ts ***!
  \***************************************************************/
/*! exports provided: complete */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"complete\", function() { return complete; });\n\r\n;\r\n;\r\n;\r\nasync function complete({ redirectFlowId, session_token }) {\r\n    const body = {\r\n        session_token\r\n    };\r\n    const result = await this._client.domain.request({\r\n        method: 'POST',\r\n        path: '/redirect_flows/' + redirectFlowId + '/actions/complete',\r\n        body,\r\n        jsonResponseSuccess: true,\r\n        jsonResponseError: true\r\n    });\r\n    if (result.json === undefined)\r\n        throw new Error('JSON undefined');\r\n    return result.json;\r\n}\r\n;\r\n\n\n//# sourceURL=webpack:///./src/Modules/Methods/RedirectFlows/Actions/Complete.ts?");

/***/ }),

/***/ "./src/Modules/Methods/RedirectFlows/Actions/index.ts":
/*!************************************************************!*\
  !*** ./src/Modules/Methods/RedirectFlows/Actions/index.ts ***!
  \************************************************************/
/*! exports provided: Actions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Actions\", function() { return Actions; });\n/* harmony import */ var src_Modules_Resource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/Modules/Resource */ \"./src/Modules/Resource.ts\");\n/* harmony import */ var _Complete__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Complete */ \"./src/Modules/Methods/RedirectFlows/Actions/Complete.ts\");\n\r\n\r\n\r\n;\r\nclass Actions extends src_Modules_Resource__WEBPACK_IMPORTED_MODULE_0__[\"Resource\"] {\r\n    constructor() {\r\n        super(...arguments);\r\n        this.complete = _Complete__WEBPACK_IMPORTED_MODULE_1__[\"complete\"];\r\n    }\r\n}\r\n;\r\n\n\n//# sourceURL=webpack:///./src/Modules/Methods/RedirectFlows/Actions/index.ts?");

/***/ }),

/***/ "./src/Modules/Methods/RedirectFlows/Create.ts":
/*!*****************************************************!*\
  !*** ./src/Modules/Methods/RedirectFlows/Create.ts ***!
  \*****************************************************/
/*! exports provided: create */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"create\", function() { return create; });\n\r\n;\r\n;\r\n;\r\nasync function create({ sessionToken, successRedirectUrl, description }) {\r\n    const body = {\r\n        session_token: sessionToken,\r\n        success_redirect_url: successRedirectUrl,\r\n        description\r\n    };\r\n    const result = await this._client.domain.request({\r\n        method: 'POST',\r\n        path: '/redirect_flows',\r\n        body,\r\n        jsonResponseSuccess: true,\r\n        jsonResponseError: true\r\n    });\r\n    if (result.json === undefined)\r\n        throw new Error('JSON undefined');\r\n    return result.json;\r\n}\r\n;\r\n\n\n//# sourceURL=webpack:///./src/Modules/Methods/RedirectFlows/Create.ts?");

/***/ }),

/***/ "./src/Modules/Methods/RedirectFlows/index.ts":
/*!****************************************************!*\
  !*** ./src/Modules/Methods/RedirectFlows/index.ts ***!
  \****************************************************/
/*! exports provided: RedirectFlows */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RedirectFlows\", function() { return RedirectFlows; });\n/* harmony import */ var src_Modules_Resource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/Modules/Resource */ \"./src/Modules/Resource.ts\");\n/* harmony import */ var _Create__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Create */ \"./src/Modules/Methods/RedirectFlows/Create.ts\");\n/* harmony import */ var _Actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Actions */ \"./src/Modules/Methods/RedirectFlows/Actions/index.ts\");\n\r\n\r\n\r\n\r\n;\r\nclass RedirectFlows extends src_Modules_Resource__WEBPACK_IMPORTED_MODULE_0__[\"Resource\"] {\r\n    constructor({ client }) {\r\n        super({ client });\r\n        this.create = _Create__WEBPACK_IMPORTED_MODULE_1__[\"create\"];\r\n        this.actions = new _Actions__WEBPACK_IMPORTED_MODULE_2__[\"Actions\"]({ client });\r\n    }\r\n    ;\r\n}\r\n;\r\n\n\n//# sourceURL=webpack:///./src/Modules/Methods/RedirectFlows/index.ts?");

/***/ }),

/***/ "./src/Modules/Resource.ts":
/*!*********************************!*\
  !*** ./src/Modules/Resource.ts ***!
  \*********************************/
/*! exports provided: Resource */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Resource\", function() { return Resource; });\n\r\nclass Resource {\r\n    constructor({ client }) {\r\n        this._client = client;\r\n    }\r\n    ;\r\n}\r\n;\r\n\n\n//# sourceURL=webpack:///./src/Modules/Resource.ts?");

/***/ }),

/***/ "./src/Modules/index.ts":
/*!******************************!*\
  !*** ./src/Modules/index.ts ***!
  \******************************/
/*! exports provided: Client */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Client */ \"./src/Modules/Client.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Client\", function() { return _Client__WEBPACK_IMPORTED_MODULE_0__[\"Client\"]; });\n\n\r\n;\r\n\r\n\n\n//# sourceURL=webpack:///./src/Modules/index.ts?");

/***/ }),

/***/ "@ChrisTalman/request":
/*!***************************************!*\
  !*** external "@ChrisTalman/request" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@ChrisTalman/request\");\n\n//# sourceURL=webpack:///external_%22@ChrisTalman/request%22?");

/***/ })

/******/ });