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
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/script.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../test-components/src/print-ex.js":
/*!******************************************!*\
  !*** ../test-components/src/print-ex.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (() => {\n    \"use strict\";\n    console.log('Hello from external package');\n});\n\n//# sourceURL=webpack:///../test-components/src/print-ex.js?");

/***/ }),

/***/ "./js/dir1/print-hello.js":
/*!********************************!*\
  !*** ./js/dir1/print-hello.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (() => {\n    \"use strict\";\n    console.log('Hello from Dir 1');\n});\n\n//# sourceURL=webpack:///./js/dir1/print-hello.js?");

/***/ }),

/***/ "./js/dir2/print-test.js":
/*!*******************************!*\
  !*** ./js/dir2/print-test.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (() => {\n    \"use strict\";\n    console.log('Test from Dir 2');\n});\n\n//# sourceURL=webpack:///./js/dir2/print-test.js?");

/***/ }),

/***/ "./js/dir3/print-goodbye.js":
/*!**********************************!*\
  !*** ./js/dir3/print-goodbye.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (() => {\n    \"use strict\";\n    console.log('Goodbye from Dir 3');\n});\n\n//# sourceURL=webpack:///./js/dir3/print-goodbye.js?");

/***/ }),

/***/ "./js/script.js":
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var example_components_print_hello_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! example-components/print-hello.js */ \"./js/dir1/print-hello.js\");\n/* harmony import */ var example_components_print_test_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! example-components/print-test.js */ \"./js/dir2/print-test.js\");\n/* harmony import */ var example_components_print_ex_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! example-components/print-ex.js */ \"../test-components/src/print-ex.js\");\n/* harmony import */ var second_comp_package_print_goodbye_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! second-comp-package/print-goodbye.js */ \"./js/dir3/print-goodbye.js\");\n\n\n\n\n\nObject(example_components_print_hello_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\nObject(example_components_print_test_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\nObject(second_comp_package_print_goodbye_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"])();\nObject(example_components_print_ex_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])();\n\n//# sourceURL=webpack:///./js/script.js?");

/***/ })

/******/ });