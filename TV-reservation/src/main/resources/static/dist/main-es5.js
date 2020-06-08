function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"], {
  /***/
  "./$$_lazy_route_resource lazy recursive":
  /*!******************************************************!*\
    !*** ./$$_lazy_route_resource lazy namespace object ***!
    \******************************************************/

  /*! no static exports found */

  /***/
  function $$_lazy_route_resourceLazyRecursive(module, exports) {
    function webpackEmptyAsyncContext(req) {
      // Here Promise.resolve().then() is used instead of new Promise() to prevent
      // uncaught exception popping up in devtools
      return Promise.resolve().then(function () {
        var e = new Error("Cannot find module '" + req + "'");
        e.code = 'MODULE_NOT_FOUND';
        throw e;
      });
    }

    webpackEmptyAsyncContext.keys = function () {
      return [];
    };

    webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
    module.exports = webpackEmptyAsyncContext;
    webpackEmptyAsyncContext.id = "./$$_lazy_route_resource lazy recursive";
    /***/
  },

  /***/
  "./app.module.ts":
  /*!***********************!*\
    !*** ./app.module.ts ***!
    \***********************/

  /*! exports provided: tokenGetter, AppModule */

  /***/
  function appModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "tokenGetter", function () {
      return tokenGetter;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AppModule", function () {
      return AppModule;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _js_services_jwtAuthenticationService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./js/services/jwtAuthenticationService */
    "./js/services/jwtAuthenticationService.ts");
    /* harmony import */


    var _js_services_auth_guard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./js/services/auth.guard */
    "./js/services/auth.guard.ts");
    /* harmony import */


    var _views_login_login_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./views/login/login.component */
    "./views/login/login.component.ts");
    /* harmony import */


    var views_homepage_homepage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! views/homepage/homepage */
    "./views/homepage/homepage.ts");
    /* harmony import */


    var _views_playingHall_playingHall__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./views/playingHall/playingHall */
    "./views/playingHall/playingHall.ts");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");
    /* harmony import */


    var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! @angular/platform-browser */
    "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
    /* harmony import */


    var _views_playingHall_subcomponents_moveVariationTree_move_variation_tree_move_variation_tree_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
    /*! ./views/playingHall/subcomponents/moveVariationTree/move-variation-tree/move-variation-tree.component */
    "./views/playingHall/subcomponents/moveVariationTree/move-variation-tree/move-variation-tree.component.ts");
    /* harmony import */


    var _views_lobby_lobby_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
    /*! ./views/lobby/lobby.component */
    "./views/lobby/lobby.component.ts");
    /* harmony import */


    var _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(
    /*! @auth0/angular-jwt */
    "./node_modules/@auth0/angular-jwt/__ivy_ngcc__/fesm2015/auth0-angular-jwt.js");
    /* harmony import */


    var _angular_forms__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(
    /*! @angular/forms */
    "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");

    var appRoutes = [{
      path: 'analyzeGame',
      component: _views_playingHall_playingHall__WEBPACK_IMPORTED_MODULE_5__["PlayingHall"],
      canActivate: [_js_services_auth_guard__WEBPACK_IMPORTED_MODULE_2__["AuthGuard"]]
    }, {
      path: 'playGame/:gameId',
      component: _views_playingHall_playingHall__WEBPACK_IMPORTED_MODULE_5__["PlayingHall"],
      canActivate: [_js_services_auth_guard__WEBPACK_IMPORTED_MODULE_2__["AuthGuard"]]
    }, {
      path: 'observeGame/:observedPlayer',
      component: _views_playingHall_playingHall__WEBPACK_IMPORTED_MODULE_5__["PlayingHall"],
      canActivate: [_js_services_auth_guard__WEBPACK_IMPORTED_MODULE_2__["AuthGuard"]]
    }, {
      path: 'login',
      component: _views_login_login_component__WEBPACK_IMPORTED_MODULE_3__["LoginComponent"]
    }, {
      path: 'lobby',
      component: _views_lobby_lobby_component__WEBPACK_IMPORTED_MODULE_11__["LobbyComponent"],
      canActivate: [_js_services_auth_guard__WEBPACK_IMPORTED_MODULE_2__["AuthGuard"]]
    }, {
      path: '*',
      redirectTo: 'index.html'
    }];

    function tokenGetter() {
      var user = localStorage.getItem('currentUser');
      console.log(user);
      console.log("calling tokenGetter:" + user.jwtToken);
      return user.jwtToken;
    }

    var AppModule = function AppModule() {
      _classCallCheck(this, AppModule);
    };

    AppModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_6__["NgModule"])({
      imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_8__["BrowserModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_13__["FormsModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_13__["ReactiveFormsModule"],
      /* HttpModule, */
      _angular_common_http__WEBPACK_IMPORTED_MODULE_7__["HttpClientModule"],
      /*   HttpClientXsrfModule.withOptions({
          cookieName: 'XSRF-TOKEN',
          headerName: 'X-XSRF-TOKEN'
        }), */
      _angular_router__WEBPACK_IMPORTED_MODULE_9__["RouterModule"].forRoot(appRoutes), _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_12__["JwtModule"].forRoot({
        config: {
          tokenGetter: tokenGetter
        }
      })],
      providers: [_js_services_auth_guard__WEBPACK_IMPORTED_MODULE_2__["AuthGuard"], _js_services_jwtAuthenticationService__WEBPACK_IMPORTED_MODULE_1__["JwtAuthenticationService"], _angular_forms__WEBPACK_IMPORTED_MODULE_13__["FormBuilder"]],
      declarations: [views_homepage_homepage__WEBPACK_IMPORTED_MODULE_4__["HomePageComponent"], _views_playingHall_playingHall__WEBPACK_IMPORTED_MODULE_5__["PlayingHall"], _views_playingHall_subcomponents_moveVariationTree_move_variation_tree_move_variation_tree_component__WEBPACK_IMPORTED_MODULE_10__["MoveVariationTreeComponent"], _views_lobby_lobby_component__WEBPACK_IMPORTED_MODULE_11__["LobbyComponent"], _views_login_login_component__WEBPACK_IMPORTED_MODULE_3__["LoginComponent"]],
      exports: [views_homepage_homepage__WEBPACK_IMPORTED_MODULE_4__["HomePageComponent"]],
      bootstrap: [views_homepage_homepage__WEBPACK_IMPORTED_MODULE_4__["HomePageComponent"]]
    })], AppModule);
    /***/
  },

  /***/
  "./environments/environment.ts":
  /*!*************************************!*\
    !*** ./environments/environment.ts ***!
    \*************************************/

  /*! exports provided: environment */

  /***/
  function environmentsEnvironmentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "environment", function () {
      return environment;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");

    var environment = {
      production: false
    };
    /***/
  },

  /***/
  "./js/chessRules.js":
  /*!**************************!*\
    !*** ./js/chessRules.js ***!
    \**************************/

  /*! no static exports found */

  /***/
  function jsChessRulesJs(module, exports, __webpack_require__) {
    var __WEBPACK_AMD_DEFINE_RESULT__;
    /*
    * Copyright (c) 2016, Jeff Hlywa (jhlywa@gmail.com)
    * All rights reserved.
    *
    * Redistribution and use in source and binary forms, with or without
    * modification, are permitted provided that the following conditions are met:
    *
    * 1. Redistributions of source code must retain the above copyright notice,
    *    this list of conditions and the following disclaimer.
    * 2. Redistributions in binary form must reproduce the above copyright notice,
    *    this list of conditions and the following disclaimer in the documentation
    *    and/or other materials provided with the distribution.
    *
    * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
    * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
    * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
    * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
    * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
    * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
    * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
    * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
    * POSSIBILITY OF SUCH DAMAGE.
    *
    *----------------------------------------------------------------------------*/

    /* minified license below  */

    /* @license
     * Copyright (c) 2016, Jeff Hlywa (jhlywa@gmail.com)
     * Released under the BSD license
     * https://github.com/jhlywa/chess.js/blob/master/LICENSE
     */


    var Chess = function Chess(fen) {
      /* jshint indent: false */
      var BLACK = 'b';
      var WHITE = 'w';
      var EMPTY = -1;
      var PAWN = 'p';
      var KNIGHT = 'n';
      var BISHOP = 'b';
      var ROOK = 'r';
      var QUEEN = 'q';
      var KING = 'k';
      var SYMBOLS = 'pnbrqkPNBRQK';
      var DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      var POSSIBLE_RESULTS = ['1-0', '0-1', '1/2-1/2', '*'];
      var PAWN_OFFSETS = {
        b: [16, 32, 17, 15],
        w: [-16, -32, -17, -15]
      };
      var PIECE_OFFSETS = {
        n: [-18, -33, -31, -14, 18, 33, 31, 14],
        b: [-17, -15, 17, 15],
        r: [-16, 1, 16, -1],
        q: [-17, -16, -15, 1, 17, 16, 15, -1],
        k: [-17, -16, -15, 1, 17, 16, 15, -1]
      };
      var ATTACKS = [20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20, 0, 0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0, 24, 24, 24, 24, 24, 24, 56, 0, 56, 24, 24, 24, 24, 24, 24, 0, 0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0, 20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20];
      var RAYS = [17, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 15, 0, 0, 17, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 17, 0, 0, 0, 0, 16, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 16, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 16, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 16, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 16, 15, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, -15, -16, -17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -15, 0, -16, 0, -17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -15, 0, 0, -16, 0, 0, -17, 0, 0, 0, 0, 0, 0, 0, 0, -15, 0, 0, 0, -16, 0, 0, 0, -17, 0, 0, 0, 0, 0, 0, -15, 0, 0, 0, 0, -16, 0, 0, 0, 0, -17, 0, 0, 0, 0, -15, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, -17, 0, 0, -15, 0, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, 0, -17];
      var SHIFTS = {
        p: 0,
        n: 1,
        b: 2,
        r: 3,
        q: 4,
        k: 5
      };
      var FLAGS = {
        NORMAL: 'n',
        CAPTURE: 'c',
        BIG_PAWN: 'b',
        EP_CAPTURE: 'e',
        PROMOTION: 'p',
        KSIDE_CASTLE: 'k',
        QSIDE_CASTLE: 'q'
      };
      var BITS = {
        NORMAL: 1,
        CAPTURE: 2,
        BIG_PAWN: 4,
        EP_CAPTURE: 8,
        PROMOTION: 16,
        KSIDE_CASTLE: 32,
        QSIDE_CASTLE: 64
      };
      var RANK_1 = 7;
      var RANK_2 = 6;
      var RANK_3 = 5;
      var RANK_4 = 4;
      var RANK_5 = 3;
      var RANK_6 = 2;
      var RANK_7 = 1;
      var RANK_8 = 0;
      var SQUARES = {
        a8: 0,
        b8: 1,
        c8: 2,
        d8: 3,
        e8: 4,
        f8: 5,
        g8: 6,
        h8: 7,
        a7: 16,
        b7: 17,
        c7: 18,
        d7: 19,
        e7: 20,
        f7: 21,
        g7: 22,
        h7: 23,
        a6: 32,
        b6: 33,
        c6: 34,
        d6: 35,
        e6: 36,
        f6: 37,
        g6: 38,
        h6: 39,
        a5: 48,
        b5: 49,
        c5: 50,
        d5: 51,
        e5: 52,
        f5: 53,
        g5: 54,
        h5: 55,
        a4: 64,
        b4: 65,
        c4: 66,
        d4: 67,
        e4: 68,
        f4: 69,
        g4: 70,
        h4: 71,
        a3: 80,
        b3: 81,
        c3: 82,
        d3: 83,
        e3: 84,
        f3: 85,
        g3: 86,
        h3: 87,
        a2: 96,
        b2: 97,
        c2: 98,
        d2: 99,
        e2: 100,
        f2: 101,
        g2: 102,
        h2: 103,
        a1: 112,
        b1: 113,
        c1: 114,
        d1: 115,
        e1: 116,
        f1: 117,
        g1: 118,
        h1: 119
      };
      var ROOKS = {
        w: [{
          square: SQUARES.a1,
          flag: BITS.QSIDE_CASTLE
        }, {
          square: SQUARES.h1,
          flag: BITS.KSIDE_CASTLE
        }],
        b: [{
          square: SQUARES.a8,
          flag: BITS.QSIDE_CASTLE
        }, {
          square: SQUARES.h8,
          flag: BITS.KSIDE_CASTLE
        }]
      };
      var board = new Array(128);
      var kings = {
        w: EMPTY,
        b: EMPTY
      };
      var _turn = WHITE;
      var castling = {
        w: 0,
        b: 0
      };
      var ep_square = EMPTY;
      var half_moves = 0;
      var move_number = 1;
      var _history = [];
      var header = {};
      /* if the user passes in a fen string, load it, else default to
       * starting position
       */

      if (typeof fen === 'undefined') {
        _load(DEFAULT_POSITION);
      } else {
        _load(fen);
      }

      function _clear() {
        board = new Array(128);
        kings = {
          w: EMPTY,
          b: EMPTY
        };
        _turn = WHITE;
        castling = {
          w: 0,
          b: 0
        };
        ep_square = EMPTY;
        half_moves = 0;
        move_number = 1;
        _history = [];
        header = {};
        update_setup(generate_fen());
      }

      function _reset() {
        _load(DEFAULT_POSITION);
      }

      function _load(fen) {
        var tokens = fen.split(/\s+/);
        var position = tokens[0];
        var square = 0;

        if (!_validate_fen(fen).valid) {
          return false;
        }

        _clear();

        for (var i = 0; i < position.length; i++) {
          var piece = position.charAt(i);

          if (piece === '/') {
            square += 8;
          } else if (is_digit(piece)) {
            square += parseInt(piece, 10);
          } else {
            var color = piece < 'a' ? WHITE : BLACK;

            _put({
              type: piece.toLowerCase(),
              color: color
            }, algebraic(square));

            square++;
          }
        }

        _turn = tokens[1];

        if (tokens[2].indexOf('K') > -1) {
          castling.w |= BITS.KSIDE_CASTLE;
        }

        if (tokens[2].indexOf('Q') > -1) {
          castling.w |= BITS.QSIDE_CASTLE;
        }

        if (tokens[2].indexOf('k') > -1) {
          castling.b |= BITS.KSIDE_CASTLE;
        }

        if (tokens[2].indexOf('q') > -1) {
          castling.b |= BITS.QSIDE_CASTLE;
        }

        ep_square = tokens[3] === '-' ? EMPTY : SQUARES[tokens[3]];
        half_moves = parseInt(tokens[4], 10);
        move_number = parseInt(tokens[5], 10);
        update_setup(generate_fen());
        return true;
      }
      /* TODO: this function is pretty much crap - it validates structure but
       * completely ignores content (e.g. doesn't verify that each side has a king)
       * ... we should rewrite this, and ditch the silly error_number field while
       * we're at it
       */


      function _validate_fen(fen) {
        var errors = {
          0: 'No errors.',
          1: 'FEN string must contain six space-delimited fields.',
          2: '6th field (move number) must be a positive integer.',
          3: '5th field (half move counter) must be a non-negative integer.',
          4: '4th field (en-passant square) is invalid.',
          5: '3rd field (castling availability) is invalid.',
          6: '2nd field (side to move) is invalid.',
          7: '1st field (piece positions) does not contain 8 \'/\'-delimited rows.',
          8: '1st field (piece positions) is invalid [consecutive numbers].',
          9: '1st field (piece positions) is invalid [invalid piece].',
          10: '1st field (piece positions) is invalid [row too large].',
          11: 'Illegal en-passant square'
        };
        /* 1st criterion: 6 space-seperated fields? */

        var tokens = fen.split(/\s+/);

        if (tokens.length !== 6) {
          return {
            valid: false,
            error_number: 1,
            error: errors[1]
          };
        }
        /* 2nd criterion: move number field is a integer value > 0? */


        if (isNaN(tokens[5]) || parseInt(tokens[5], 10) <= 0) {
          return {
            valid: false,
            error_number: 2,
            error: errors[2]
          };
        }
        /* 3rd criterion: half move counter is an integer >= 0? */


        if (isNaN(tokens[4]) || parseInt(tokens[4], 10) < 0) {
          return {
            valid: false,
            error_number: 3,
            error: errors[3]
          };
        }
        /* 4th criterion: 4th field is a valid e.p.-string? */


        if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
          return {
            valid: false,
            error_number: 4,
            error: errors[4]
          };
        }
        /* 5th criterion: 3th field is a valid castle-string? */


        if (!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(tokens[2])) {
          return {
            valid: false,
            error_number: 5,
            error: errors[5]
          };
        }
        /* 6th criterion: 2nd field is "w" (white) or "b" (black)? */


        if (!/^(w|b)$/.test(tokens[1])) {
          return {
            valid: false,
            error_number: 6,
            error: errors[6]
          };
        }
        /* 7th criterion: 1st field contains 8 rows? */


        var rows = tokens[0].split('/');

        if (rows.length !== 8) {
          return {
            valid: false,
            error_number: 7,
            error: errors[7]
          };
        }
        /* 8th criterion: every row is valid? */


        for (var i = 0; i < rows.length; i++) {
          /* check for right sum of fields AND not two numbers in succession */
          var sum_fields = 0;
          var previous_was_number = false;

          for (var k = 0; k < rows[i].length; k++) {
            if (!isNaN(rows[i][k])) {
              if (previous_was_number) {
                return {
                  valid: false,
                  error_number: 8,
                  error: errors[8]
                };
              }

              sum_fields += parseInt(rows[i][k], 10);
              previous_was_number = true;
            } else {
              if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
                return {
                  valid: false,
                  error_number: 9,
                  error: errors[9]
                };
              }

              sum_fields += 1;
              previous_was_number = false;
            }
          }

          if (sum_fields !== 8) {
            return {
              valid: false,
              error_number: 10,
              error: errors[10]
            };
          }
        }

        if (tokens[3][1] == '3' && tokens[1] == 'w' || tokens[3][1] == '6' && tokens[1] == 'b') {
          return {
            valid: false,
            error_number: 11,
            error: errors[11]
          };
        }
        /* everything's okay! */


        return {
          valid: true,
          error_number: 0,
          error: errors[0]
        };
      }

      function generate_fen() {
        var empty = 0;
        var fen = '';

        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
          if (board[i] == null) {
            empty++;
          } else {
            if (empty > 0) {
              fen += empty;
              empty = 0;
            }

            var color = board[i].color;
            var piece = board[i].type;
            fen += color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
          }

          if (i + 1 & 0x88) {
            if (empty > 0) {
              fen += empty;
            }

            if (i !== SQUARES.h1) {
              fen += '/';
            }

            empty = 0;
            i += 8;
          }
        }

        var cflags = '';

        if (castling[WHITE] & BITS.KSIDE_CASTLE) {
          cflags += 'K';
        }

        if (castling[WHITE] & BITS.QSIDE_CASTLE) {
          cflags += 'Q';
        }

        if (castling[BLACK] & BITS.KSIDE_CASTLE) {
          cflags += 'k';
        }

        if (castling[BLACK] & BITS.QSIDE_CASTLE) {
          cflags += 'q';
        }
        /* do we have an empty castling flag? */


        cflags = cflags || '-';
        var epflags = ep_square === EMPTY ? '-' : algebraic(ep_square);
        return [fen, _turn, cflags, epflags, half_moves, move_number].join(' ');
      }

      function set_header(args) {
        for (var i = 0; i < args.length; i += 2) {
          if (typeof args[i] === 'string' && typeof args[i + 1] === 'string') {
            header[args[i]] = args[i + 1];
          }
        }

        return header;
      }
      /* called when the initial board setup is changed with put() or remove().
       * modifies the SetUp and FEN properties of the header object.  if the FEN is
       * equal to the default position, the SetUp and FEN are deleted
       * the setup is only updated if history.length is zero, ie moves haven't been
       * made.
       */


      function update_setup(fen) {
        if (_history.length > 0) return;

        if (fen !== DEFAULT_POSITION) {
          header['SetUp'] = '1';
          header['FEN'] = fen;
        } else {
          delete header['SetUp'];
          delete header['FEN'];
        }
      }

      function _get(square) {
        var piece = board[SQUARES[square]];
        return piece ? {
          type: piece.type,
          color: piece.color
        } : null;
      }

      function _put(piece, square) {
        /* check for valid piece object */
        if (!('type' in piece && 'color' in piece)) {
          return false;
        }
        /* check for piece */


        if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) {
          return false;
        }
        /* check for valid square */


        if (!(square in SQUARES)) {
          return false;
        }

        var sq = SQUARES[square];
        /* don't let the user place more than one king */

        if (piece.type == KING && !(kings[piece.color] == EMPTY || kings[piece.color] == sq)) {
          return false;
        }

        board[sq] = {
          type: piece.type,
          color: piece.color
        };

        if (piece.type === KING) {
          kings[piece.color] = sq;
        }

        update_setup(generate_fen());
        return true;
      }

      function _remove(square) {
        var piece = _get(square);

        board[SQUARES[square]] = null;

        if (piece && piece.type === KING) {
          kings[piece.color] = EMPTY;
        }

        update_setup(generate_fen());
        return piece;
      }

      function build_move(board, from, to, flags, promotion) {
        var move = {
          color: _turn,
          from: from,
          to: to,
          flags: flags,
          piece: board[from].type
        };

        if (promotion) {
          move.flags |= BITS.PROMOTION;
          move.promotion = promotion;
        }

        if (board[to]) {
          move.captured = board[to].type;
        } else if (flags & BITS.EP_CAPTURE) {
          move.captured = PAWN;
        }

        return move;
      }

      function generate_moves(options) {
        function add_move(board, moves, from, to, flags) {
          /* if pawn promotion */
          if (board[from].type === PAWN && (rank(to) === RANK_8 || rank(to) === RANK_1)) {
            var pieces = [QUEEN, ROOK, BISHOP, KNIGHT];

            for (var i = 0, len = pieces.length; i < len; i++) {
              moves.push(build_move(board, from, to, flags, pieces[i]));
            }
          } else {
            moves.push(build_move(board, from, to, flags));
          }
        }

        var moves = [];
        var us = _turn;
        var them = swap_color(us);
        var second_rank = {
          b: RANK_7,
          w: RANK_2
        };
        var first_sq = SQUARES.a8;
        var last_sq = SQUARES.h1;
        var single_square = false;
        /* do we want legal moves? */

        var legal = typeof options !== 'undefined' && 'legal' in options ? options.legal : true;
        /* are we generating moves for a single square? */

        if (typeof options !== 'undefined' && 'square' in options) {
          if (options.square in SQUARES) {
            first_sq = last_sq = SQUARES[options.square];
            single_square = true;
          } else {
            /* invalid square */
            return [];
          }
        }

        for (var i = first_sq; i <= last_sq; i++) {
          /* did we run off the end of the board */
          if (i & 0x88) {
            i += 7;
            continue;
          }

          var piece = board[i];

          if (piece == null || piece.color !== us) {
            continue;
          }

          if (piece.type === PAWN) {
            /* single square, non-capturing */
            var square = i + PAWN_OFFSETS[us][0];

            if (board[square] == null) {
              add_move(board, moves, i, square, BITS.NORMAL);
              /* double square */

              var square = i + PAWN_OFFSETS[us][1];

              if (second_rank[us] === rank(i) && board[square] == null) {
                add_move(board, moves, i, square, BITS.BIG_PAWN);
              }
            }
            /* pawn captures */


            for (j = 2; j < 4; j++) {
              var square = i + PAWN_OFFSETS[us][j];
              if (square & 0x88) continue;

              if (board[square] != null && board[square].color === them) {
                add_move(board, moves, i, square, BITS.CAPTURE);
              } else if (square === ep_square) {
                add_move(board, moves, i, ep_square, BITS.EP_CAPTURE);
              }
            }
          } else {
            for (var j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
              var offset = PIECE_OFFSETS[piece.type][j];
              var square = i;

              while (true) {
                square += offset;
                if (square & 0x88) break;

                if (board[square] == null) {
                  add_move(board, moves, i, square, BITS.NORMAL);
                } else {
                  if (board[square].color === us) break;
                  add_move(board, moves, i, square, BITS.CAPTURE);
                  break;
                }
                /* break, if knight or king */


                if (piece.type === 'n' || piece.type === 'k') break;
              }
            }
          }
        }
        /* check for castling if: a) we're generating all moves, or b) we're doing
         * single square move generation on the king's square
         */


        if (!single_square || last_sq === kings[us]) {
          /* king-side castling */
          if (castling[us] & BITS.KSIDE_CASTLE) {
            var castling_from = kings[us];
            var castling_to = castling_from + 2;

            if (board[castling_from + 1] == null && board[castling_to] == null && !attacked(them, kings[us]) && !attacked(them, castling_from + 1) && !attacked(them, castling_to)) {
              add_move(board, moves, kings[us], castling_to, BITS.KSIDE_CASTLE);
            }
          }
          /* queen-side castling */


          if (castling[us] & BITS.QSIDE_CASTLE) {
            var castling_from = kings[us];
            var castling_to = castling_from - 2;

            if (board[castling_from - 1] == null && board[castling_from - 2] == null && board[castling_from - 3] == null && !attacked(them, kings[us]) && !attacked(them, castling_from - 1) && !attacked(them, castling_to)) {
              add_move(board, moves, kings[us], castling_to, BITS.QSIDE_CASTLE);
            }
          }
        }
        /* return all pseudo-legal moves (this includes moves that allow the king
         * to be captured)
         */


        if (!legal) {
          return moves;
        }
        /* filter out illegal moves */


        var legal_moves = [];

        for (var i = 0, len = moves.length; i < len; i++) {
          make_move(moves[i]);

          if (!king_attacked(us)) {
            legal_moves.push(moves[i]);
          }

          undo_move();
        }

        return legal_moves;
      }
      /* convert a move from 0x88 coordinates to Standard Algebraic Notation
       * (SAN)
       *
       * @param {boolean} sloppy Use the sloppy SAN generator to work around over
       * disambiguation bugs in Fritz and Chessbase.  See below:
       *
       * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
       * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
       * 4. ... Ne7 is technically the valid SAN
       */


      function move_to_san(move, sloppy) {
        var output = '';

        if (move.flags & BITS.KSIDE_CASTLE) {
          output = 'O-O';
        } else if (move.flags & BITS.QSIDE_CASTLE) {
          output = 'O-O-O';
        } else {
          var disambiguator = get_disambiguator(move, sloppy);

          if (move.piece !== PAWN) {
            output += move.piece.toUpperCase() + disambiguator;
          }

          if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
            if (move.piece === PAWN) {
              output += algebraic(move.from)[0];
            }

            output += 'x';
          }

          output += algebraic(move.to);

          if (move.flags & BITS.PROMOTION) {
            output += '=' + move.promotion.toUpperCase();
          }
        }

        make_move(move);

        if (_in_check()) {
          if (_in_checkmate()) {
            output += '#';
          } else {
            output += '+';
          }
        }

        undo_move();
        return output;
      } // parses all of the decorators out of a SAN string


      function stripped_san(move) {
        return move.replace(/=/, '').replace(/[+#]?[?!]*$/, '');
      }

      function attacked(color, square) {
        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
          /* did we run off the end of the board */
          if (i & 0x88) {
            i += 7;
            continue;
          }
          /* if empty square or wrong color */


          if (board[i] == null || board[i].color !== color) continue;
          var piece = board[i];
          var difference = i - square;
          var index = difference + 119;

          if (ATTACKS[index] & 1 << SHIFTS[piece.type]) {
            if (piece.type === PAWN) {
              if (difference > 0) {
                if (piece.color === WHITE) return true;
              } else {
                if (piece.color === BLACK) return true;
              }

              continue;
            }
            /* if the piece is a knight or a king */


            if (piece.type === 'n' || piece.type === 'k') return true;
            var offset = RAYS[index];
            var j = i + offset;
            var blocked = false;

            while (j !== square) {
              if (board[j] != null) {
                blocked = true;
                break;
              }

              j += offset;
            }

            if (!blocked) return true;
          }
        }

        return false;
      }

      function king_attacked(color) {
        return attacked(swap_color(color), kings[color]);
      }

      function _in_check() {
        return king_attacked(_turn);
      }

      function _in_checkmate() {
        return _in_check() && generate_moves().length === 0;
      }

      function _in_stalemate() {
        return !_in_check() && generate_moves().length === 0;
      }

      function _insufficient_material() {
        var pieces = {};
        var bishops = [];
        var num_pieces = 0;
        var sq_color = 0;

        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
          sq_color = (sq_color + 1) % 2;

          if (i & 0x88) {
            i += 7;
            continue;
          }

          var piece = board[i];

          if (piece) {
            pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1;

            if (piece.type === BISHOP) {
              bishops.push(sq_color);
            }

            num_pieces++;
          }
        }
        /* k vs. k */


        if (num_pieces === 2) {
          return true;
        }
        /* k vs. kn .... or .... k vs. kb */
        else if (num_pieces === 3 && (pieces[BISHOP] === 1 || pieces[KNIGHT] === 1)) {
            return true;
          }
          /* kb vs. kb where any number of bishops are all on the same color */
          else if (num_pieces === pieces[BISHOP] + 2) {
              var sum = 0;
              var len = bishops.length;

              for (var i = 0; i < len; i++) {
                sum += bishops[i];
              }

              if (sum === 0 || sum === len) {
                return true;
              }
            }

        return false;
      }

      function _in_threefold_repetition() {
        /* TODO: while this function is fine for casual use, a better
         * implementation would use a Zobrist key (instead of FEN). the
         * Zobrist key would be maintained in the make_move/undo_move functions,
         * avoiding the costly that we do below.
         */
        var moves = [];
        var positions = {};
        var repetition = false;

        while (true) {
          var move = undo_move();
          if (!move) break;
          moves.push(move);
        }

        while (true) {
          /* remove the last two fields in the FEN string, they're not needed
           * when checking for draw by rep */
          var fen = generate_fen().split(' ').slice(0, 4).join(' ');
          /* has the position occurred three or move times */

          positions[fen] = fen in positions ? positions[fen] + 1 : 1;

          if (positions[fen] >= 3) {
            repetition = true;
          }

          if (!moves.length) {
            break;
          }

          make_move(moves.pop());
        }

        return repetition;
      }

      function push(move) {
        _history.push({
          move: move,
          kings: {
            b: kings.b,
            w: kings.w
          },
          turn: _turn,
          castling: {
            b: castling.b,
            w: castling.w
          },
          ep_square: ep_square,
          half_moves: half_moves,
          move_number: move_number
        });
      }

      function make_move(move) {
        var us = _turn;
        var them = swap_color(us);
        push(move);
        board[move.to] = board[move.from];
        board[move.from] = null;
        /* if ep capture, remove the captured pawn */

        if (move.flags & BITS.EP_CAPTURE) {
          if (_turn === BLACK) {
            board[move.to - 16] = null;
          } else {
            board[move.to + 16] = null;
          }
        }
        /* if pawn promotion, replace with new piece */


        if (move.flags & BITS.PROMOTION) {
          board[move.to] = {
            type: move.promotion,
            color: us
          };
        }
        /* if we moved the king */


        if (board[move.to].type === KING) {
          kings[board[move.to].color] = move.to;
          /* if we castled, move the rook next to the king */

          if (move.flags & BITS.KSIDE_CASTLE) {
            var castling_to = move.to - 1;
            var castling_from = move.to + 1;
            board[castling_to] = board[castling_from];
            board[castling_from] = null;
          } else if (move.flags & BITS.QSIDE_CASTLE) {
            var castling_to = move.to + 1;
            var castling_from = move.to - 2;
            board[castling_to] = board[castling_from];
            board[castling_from] = null;
          }
          /* turn off castling */


          castling[us] = '';
        }
        /* turn off castling if we move a rook */


        if (castling[us]) {
          for (var i = 0, len = ROOKS[us].length; i < len; i++) {
            if (move.from === ROOKS[us][i].square && castling[us] & ROOKS[us][i].flag) {
              castling[us] ^= ROOKS[us][i].flag;
              break;
            }
          }
        }
        /* turn off castling if we capture a rook */


        if (castling[them]) {
          for (var i = 0, len = ROOKS[them].length; i < len; i++) {
            if (move.to === ROOKS[them][i].square && castling[them] & ROOKS[them][i].flag) {
              castling[them] ^= ROOKS[them][i].flag;
              break;
            }
          }
        }
        /* if big pawn move, update the en passant square */


        if (move.flags & BITS.BIG_PAWN) {
          if (_turn === 'b') {
            ep_square = move.to - 16;
          } else {
            ep_square = move.to + 16;
          }
        } else {
          ep_square = EMPTY;
        }
        /* reset the 50 move counter if a pawn is moved or a piece is captured */


        if (move.piece === PAWN) {
          half_moves = 0;
        } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
          half_moves = 0;
        } else {
          half_moves++;
        }

        if (_turn === BLACK) {
          move_number++;
        }

        _turn = swap_color(_turn);
      }

      function undo_move() {
        var old = _history.pop();

        if (old == null) {
          return null;
        }

        var move = old.move;
        kings = old.kings;
        _turn = old.turn;
        castling = old.castling;
        ep_square = old.ep_square;
        half_moves = old.half_moves;
        move_number = old.move_number;
        var us = _turn;
        var them = swap_color(_turn);
        board[move.from] = board[move.to];
        board[move.from].type = move.piece; // to undo any promotions

        board[move.to] = null;

        if (move.flags & BITS.CAPTURE) {
          board[move.to] = {
            type: move.captured,
            color: them
          };
        } else if (move.flags & BITS.EP_CAPTURE) {
          var index;

          if (us === BLACK) {
            index = move.to - 16;
          } else {
            index = move.to + 16;
          }

          board[index] = {
            type: PAWN,
            color: them
          };
        }

        if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
          var castling_to, castling_from;

          if (move.flags & BITS.KSIDE_CASTLE) {
            castling_to = move.to + 1;
            castling_from = move.to - 1;
          } else if (move.flags & BITS.QSIDE_CASTLE) {
            castling_to = move.to - 2;
            castling_from = move.to + 1;
          }

          board[castling_to] = board[castling_from];
          board[castling_from] = null;
        }

        return move;
      }
      /* this function is used to uniquely identify ambiguous moves */


      function get_disambiguator(move, sloppy) {
        var moves = generate_moves({
          legal: !sloppy
        });
        var from = move.from;
        var to = move.to;
        var piece = move.piece;
        var ambiguities = 0;
        var same_rank = 0;
        var same_file = 0;

        for (var i = 0, len = moves.length; i < len; i++) {
          var ambig_from = moves[i].from;
          var ambig_to = moves[i].to;
          var ambig_piece = moves[i].piece;
          /* if a move of the same piece type ends on the same to square, we'll
           * need to add a disambiguator to the algebraic notation
           */

          if (piece === ambig_piece && from !== ambig_from && to === ambig_to) {
            ambiguities++;

            if (rank(from) === rank(ambig_from)) {
              same_rank++;
            }

            if (file(from) === file(ambig_from)) {
              same_file++;
            }
          }
        }

        if (ambiguities > 0) {
          /* if there exists a similar moving piece on the same rank and file as
           * the move in question, use the square as the disambiguator
           */
          if (same_rank > 0 && same_file > 0) {
            return algebraic(from);
          }
          /* if the moving piece rests on the same file, use the rank symbol as the
           * disambiguator
           */
          else if (same_file > 0) {
              return algebraic(from).charAt(1);
            }
            /* else use the file symbol */
            else {
                return algebraic(from).charAt(0);
              }
        }

        return '';
      }

      function _ascii() {
        var s = '   +------------------------+\n';

        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
          /* display the rank */
          if (file(i) === 0) {
            s += ' ' + '87654321'[rank(i)] + ' |';
          }
          /* empty piece */


          if (board[i] == null) {
            s += ' . ';
          } else {
            var piece = board[i].type;
            var color = board[i].color;
            var symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
            s += ' ' + symbol + ' ';
          }

          if (i + 1 & 0x88) {
            s += '|\n';
            i += 8;
          }
        }

        s += '   +------------------------+\n';
        s += '     a  b  c  d  e  f  g  h\n';
        return s;
      } // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates


      function move_from_san(move, sloppy) {
        // strip off any move decorations: e.g Nf3+?!
        var clean_move = stripped_san(move); // if we're using the sloppy parser run a regex to grab piece, to, and from
        // this should parse invalid SAN like: Pe2-e4, Rc1c4, Qf3xf7

        if (sloppy) {
          var matches = clean_move.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/);

          if (matches) {
            var piece = matches[1];
            var from = matches[2];
            var to = matches[3];
            var promotion = matches[4];
          }
        }

        var moves = generate_moves();

        for (var i = 0, len = moves.length; i < len; i++) {
          // try the strict parser first, then the sloppy parser if requested
          // by the user
          if (clean_move === stripped_san(move_to_san(moves[i])) || sloppy && clean_move === stripped_san(move_to_san(moves[i], true))) {
            return moves[i];
          } else {
            if (matches && (!piece || piece.toLowerCase() == moves[i].piece) && SQUARES[from] == moves[i].from && SQUARES[to] == moves[i].to && (!promotion || promotion.toLowerCase() == moves[i].promotion)) {
              return moves[i];
            }
          }
        }

        return null;
      }
      /*****************************************************************************
       * UTILITY FUNCTIONS
       ****************************************************************************/


      function rank(i) {
        return i >> 4;
      }

      function file(i) {
        return i & 15;
      }

      function algebraic(i) {
        var f = file(i),
            r = rank(i);
        return 'abcdefgh'.substring(f, f + 1) + '87654321'.substring(r, r + 1);
      }

      function swap_color(c) {
        return c === WHITE ? BLACK : WHITE;
      }

      function is_digit(c) {
        return '0123456789'.indexOf(c) !== -1;
      }
      /* pretty = external move object */


      function make_pretty(ugly_move) {
        var move = clone(ugly_move);
        move.san = move_to_san(move, false);
        move.to = algebraic(move.to);
        move.from = algebraic(move.from);
        var flags = '';

        for (var flag in BITS) {
          if (BITS[flag] & move.flags) {
            flags += FLAGS[flag];
          }
        }

        move.flags = flags;
        return move;
      }

      function clone(obj) {
        var dupe = obj instanceof Array ? [] : {};

        for (var property in obj) {
          if (typeof property === 'object') {
            dupe[property] = clone(obj[property]);
          } else {
            dupe[property] = obj[property];
          }
        }

        return dupe;
      }

      function trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
      }
      /*****************************************************************************
       * DEBUGGING UTILITIES
       ****************************************************************************/


      function _perft(depth) {
        var moves = generate_moves({
          legal: false
        });
        var nodes = 0;
        var color = _turn;

        for (var i = 0, len = moves.length; i < len; i++) {
          make_move(moves[i]);

          if (!king_attacked(color)) {
            if (depth - 1 > 0) {
              var child_nodes = _perft(depth - 1);

              nodes += child_nodes;
            } else {
              nodes++;
            }
          }

          undo_move();
        }

        return nodes;
      }

      return {
        /***************************************************************************
         * PUBLIC CONSTANTS (is there a better way to do this?)
         **************************************************************************/
        WHITE: WHITE,
        BLACK: BLACK,
        PAWN: PAWN,
        KNIGHT: KNIGHT,
        BISHOP: BISHOP,
        ROOK: ROOK,
        QUEEN: QUEEN,
        KING: KING,
        SQUARES: function () {
          /* from the ECMA-262 spec (section 12.6.4):
           * "The mechanics of enumerating the properties ... is
           * implementation dependent"
           * so: for (var sq in SQUARES) { keys.push(sq); } might not be
           * ordered correctly
           */
          var keys = [];

          for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
            if (i & 0x88) {
              i += 7;
              continue;
            }

            keys.push(algebraic(i));
          }

          return keys;
        }(),
        FLAGS: FLAGS,

        /***************************************************************************
         * PUBLIC API
         **************************************************************************/
        load: function load(fen) {
          return _load(fen);
        },
        reset: function reset() {
          return _reset();
        },
        moves: function moves(options) {
          /* The internal representation of a chess move is in 0x88 format, and
           * not meant to be human-readable.  The code below converts the 0x88
           * square coordinates to algebraic coordinates.  It also prunes an
           * unnecessary move keys resulting from a verbose call.
           */
          var ugly_moves = generate_moves(options);
          var moves = [];

          for (var i = 0, len = ugly_moves.length; i < len; i++) {
            /* does the user want a full move object (most likely not), or just
             * SAN
             */
            if (typeof options !== 'undefined' && 'verbose' in options && options.verbose) {
              moves.push(make_pretty(ugly_moves[i]));
            } else {
              moves.push(move_to_san(ugly_moves[i], false));
            }
          }

          return moves;
        },
        in_check: function in_check() {
          return _in_check();
        },
        in_checkmate: function in_checkmate() {
          return _in_checkmate();
        },
        in_stalemate: function in_stalemate() {
          return _in_stalemate();
        },
        in_draw: function in_draw() {
          return half_moves >= 100 || _in_stalemate() || _insufficient_material() || _in_threefold_repetition();
        },
        insufficient_material: function insufficient_material() {
          return _insufficient_material();
        },
        in_threefold_repetition: function in_threefold_repetition() {
          return _in_threefold_repetition();
        },
        game_over: function game_over() {
          return half_moves >= 100 || _in_checkmate() || _in_stalemate() || _insufficient_material() || _in_threefold_repetition();
        },
        validate_fen: function validate_fen(fen) {
          return _validate_fen(fen);
        },
        fen: function fen() {
          return generate_fen();
        },
        pgn: function pgn(options) {
          /* using the specification from http://www.chessclub.com/help/PGN-spec
           * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
           */
          var newline = typeof options === 'object' && typeof options.newline_char === 'string' ? options.newline_char : '\n';
          var max_width = typeof options === 'object' && typeof options.max_width === 'number' ? options.max_width : 0;
          var result = [];
          var header_exists = false;
          /* add the PGN header headerrmation */

          for (var i in header) {
            /* TODO: order of enumerated properties in header object is not
             * guaranteed, see ECMA-262 spec (section 12.6.4)
             */
            result.push('[' + i + ' \"' + header[i] + '\"]' + newline);
            header_exists = true;
          }

          if (header_exists && _history.length) {
            result.push(newline);
          }
          /* pop all of history onto reversed_history */


          var reversed_history = [];

          while (_history.length > 0) {
            reversed_history.push(undo_move());
          }

          var moves = [];
          var move_string = '';
          /* build the list of moves.  a move_string looks like: "3. e3 e6" */

          while (reversed_history.length > 0) {
            var move = reversed_history.pop();
            /* if the position started with black to move, start PGN with 1. ... */

            if (!_history.length && move.color === 'b') {
              move_string = move_number + '. ...';
            } else if (move.color === 'w') {
              /* store the previous generated move_string if we have one */
              if (move_string.length) {
                moves.push(move_string);
              }

              move_string = move_number + '.';
            }

            move_string = move_string + ' ' + move_to_san(move, false);
            make_move(move);
          }
          /* are there any other leftover moves? */


          if (move_string.length) {
            moves.push(move_string);
          }
          /* is there a result? */


          if (typeof header.Result !== 'undefined') {
            moves.push(header.Result);
          }
          /* history should be back to what is was before we started generating PGN,
           * so join together moves
           */


          if (max_width === 0) {
            return result.join('') + moves.join(' ');
          }
          /* wrap the PGN output at max_width */


          var current_width = 0;

          for (var i = 0; i < moves.length; i++) {
            /* if the current move will push past max_width */
            if (current_width + moves[i].length > max_width && i !== 0) {
              /* don't end the line with whitespace */
              if (result[result.length - 1] === ' ') {
                result.pop();
              }

              result.push(newline);
              current_width = 0;
            } else if (i !== 0) {
              result.push(' ');
              current_width++;
            }

            result.push(moves[i]);
            current_width += moves[i].length;
          }

          return result.join('');
        },
        load_pgn: function load_pgn(pgn, options) {
          // allow the user to specify the sloppy move parser to work around over
          // disambiguation bugs in Fritz and Chessbase
          var sloppy = typeof options !== 'undefined' && 'sloppy' in options ? options.sloppy : false;

          function mask(str) {
            return str.replace(/\\/g, '\\');
          }

          function has_keys(object) {
            for (var key in object) {
              return true;
            }

            return false;
          }

          function parse_pgn_header(header, options) {
            var newline_char = typeof options === 'object' && typeof options.newline_char === 'string' ? options.newline_char : '\r?\n';
            var header_obj = {};
            var headers = header.split(new RegExp(mask(newline_char)));
            var key = '';
            var value = '';

            for (var i = 0; i < headers.length; i++) {
              key = headers[i].replace(/^\[([A-Z][A-Za-z]*)\s.*\]$/, '$1');
              value = headers[i].replace(/^\[[A-Za-z]+\s"(.*)"\]$/, '$1');

              if (trim(key).length > 0) {
                header_obj[key] = value;
              }
            }

            return header_obj;
          }

          var newline_char = typeof options === 'object' && typeof options.newline_char === 'string' ? options.newline_char : '\r?\n';
          var regex = new RegExp('^(\\[(.|' + mask(newline_char) + ')*\\])' + '(' + mask(newline_char) + ')*' + '1.(' + mask(newline_char) + '|.)*$', 'g');
          /* get header part of the PGN file */

          var header_string = pgn.replace(regex, '$1');
          /* no info part given, begins with moves */

          if (header_string[0] !== '[') {
            header_string = '';
          }

          _reset();
          /* parse PGN header */


          var headers = parse_pgn_header(header_string, options);

          for (var key in headers) {
            set_header([key, headers[key]]);
          }
          /* load the starting position indicated by [Setup '1'] and
          * [FEN position] */


          if (headers['SetUp'] === '1') {
            if (!('FEN' in headers && _load(headers['FEN']))) {
              return false;
            }
          }
          /* delete header to get the moves */


          var ms = pgn.replace(header_string, '').replace(new RegExp(mask(newline_char), 'g'), ' ');
          /* delete comments */

          ms = ms.replace(/(\{[^}]+\})+?/g, '');
          /* delete recursive annotation variations */

          var rav_regex = /(\([^\(\)]+\))+?/g;

          while (rav_regex.test(ms)) {
            ms = ms.replace(rav_regex, '');
          }
          /* delete move numbers */


          ms = ms.replace(/\d+\.(\.\.)?/g, '');
          /* delete ... indicating black to move */

          ms = ms.replace(/\.\.\./g, '');
          /* delete numeric annotation glyphs */

          ms = ms.replace(/\$\d+/g, '');
          /* trim and get array of moves */

          var moves = trim(ms).split(new RegExp(/\s+/));
          /* delete empty entries */

          moves = moves.join(',').replace(/,,+/g, ',').split(',');
          var move = '';

          for (var half_move = 0; half_move < moves.length - 1; half_move++) {
            move = move_from_san(moves[half_move], sloppy);
            /* move not possible! (don't clear the board to examine to show the
             * latest valid position)
             */

            if (move == null) {
              return false;
            } else {
              make_move(move);
            }
          }
          /* examine last move */


          move = moves[moves.length - 1];

          if (POSSIBLE_RESULTS.indexOf(move) > -1) {
            if (has_keys(header) && typeof header.Result === 'undefined') {
              set_header(['Result', move]);
            }
          } else {
            move = move_from_san(move, sloppy);

            if (move == null) {
              return false;
            } else {
              make_move(move);
            }
          }

          return true;
        },
        header: function header() {
          return set_header(arguments);
        },
        ascii: function ascii() {
          return _ascii();
        },
        turn: function turn() {
          return _turn;
        },
        move: function move(_move, options) {
          /* The move function can be called with in the following parameters:
           *
           * .move('Nxb7')      <- where 'move' is a case-sensitive SAN string
           *
           * .move({ from: 'h7', <- where the 'move' is a move object (additional
           *         to :'h8',      fields are ignored)
           *         promotion: 'q',
           *      })
           */
          // allow the user to specify the sloppy move parser to work around over
          // disambiguation bugs in Fritz and Chessbase
          var sloppy = typeof options !== 'undefined' && 'sloppy' in options ? options.sloppy : false;
          var move_obj = null;

          if (typeof _move === 'string') {
            move_obj = move_from_san(_move, sloppy);
          } else if (typeof _move === 'object') {
            var moves = generate_moves();
            /* convert the pretty move object to an ugly move object */

            for (var i = 0, len = moves.length; i < len; i++) {
              if (_move.from === algebraic(moves[i].from) && _move.to === algebraic(moves[i].to) && (!('promotion' in moves[i]) || _move.promotion === moves[i].promotion)) {
                move_obj = moves[i];
                break;
              }
            }
          }
          /* failed to find move */


          if (!move_obj) {
            return null;
          }
          /* need to make a copy of move because we can't generate SAN after the
           * move is made
           */


          var pretty_move = make_pretty(move_obj);
          make_move(move_obj);
          return pretty_move;
        },
        undo: function undo() {
          var move = undo_move();
          return move ? make_pretty(move) : null;
        },
        clear: function clear() {
          return _clear();
        },
        put: function put(piece, square) {
          return _put(piece, square);
        },
        get: function get(square) {
          return _get(square);
        },
        remove: function remove(square) {
          return _remove(square);
        },
        perft: function perft(depth) {
          return _perft(depth);
        },
        square_color: function square_color(square) {
          if (square in SQUARES) {
            var sq_0x88 = SQUARES[square];
            return (rank(sq_0x88) + file(sq_0x88)) % 2 === 0 ? 'light' : 'dark';
          }

          return null;
        },
        history: function history(options) {
          var reversed_history = [];
          var move_history = [];
          var verbose = typeof options !== 'undefined' && 'verbose' in options && options.verbose;

          while (_history.length > 0) {
            reversed_history.push(undo_move());
          }

          while (reversed_history.length > 0) {
            var move = reversed_history.pop();

            if (verbose) {
              move_history.push(make_pretty(move));
            } else {
              move_history.push(move_to_san(move));
            }

            make_move(move);
          }

          return move_history;
        },
        movenotation: function movenotation(move) {
          return move_to_san(move);
        }
      };
    };
    /* export Chess object if using node or any other CommonJS compatible
     * environment */


    if (true) exports.Chess = Chess;
    /* export Chess object for any RequireJS compatible environment */

    if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
      return Chess;
    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    /***/
  },

  /***/
  "./js/services/auth.guard.ts":
  /*!***********************************!*\
    !*** ./js/services/auth.guard.ts ***!
    \***********************************/

  /*! exports provided: AuthGuard */

  /***/
  function jsServicesAuthGuardTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AuthGuard", function () {
      return AuthGuard;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _jwtAuthenticationService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./jwtAuthenticationService */
    "./js/services/jwtAuthenticationService.ts");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
    /* harmony import */


    var _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @auth0/angular-jwt */
    "./node_modules/@auth0/angular-jwt/__ivy_ngcc__/fesm2015/auth0-angular-jwt.js");

    var AuthGuard = /*#__PURE__*/function () {
      function AuthGuard(router, authService) {
        _classCallCheck(this, AuthGuard);

        this.router = router;
        this.tokenDecoder = new _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_4__["JwtHelperService"]();
        this.authService = authService;
      }

      _createClass(AuthGuard, [{
        key: "canActivate",
        value: function canActivate(route, state) {
          var user = localStorage.getItem('currentUser');

          if (user) {
            var token = JSON.parse(user).jwtToken;
            this.authService.authenticatedUser = JSON.parse(user).username; // console.log(token);
            // console.log(this.tokenDecoder.getTokenExpirationDate(token.substring('Bearer '.length)))

            if (!this.tokenDecoder.isTokenExpired(token.substring('Bearer '.length))) {
              // logged in so return true
              return true;
            } else {
              localStorage.removeItem('currentUser');
            }
          } // not logged in so redirect to login page with the return url


          this.router.navigate(['/login'], {
            queryParams: {
              returnUrl: state.url
            }
          });
          return false;
        }
      }]);

      return AuthGuard;
    }();

    AuthGuard.ctorParameters = function () {
      return [{
        type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]
      }, {
        type: _jwtAuthenticationService__WEBPACK_IMPORTED_MODULE_1__["JwtAuthenticationService"]
      }];
    };

    AuthGuard = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])()], AuthGuard);
    /***/
  },

  /***/
  "./js/services/jwtAuthenticationService.ts":
  /*!*************************************************!*\
    !*** ./js/services/jwtAuthenticationService.ts ***!
    \*************************************************/

  /*! exports provided: JwtAuthenticationService */

  /***/
  function jsServicesJwtAuthenticationServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "JwtAuthenticationService", function () {
      return JwtAuthenticationService;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");
    /* harmony import */


    var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! rxjs/operators */
    "./node_modules/rxjs/_esm2015/operators/index.js");

    var JwtAuthenticationService = /*#__PURE__*/function () {
      function JwtAuthenticationService(http) {
        _classCallCheck(this, JwtAuthenticationService);

        this.http = http;
        this.authenticatedUser = {
          username: null,
          jwtToken: null
        };
      }

      _createClass(JwtAuthenticationService, [{
        key: "authenticate",
        value: function authenticate(credentials) {
          var _this = this;

          console.log("starting the post request");
          return this.http.post("http://localhost:8082/authenticate", credentials, {
            observe: 'response'
          }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (response) {
            console.log(response);
            var jwtToken = response.headers.get('Authorization'); // let user = {};
            // login successful if there's a jwt token in the response

            if (jwtToken) {
              _this.authenticatedUser = {
                username: credentials.username,
                jwtToken: jwtToken
              }; // store user details and jwt token in local storage to keep user logged in between page refreshes

              localStorage.setItem('currentUser', JSON.stringify(_this.authenticatedUser));
            }

            return _this.authenticatedUser;
          }));
        }
      }, {
        key: "getJwtToken",
        value: function getJwtToken() {
          return JSON.parse(localStorage.getItem('currentUser')).jwtToken;
        }
      }, {
        key: "isUserAuthenticated",
        value: function isUserAuthenticated() {
          var user = localStorage.getItem('currentUser');
          console.log(user);
          return user ? true : false;
        }
      }, {
        key: "logout",
        value: function logout() {
          // remove user from local storage to log user out
          localStorage.removeItem('currentUser');
        }
      }]);

      return JwtAuthenticationService;
    }();

    JwtAuthenticationService.ctorParameters = function () {
      return [{
        type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
      }];
    };

    JwtAuthenticationService = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])()], JwtAuthenticationService);
    /***/
  },

  /***/
  "./js/services/websocketService.ts":
  /*!*****************************************!*\
    !*** ./js/services/websocketService.ts ***!
    \*****************************************/

  /*! exports provided: WebSocketService */

  /***/
  function jsServicesWebsocketServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "WebSocketService", function () {
      return WebSocketService;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _jwtAuthenticationService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./jwtAuthenticationService */
    "./js/services/jwtAuthenticationService.ts");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");

    var WebSocketService = /*#__PURE__*/function () {
      function WebSocketService(authenticationService) {
        _classCallCheck(this, WebSocketService);

        this.authenticationService = authenticationService;
      }

      _createClass(WebSocketService, [{
        key: "initWebSockets",
        value: function initWebSockets() {
          if (typeof this.socket === 'undefined' || this.socket.readyState !== this.socket.OPEN) {
            var jwtToken = this.authenticationService.getJwtToken();
            this.socket = new WebSocket("ws://localhost:8082/actions?token=" + jwtToken);
          }

          return this.socket;
        }
      }, {
        key: "closeWebSocket",
        value: function closeWebSocket() {
          this.socket.close();
        }
      }]);

      return WebSocketService;
    }();

    WebSocketService.ctorParameters = function () {
      return [{
        type: _jwtAuthenticationService__WEBPACK_IMPORTED_MODULE_1__["JwtAuthenticationService"]
      }];
    };

    WebSocketService = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])({
      providedIn: 'root'
    })], WebSocketService);
    /***/
  },

  /***/
  "./main.ts":
  /*!*****************!*\
    !*** ./main.ts ***!
    \*****************/

  /*! no exports provided */

  /***/
  function mainTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/platform-browser-dynamic */
    "./node_modules/@angular/platform-browser-dynamic/__ivy_ngcc__/fesm2015/platform-browser-dynamic.js");
    /* harmony import */


    var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./environments/environment */
    "./environments/environment.ts");
    /* harmony import */


    var zone_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! zone.js */
    "./node_modules/zone.js/dist/zone.js");
    /* harmony import */


    var zone_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(zone_js__WEBPACK_IMPORTED_MODULE_4__);
    /* harmony import */


    var _app_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./app.module */
    "./app.module.ts");

    if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
      Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
    }

    Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__["platformBrowserDynamic"])().bootstrapModule(_app_module__WEBPACK_IMPORTED_MODULE_5__["AppModule"]);
    /***/
  },

  /***/
  "./node_modules/raw-loader/dist/cjs.js!./views/homepage/homepage.html":
  /*!****************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./views/homepage/homepage.html ***!
    \****************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsViewsHomepageHomepageHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<nav class=\"navbar navbar-expand-lg navbar-light bg-light\">\r\n    <a class=\"navbar-brand\" href=\"#\">Slovak Chess Server</a>\r\n    <button class=\"navbar-toggler\" type=\"button\" (click)=\"navbarCollapsed = !navbarCollapsed\" data-toggle=\"collapse\" data-target=\"#navbarSupportedContent\" \r\n    aria-controls=\"navbarSupportedContent\" [attr.aria-expanded]=\"!navbarCollapsed\" aria-label=\"Toggle navigation\">\r\n      <span class=\"navbar-toggler-icon\"></span>\r\n    </button>\r\n  \r\n    <div class=\"collapse navbar-collapse\" id=\"navbarSupportedContent\" [ngClass]=\"{'show':!navbarCollapsed}\">\r\n      <ul class=\"navbar-nav mr-auto\">\r\n        <li class=\"nav-item active\">\r\n          <a class=\"nav-link\" href=\"#\">Register <span class=\"sr-only\">(current)</span></a>\r\n        </li>\r\n        <li class=\"nav-item\">\r\n            <a class=\"nav-link\" routerLink=\"login\">Login</a>\r\n        </li>\r\n        <li class=\"nav-item\">\r\n            <a class=\"nav-link\" routerLink=\"lobby\">Play</a>\r\n        </li>\r\n        <li class=\"nav-item\">\r\n            <a class=\"nav-link\" href=\"#\">Watch</a>\r\n        </li>\r\n        <li class=\"nav-item\">\r\n            <a class=\"nav-link\" routerLink=\"analyzeGame\">Analyse</a>\r\n        </li>\r\n       \r\n      </ul>\r\n      <form class=\"form-inline my-2 my-lg-0\">\r\n       \r\n            <a ng-if=\"authenticated==true\" href=\"#/userProfile\">\r\n                <span class=\"glyphicon glyphicon-user\"></span> {{user}}\r\n            </a>\r\n         \r\n            <a ng-if=\"authenticated==true\" ng-click=\"logout()\" style=\"cursor:pointer\">\r\n                <span class=\"glyphicon glyphicon-log-out\"></span> Log out\r\n            </a>\r\n  \r\n      </form>\r\n    </div>\r\n  </nav>\r\n<!-- <nav class=\"navbar navbar-expand-lg navbar-light bg-light\">\r\n    <div class=\"container\" style=\"margin-bottom: 0px\">\r\n \r\n        <div class=\"navbar-header\">\r\n            <button type=\"button\" class=\"navbar-toggle collapsed\"\r\n                    data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\"\r\n                    aria-expanded=\"false\">\r\n                <span class=\"sr-only\">Toggle navigation</span> <span\r\n                    class=\"icon-bar\"></span> <span class=\"icon-bar\"></span> <span\r\n                    class=\"icon-bar\"></span>\r\n            </button>\r\n\r\n            <a class=\"navbar-brand\" href=\"#\">ChessHeaven</a>\r\n        </div>\r\n\r\n        <div class=\"collapse navbar-collapse\"\r\n             id=\"bs-example-navbar-collapse-1\">\r\n            <ul class=\"nav navbar-nav\">\r\n\r\n                <li>\r\n                    <a href=\"#/register\">Register</a>\r\n                </li>\r\n                <li ng-if=\"authenticated!==true\">\r\n                    <a href=\"#/loginpage\">Login</a>\r\n                </li>\r\n\r\n                <li ng-if=\"authenticated==true && userHasRole('ROLE_ADMIN')\"><a\r\n                        href=\"#/admin\">Admin Section</a></li>\r\n\r\n                <li class=\"dropdown\" ng-if=\"authenticated==true\">\r\n                    <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\"\r\n                       aria-expanded=\"false\">Chess<span class=\"caret\"></span></a>\r\n                    <ul class=\"dropdown-menu\">\r\n                        <li><a href=\"#/playingHall\">Play game</a></li>\r\n                        <li><a href=\"#/lobby\">Lobby</a></li>\r\n                        <li><a routerLink=\"/analyzeGame\">Analyse game</a></li>\r\n                        <li role=\"separator\" class=\"divider\"></li>\r\n                        <li><a href=\"#\">Separated link</a></li>\r\n                        <li role=\"separator\" class=\"divider\"></li>\r\n                        <li><a href=\"#\">One more separated link</a></li>\r\n                    </ul>\r\n                </li>\r\n            </ul>\r\n            <ul class=\"nav navbar-nav navbar-right\">\r\n                <li ng-if=\"authenticated==true\">\r\n                    <a href=\"#/userProfile\">\r\n                        <span class=\"glyphicon glyphicon-user\"></span> {{user}}\r\n                    </a>\r\n                </li>\r\n\r\n                <li ng-if=\"authenticated==true\">\r\n                    <a ng-click=\"logout()\" style=\"cursor:pointer\">\r\n                        <span class=\"glyphicon glyphicon-log-out\"></span> Log out\r\n                    </a>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n    \r\n    </div>\r\n\r\n</nav> -->\r\n\r\n<router-outlet></router-outlet>\r\n\r\n";
    /***/
  },

  /***/
  "./node_modules/raw-loader/dist/cjs.js!./views/lobby/lobby.component.html":
  /*!********************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./views/lobby/lobby.component.html ***!
    \********************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsViewsLobbyLobbyComponentHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<div class=\"container\">\r\n    <div class=\"row marginBottom\">\r\n        <div class=\"col\">Players online:\r\n            {{countOfPlayersOnline}} <br>\r\n            Games in progress: {{gamesInProgress}}\r\n        </div>\r\n        <div class=\"col-md-10\">\r\n\r\n            <div class=\"row marginBottom\">\r\n                <div class=\"col\">\r\n                    <div>\r\n                        <h4>Lobby</h4>\r\n                    </div>\r\n                </div>\r\n\r\n            </div>\r\n\r\n            <div class=\"row marginBottom\">\r\n                <div class=\"col\">\r\n                    <div class=\"row marginBottom\">\r\n                        <div class=\"col-1\" *ngIf=\"seekingOponent\">\r\n                            <div class=\"loader\" id=\"loader-1\" >\r\n                                \r\n                            </div>\r\n                        </div>\r\n                        <div class=\"col\" *ngIf=\"seekingOponent\">\r\n\r\n                            <span>Looking for an oponent - please wait...</span>\r\n                           \r\n                        </div>\r\n                        \r\n                    </div>\r\n                    <div class=\"row marginBottom\">\r\n                        <div class=\"col-sm-5\" style=\"display:flex;justify-content: space-between;\">\r\n                            <button type=\"submit\" class=\"btn btn-primary\" (click)=\"seekOponent(1,0)\" id=\"seek1\">1+0\r\n                            </button>\r\n                            <button type=\"submit\" class=\"btn btn-primary\" (click)=\"seekOponent(3,0)\">3+0\r\n                            </button>\r\n                            <button type=\"submit\" class=\"btn btn-primary\" (click)=\"seekOponent(5,0)\">5+0\r\n                            </button>\r\n                            <button type=\"submit\" class=\"btn btn-primary\" (click)=\"seekOponent(3,1)\">3+1\r\n                            </button>\r\n                            <button type=\"submit\" class=\"btn btn-primary\" (click)=\"showSeekForm()\" id=\"seek2\">Other time\r\n                            </button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n\r\n            </div>\r\n\r\n            <div class=\"row marginBottom\">\r\n                <div class=\"col\">\r\n                    <div *ngIf=\"gameTimeFormShown==true\">\r\n                        <form [formGroup]=\"gameTimeForm\" (ngSubmit)=\"seekOponent()\">\r\n                            <div class=\"form-group\">\r\n                                <label for=\"initialtime\">Initial Time</label>\r\n                                <input type=\"text\" formControlName=\"initialtime\" class=\"form-control\"\r\n                                    [ngClass]=\"{ 'is-invalid': gameTimeFormSubmitted && gameTimeFormFields.initialtime.errors }\" />\r\n                                <div *ngIf=\"gameTimeFormSubmitted && gameTimeFormFields.initialtime.errors\"\r\n                                    class=\"invalid-feedback\">\r\n                                    <div *ngIf=\"gameTimeFormFields.initialtime.errors.required\">Initial time is\r\n                                        required\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"form-group\">\r\n                                <label for=\"incrementpermove\">Increment per move</label>\r\n                                <input type=\"incrementpermove\" formControlName=\"incrementpermove\" class=\"form-control\"\r\n                                    [ngClass]=\"{ 'is-invalid': gameTimeFormSubmitted && gameTimeFormFields.incrementpermove.errors }\" />\r\n                                <div *ngIf=\"gameTimeFormSubmitted && gameTimeFormFields.incrementpermove.errors\"\r\n                                    class=\"invalid-feedback\">\r\n                                    <div *ngIf=\"gameTimeFormFields.incrementpermove.errors.required\">Increment per\r\n                                        move\r\n                                        is required</div>\r\n                                </div>\r\n                            </div>\r\n                            <!--      <div class=\"form-group\">\r\n                            <button [disabled]=\"loading\" class=\"btn btn-primary\">\r\n                                <span *ngIf=\"loading\" class=\"spinner-border spinner-border-sm mr-1\"></span>\r\n                                Login\r\n                            </button>\r\n                        </div> -->\r\n                        </form>\r\n\r\n\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n\r\n            <div class=\"row marginBottom\">\r\n                <div class=\"col\">\r\n                    <div *ngIf=\"playersOnline.length !== 0\">\r\n                        <h4>Players online</h4>\r\n                        <table class=\"table table-bordered\">\r\n                            <thead>\r\n                                <td>Player name</td>\r\n                                <td>Player elo</td>\r\n                                <td>Player status</td>\r\n                            </thead>\r\n                            <tbody>\r\n                                <tr *ngFor=\"let player of playersOnline\">\r\n                                    <td>{{player.name}}</td>\r\n                                    <td>{{player.elo}}</td>\r\n                                    <td>\r\n                                        <span *ngIf=\"player.isPlaying\" class=\"label label-info\">Playing </span><span\r\n                                            class=\"glyphicon glyphicon-eye-open\" *ngIf=\"player.isPlaying\"\r\n                                            (click)=\"observeGame(player.name)\">Observe game</span>\r\n                                        <span\r\n                                            *ngIf=\"((player.name !== user && player.isSeeking) || (player.name === user && seekingOponent)) && !player.isPlaying\"\r\n                                            class=\"label label-success\">Seeking</span>\r\n                                        <span\r\n                                            *ngIf=\"((player.name !== user && !player.isSeeking) || (player.name === user && !seekingOponent)) && !player.isPlaying\"\r\n                                            class=\"label label-success\">Idle</span>\r\n                                    </td>\r\n                                </tr>\r\n                            </tbody>\r\n                        </table>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"row chatMessageDiv\">\r\n                <div class=\"col\">\r\n                    <h4>Lobby Chat</h4>\r\n                    <div class=\"chatWindow\" ng-scrollbars ng-scrollbars-config=\"config\">\r\n\r\n                        <div id=\"chatPost\" *ngFor=\"let message of messages.slice().reverse()\">\r\n                            <label class=\"chatPostAuthor\" for=\"message\">{{message.date | date:'H:mm' }}\r\n                                {{message.author}}: </label>\r\n                            <span id=\"message\">{{message.message}}</span>\r\n                        </div>\r\n\r\n\r\n                    </div>\r\n\r\n                    <div>\r\n                        <input type=\"text\" id=\"chatmessage\" [(ngModel)]=\"chatMessage.message\">\r\n                        <button (click)=\"sendChatMessage()\">Send</button>\r\n                    </div>\r\n\r\n                </div>\r\n\r\n\r\n\r\n\r\n            </div>\r\n        </div>";
    /***/
  },

  /***/
  "./node_modules/raw-loader/dist/cjs.js!./views/login/login.component.html":
  /*!********************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./views/login/login.component.html ***!
    \********************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsViewsLoginLoginComponentHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<div class=\"container\">\n    <h2>Login</h2>\n    <form [formGroup]=\"loginForm\" (ngSubmit)=\"login()\">\n        <div class=\"form-group\">\n            <label for=\"username\">Username</label>\n            <input type=\"text\" formControlName=\"username\" class=\"form-control\" [ngClass]=\"{ 'is-invalid': submitted && f.username.errors }\" />\n            <div *ngIf=\"submitted && f.username.errors\" class=\"invalid-feedback\">\n                <div *ngIf=\"f.username.errors.required\">Username is required</div>\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <label for=\"password\">Password</label>\n            <input type=\"password\" formControlName=\"password\" class=\"form-control\" [ngClass]=\"{ 'is-invalid': submitted && f.password.errors }\" />\n            <div *ngIf=\"submitted && f.password.errors\" class=\"invalid-feedback\">\n                <div *ngIf=\"f.password.errors.required\">Password is required</div>\n            </div>\n        </div>\n        <div class=\"form-group\">\n            <button [disabled]=\"loading\" class=\"btn btn-primary\">\n                <span *ngIf=\"loading\" class=\"spinner-border spinner-border-sm mr-1\"></span>\n                Login\n            </button>\n        </div>\n    </form>\n    </div>\n    ";
    /***/
  },

  /***/
  "./node_modules/raw-loader/dist/cjs.js!./views/playingHall/playingHall.html":
  /*!**********************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./views/playingHall/playingHall.html ***!
    \**********************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsViewsPlayingHallPlayingHallHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<div class=\"container bordered\">\r\n    <div class=\"playerNamesRow\">\r\n        <div class=\"playersRow\">\r\n            <div class=\"players col-md-12 alert-success\" *ngIf=\"whitePlayerName\">\r\n                {{whitePlayerName}}({{whitePlayerElo}}) -\r\n                {{blackPlayerName}}({{blackPlayerElo}}) <span *ngIf=\"gameResult\">Game result: {{gameResult}}</span>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"row\">\r\n        <div class=\"col-md-7\">\r\n            <!-- -->\r\n            <div class=\"row\"\r\n                *ngIf=\"showPawnPromotionDiv==true && (mode=== chessboardUsageModes.PLAYING || mode=== chessboardUsageModes.ANALYZING)\">\r\n                <div class=\"col promotionPieces\">\r\n                    Which piece do you want to promote the pawn to?\r\n                    <table class=\"table\">\r\n                        <tr>\r\n                            <td>\r\n                                <div style=\"position: relative\">\r\n                                    <img class=\"chessPiece\"\r\n                                        src=\"{{whitePlayer==true ? 'assets/images/pieces/WN.png' : 'assets/images/pieces/BN.png'}}\"\r\n                                        (click)=\"promotePiece('n')\" />\r\n                                </div>\r\n                            </td>\r\n                            <td>\r\n                                <div style=\"position: relative\">\r\n                                    <img class=\"chessPiece\"\r\n                                        src=\"{{whitePlayer==true ? 'assets/images/pieces/WB.png' : 'assets/images/pieces/BB.png'}}\"\r\n                                        (click)=\"promotePiece('b')\" />\r\n                                </div>\r\n                            </td>\r\n                            <td>\r\n                                <div style=\"position: relative\">\r\n                                    <img class=\"chessPiece\"\r\n                                        src=\"{{whitePlayer==true?'assets/images/pieces/WR.png':'assets/images/pieces/BR.png'}}\"\r\n                                        (click)=\"promotePiece('r')\" />\r\n                                </div>\r\n                            </td>\r\n                            <td>\r\n                                <div style=\"position: relative\">\r\n                                    <img class=\"chessPiece\"\r\n                                        src=\"{{whitePlayer==true?'assets/images/pieces/WQ.png':'assets/images/pieces/BQ.png'}}\"\r\n                                        (click)=\"promotePiece('q')\" />\r\n                                </div>\r\n                            </td>\r\n                        </tr>\r\n                    </table>\r\n                </div>\r\n            </div>\r\n            <div class=\"row\">\r\n                <div class=\"col\">\r\n                    <div id=\"newChessboardContainer\"></div>\r\n                </div>\r\n            </div>\r\n            <div class=\"row\" *ngIf=\"mode === chessboardUsageModes.ANALYZING\">\r\n                <div class=\"col\">\r\n                    <div class=\"moveControlsWrapper\">\r\n                        <img src=\"assets/images/arrow-first-move.png\" (click)=\"goToFirstMove()\" />\r\n                        <img src=\"assets/images/arrow-previous-move.png\" (click)=\"goToPreviousMove()\" />\r\n                        <img src=\"assets/images/arrow-next-move.png\" (click)=\"goToNextMove()\" />\r\n                        <img src=\"assets/images/arrow-last-move.png\" (click)=\"goToLastMove()\" />\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-md-5 chessboardSidebarWrapper\">\r\n            <div class=\"row clockRow\" *ngIf=\"whitePlayerName && mode !== chessboardUsageModes.ANALYZING\">\r\n                <div class=\"col-md-6\">\r\n                    <table class=\"clockSideSection\">\r\n                        <tr>\r\n                            <td *ngIf=\"!whitePlayer\">{{whitePlayerName}} ({{whitePlayerElo}})\r\n                                <span>{{whitePlayerEloChange >= 0 ? \"+\"+whitePlayerEloChange : whitePlayerEloChange}}</span>\r\n                            </td>\r\n                            <td *ngIf=\"whitePlayer\">{{blackPlayerName}} ({{blackPlayerElo}})\r\n                                <span>{{blackPlayerEloChange >= 0 ? \"+\"+blackPlayerEloChange : blackPlayerEloChange}}</span>\r\n                            </td>\r\n                        </tr>\r\n                        <tr>\r\n                            <td [ngClass]=\"{'clock':true, 'clockActive':whiteMove,  'clockNotActive':!whiteMove}\"\r\n                                *ngIf=\"!whitePlayer\">\r\n                                {{whiteClock}}\r\n                            </td>\r\n                            <td [ngClass]=\"{'clock':true, 'clockActive':!whiteMove, 'clockNotActive':whiteMove}\"\r\n                                *ngIf=\"whitePlayer\">{{blackClock}}\r\n                            </td>\r\n                        </tr>\r\n\r\n                    </table>\r\n                </div>\r\n                <div class=\"col-sm-6\">\r\n\r\n                </div>\r\n            </div>\r\n            <div class=\"row notationRow\" *ngIf=\"annotatedMoves.length > 0\">\r\n                <div class=\"col \">\r\n                    <div class=\"row\">\r\n                        <div class=\"col\">\r\n                            <div class=\"row\">\r\n                                <div class=\"col \">\r\n                                    <div class=\"row border\" style=\"margin-left:0px; margin-bottom:-2px; width: 100%\">\r\n                                        <div class=\"col\">\r\n                                            <div class=\"row notationTableHeader\">\r\n                                                <div class=\"col border border-dark \">Move no.</div>\r\n                                                <div class=\"col border border-dark border-left-0\">White move</div>\r\n                                                <div class=\"col border border-dark border-left-0\">Black move</div>\r\n                                            </div>\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"row notationTable\" \r\n                                        style=\"margin-left:0px\">\r\n\r\n                                        <div class=\"col\">\r\n                                            <div class=\"row border\" *ngFor=\"let annotatedMove of annotatedMoves\">\r\n                                                <div class=\"col\">\r\n                                                    <div class=\"row\">\r\n                                                        <div class=\"col\">{{annotatedMove.moveNumber}}</div>\r\n                                                        <div class=\"col\"\r\n                                                            id=\"{{'annotatedMoveWhite'+annotatedMove.moveNumber}}\"\r\n                                                            [ngClass]=\"{'annotatedMove':true,\r\n                                                     'highlighted':moveToHighlight.variationId === MAIN_LINE \r\n                                                                && moveToHighlight.moveNumber+1===annotatedMove.moveNumber \r\n                                                                && moveToHighlight.whiteMove === true}\"\r\n                                                            (click)=\"redrawChessboard(annotatedMove.chessboardAfterWhiteMove,MAIN_LINE)\">\r\n                                                            {{annotatedMove.whiteMove}}\r\n                                                        </div>\r\n                                                        <div class=\"col\"\r\n                                                            id=\"{{'annotatedMoveBlack'+annotatedMove.moveNumber}}\"\r\n                                                            [ngClass]=\"{'annotatedMove':true,\r\n                                                     'highlighted':moveToHighlight.variationId === MAIN_LINE && \r\n                                                                   moveToHighlight.moveNumber+1===annotatedMove.moveNumber && \r\n                                                                   moveToHighlight.whiteMove === false}\"\r\n                                                            (click)=\"redrawChessboard(annotatedMove.chessboardAfterBlackMove,MAIN_LINE)\">\r\n                                                            {{annotatedMove.blackMove}}\r\n                                                        </div>\r\n                                                    </div>\r\n\r\n                                                    <div class=\"row border border-dark\"\r\n                                                        *ngFor=\"let variation of annotatedMove.whiteMoveVariations\">\r\n                                                        <td colspan=\"3\">\r\n                                                            <variation-tree [moveToHighlight]=\"moveToHighlight\"\r\n                                                                [mainVariation]=\"variation\"\r\n                                                                (positionToRedraw)=\"setupVariation($event)\">\r\n                                                            </variation-tree>\r\n                                                        </td>\r\n                                                    </div>\r\n\r\n                                                    <div class=\"row border border-dark\"\r\n                                                        *ngFor=\"let variation of annotatedMove.blackMoveVariations\">\r\n                                                        <td colspan=\"3\">\r\n                                                            <variation-tree [moveToHighlight]=\"moveToHighlight\"\r\n                                                                [mainVariation]=\"variation\"\r\n                                                                (positionToRedraw)=\"setupVariation($event)\">\r\n                                                            </variation-tree>\r\n                                                        </td>\r\n                                                    </div>\r\n                                                </div>\r\n                                            </div>\r\n                                        </div>\r\n\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"row\">\r\n                <div class=\"col\">\r\n                    <span>{{gameResult}}</span>\r\n                </div>\r\n            </div>\r\n            <div class=\"row\">\r\n\r\n                <div class=\"col\">\r\n                    <div *ngIf=\"mode === chessboardUsageModes.PLAYING\" id=\"drawResignSection\">\r\n\r\n                        <button (click)=\"offerDraw()\" class=\"btn btn-primary\">Offer Draw</button>\r\n                        <button (click)=\"resignButtonPressed = true\" class=\"btn btn-primary\">Resign</button>\r\n                        <button (click)=\"activateAnalysisMode()\" class=\"btn btn-primary\"\r\n                            *ngIf=\"!playingGame\">Analyse</button>\r\n\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"row\">\r\n                <div class=\"col\">\r\n                    <div *ngIf=\"drawOfferReceived && mode === chessboardUsageModes.PLAYING\" class=\"alert alert-info\">\r\n                        <div>\r\n                        <span>{{oponent}} offered you a draw. Do you want to accept?</span>\r\n                    </div>\r\n                        <button (click)=\"drawOfferReply(true)\">Yes</button>\r\n                        <button (click)=\"drawOfferReply(false)\">No</button>\r\n                    </div>\r\n                    <div *ngIf=\"resignButtonPressed && mode === chessboardUsageModes.PLAYING\" class=\"alert alert-info\">\r\n                        <span>Do you really want to resign?</span>\r\n                        <button (click)=\"resign()\">Yes</button>\r\n                        <button (click)=\"resignButtonPressed = false\">No</button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"row clockRow\">\r\n                <div class=\"col-md-12\">\r\n                    <table *ngIf=\"whitePlayerName && mode !== chessboardUsageModes.ANALYZING\">\r\n                        <tr>\r\n                            <td *ngIf=\"whitePlayer\">{{whitePlayerName}} ({{whitePlayerElo}})\r\n                                <span>{{whitePlayerEloChange >= 0 ? \"+\"+whitePlayerEloChange : whitePlayerEloChange}}</span>\r\n                            </td>\r\n                            <td *ngIf=\"!whitePlayer\">{{blackPlayerName}} ({{blackPlayerElo}})\r\n                                <span>{{blackPlayerEloChange >= 0 ? \"+\"+blackPlayerEloChange : blackPlayerEloChange}}</span>\r\n                            </td>\r\n                        </tr>\r\n                        <tr>\r\n                            <td [ngClass]=\"{'clock':true, 'clockActive':whiteMove, 'clockNotActive':!whiteMove}\"\r\n                                *ngIf=\"whitePlayer\">\r\n                                {{whiteClock}}\r\n                            </td>\r\n                            <td [ngClass]=\"{'clock':true, 'clockActive':!whiteMove, 'clockNotActive':whiteMove}\"\r\n                                *ngIf=\"!whitePlayer\">\r\n                                {{blackClock}}\r\n                            </td>\r\n                        </tr>\r\n                    </table>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";
    /***/
  },

  /***/
  "./node_modules/raw-loader/dist/cjs.js!./views/playingHall/subcomponents/moveVariationTree/move-variation-tree/move-variation-tree.component.html":
  /*!********************************************************************************************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./views/playingHall/subcomponents/moveVariationTree/move-variation-tree/move-variation-tree.component.html ***!
    \********************************************************************************************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsViewsPlayingHallSubcomponentsMoveVariationTreeMoveVariationTreeMoveVariationTreeComponentHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<div>\n    (<span *ngFor=\"let moveOfVariation of mainVariation.moves; index as $index\" >\n        {{moveOfVariation.moveNumber}}. <span *ngIf=\"mainVariation.moves[0].whiteMove === '' && $index === 0\">..</span>\n      \n        <a *ngIf=\"moveOfVariation.whiteMove\" id=\"{{'moveOfVariationNo'+mainVariation.variationId+'White'+moveOfVariation.moveNumber}}\" \n        [ngClass] = \"{'highlighted': mainVariation.variationId === moveToHighlight.variationId && \n                                     moveOfVariation.moveNumber === moveToHighlight.moveNumber + 1 &&\n                                     true === moveToHighlight.whiteMove}\"\n        (click)=\"redrawPosition(moveOfVariation.chessboardAfterWhiteMove, mainVariation.variationId )\">{{moveOfVariation.whiteMove}} </a>\n          \n        <a *ngIf=\"moveOfVariation.blackMove\" id=\"{{'moveOfVariationNo'+mainVariation.variationId+'Black'+moveOfVariation.moveNumber}}\" \n        [ngClass] = \"{'highlighted': mainVariation.variationId === moveToHighlight.variationId && \n                                     moveOfVariation.moveNumber === moveToHighlight.moveNumber + 1 &&\n                                     false === moveToHighlight.whiteMove}\"\n        (click)=\"redrawPosition(moveOfVariation.chessboardAfterBlackMove, mainVariation.variationId )\">{{moveOfVariation.blackMove}}</a>\n     \n        <span *ngFor=\"let subvariation of moveOfVariation.whiteMoveVariations\">\n            <variation-tree [moveToHighlight]=\"moveToHighlight\" [mainVariation]=\"subvariation\" (positionToRedraw)=\"redrawPosition($event.fen, $event.variationId)\"></variation-tree>\n        </span>\n        <span *ngFor=\"let subvariation of moveOfVariation.blackMoveVariations\">\n            <variation-tree [moveToHighlight]=\"moveToHighlight\" [mainVariation]=\"subvariation\" (positionToRedraw)=\"redrawPosition($event.fen,$event.variationId)\"></variation-tree>\n        </span>\n    </span>)\n</div>\n";
    /***/
  },

  /***/
  "./views/homepage/homepage.ts":
  /*!************************************!*\
    !*** ./views/homepage/homepage.ts ***!
    \************************************/

  /*! exports provided: HomePageComponent */

  /***/
  function viewsHomepageHomepageTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "HomePageComponent", function () {
      return HomePageComponent;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");

    var HomePageComponent = /*#__PURE__*/function () {
      function HomePageComponent() {
        _classCallCheck(this, HomePageComponent);

        this.navbarCollapsed = true;
      }

      _createClass(HomePageComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {}
      }]);

      return HomePageComponent;
    }();

    HomePageComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
      selector: 'homepage',
      template: Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(
      /*! raw-loader!./homepage.html */
      "./node_modules/raw-loader/dist/cjs.js!./views/homepage/homepage.html"))["default"]
    })], HomePageComponent);
    /***/
  },

  /***/
  "./views/lobby/lobby.component.css":
  /*!*****************************************!*\
    !*** ./views/lobby/lobby.component.css ***!
    \*****************************************/

  /*! exports provided: default */

  /***/
  function viewsLobbyLobbyComponentCss(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = ".bottomMargin{\r\n    margin-bottom: 10px;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdzL2xvYmJ5L2xvYmJ5LmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxtQkFBbUI7QUFDdkIiLCJmaWxlIjoidmlld3MvbG9iYnkvbG9iYnkuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5ib3R0b21NYXJnaW57XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xyXG59Il19 */";
    /***/
  },

  /***/
  "./views/lobby/lobby.component.ts":
  /*!****************************************!*\
    !*** ./views/lobby/lobby.component.ts ***!
    \****************************************/

  /*! exports provided: LobbyComponent */

  /***/
  function viewsLobbyLobbyComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "LobbyComponent", function () {
      return LobbyComponent;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _js_services_jwtAuthenticationService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./../../js/services/jwtAuthenticationService */
    "./js/services/jwtAuthenticationService.ts");
    /* harmony import */


    var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/forms */
    "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
    /* harmony import */


    var _js_services_websocketService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./../../js/services/websocketService */
    "./js/services/websocketService.ts");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");

    var LobbyComponent = /*#__PURE__*/function () {
      function LobbyComponent(router, websocketService, authenticationService, formBuilder) {
        _classCallCheck(this, LobbyComponent);

        this.router = router;
        this.websocketService = websocketService;
        this.authenticationService = authenticationService;
        this.formBuilder = formBuilder;
        this.chatMessage = {
          action: "chatMessageLobby",
          author: null,
          message: ""
        };
        this.time = 0;
        this.increment = 0;
        this.messages = [];
        this.gamesInProgress = 0;
        this.playersOnline = [];
        this.seekingOponent = false;
        this.user = {};
        this.config = {
          autoHideScrollbar: false,
          setHeight: 300,
          scrollInertia: 500,
          axis: 'yx',
          advanced: {
            updateOnContentResize: true
          },
          scrollButtons: {
            scrollAmount: 'auto',
            enable: true // enable scrolling buttons by default

          },
          theme: 'dark'
        };

        this.showSeekForm = function () {
          this.gameTimeFormShown = true;
        };
      }

      _createClass(LobbyComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {
          var _this2 = this;

          this.gameTimeForm = this.formBuilder.group({
            time: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            increment: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]
          });
          this.gameTimeFormSubmitted = false;
          this.gameTimeFormShown = false;
          this.socket = this.websocketService.initWebSockets();

          this.socket.onmessage = function (message) {
            _this2.onMessage(message);
          };

          this.socket.onclose = function () {
            console.log("closing timer");

            _this2.cancelIntervals();
          };

          this.user = this.authenticationService.authenticatedUser;
          this.queryPlayersInterval = setInterval(function () {
            _this2.queryPlayersOnline();
          }, 10000);
        }
      }, {
        key: "sendChatMessage",
        value: function sendChatMessage() {
          this.chatMessage.author = this.authenticationService.authenticatedUser;
          this.socket.send(JSON.stringify(this.chatMessage));
          this.chatMessage.message = "";
        }
      }, {
        key: "displayChatMessage",
        value: function displayChatMessage(message) {
          message.date = new Date();
          this.messages.unshift(message);
        }
      }, {
        key: "seekOponent",
        value: function seekOponent(time, increment) {
          var _this3 = this;

          this.gameTimeFormSubmitted = true;

          if (this.gameTimeFormShown && this.gameTimeFormSubmitted && this.gameTimeForm.invalid) {
            return;
          }

          var seekDetails = {
            action: "seekOponent",
            user: this.authenticationService.authenticatedUser,
            time: parseInt(typeof time !== 'undefined' ? time : this.gameTimeFormFields.initialtime.value),
            increment: parseInt(typeof increment !== 'undefined' ? increment : this.gameTimeFormFields.initialtimepermove.value)
          };
          this.seekOponentInterval = setInterval(function () {
            return _this3.socket.send(JSON.stringify(seekDetails));
          }, 1000);
          this.seekingOponent = true;
          this.gameTimeFormSubmitted = false;
          this.gameTimeFormShown = false;
        }
      }, {
        key: "queryPlayersOnline",
        value: function queryPlayersOnline() {
          console.log("Querying players online.");
          this.socket.send(JSON.stringify({
            user: this.user,
            action: "getPlayersOnline"
          }));
        }
      }, {
        key: "observeGame",
        value: function observeGame(playername) {
          this.cancelIntervals();
          this.router.navigate(['/observeGame/' + playername]);
        }
      }, {
        key: "cancelIntervals",
        value: function cancelIntervals() {
          clearInterval(this.seekOponentInterval);
          clearInterval(this.queryPlayersInterval);
        }
      }, {
        key: "onMessage",
        value: function onMessage(event) {
          //console.log(event);
          var data = JSON.parse(event.data);

          if (data.action === "chatMessageLobby") {
            this.displayChatMessage(data);
          }

          if (data.action === "getPlayersOnline") {
            console.log(data.players);
            this.playersOnline = data.players;
            this.countOfPlayersOnline = data.players.length;
            this.gamesInProgress = data.gamesInProgress;
          }

          if (data.action === "startGame") {
            console.log(data);
            this.cancelIntervals();
            this.router.navigate(['/playGame/' + data.gameId]);
            console.log("Game started.");
          }

          if (data.action === "gameInfo") {
            console.log("Received game info:" + data);
          }
        }
      }, {
        key: "gameTimeFormFields",
        // convenience getter for easy access to form fields
        get: function get() {
          return this.gameTimeForm.controls;
        }
      }]);

      return LobbyComponent;
    }();

    LobbyComponent.ctorParameters = function () {
      return [{
        type: _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"]
      }, {
        type: _js_services_websocketService__WEBPACK_IMPORTED_MODULE_3__["WebSocketService"]
      }, {
        type: _js_services_jwtAuthenticationService__WEBPACK_IMPORTED_MODULE_1__["JwtAuthenticationService"]
      }, {
        type: _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"]
      }];
    };

    LobbyComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Component"])({
      selector: 'app-lobby',
      template: Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(
      /*! raw-loader!./lobby.component.html */
      "./node_modules/raw-loader/dist/cjs.js!./views/lobby/lobby.component.html"))["default"],
      styles: [Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(
      /*! ./lobby.component.css */
      "./views/lobby/lobby.component.css"))["default"]]
    })], LobbyComponent);
    /***/
  },

  /***/
  "./views/login/login.component.css":
  /*!*****************************************!*\
    !*** ./views/login/login.component.css ***!
    \*****************************************/

  /*! exports provided: default */

  /***/
  function viewsLoginLoginComponentCss(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJ2aWV3cy9sb2dpbi9sb2dpbi5jb21wb25lbnQuY3NzIn0= */";
    /***/
  },

  /***/
  "./views/login/login.component.ts":
  /*!****************************************!*\
    !*** ./views/login/login.component.ts ***!
    \****************************************/

  /*! exports provided: LoginComponent */

  /***/
  function viewsLoginLoginComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "LoginComponent", function () {
      return LoginComponent;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
    /* harmony import */


    var _js_services_jwtAuthenticationService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../../js/services/jwtAuthenticationService */
    "./js/services/jwtAuthenticationService.ts");
    /* harmony import */


    var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! @angular/forms */
    "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");

    var LoginComponent = /*#__PURE__*/function () {
      function LoginComponent(router, route, http, authenticationService, formBuilder) {
        _classCallCheck(this, LoginComponent);

        this.router = router;
        this.route = route;
        this.http = http;
        this.authenticationService = authenticationService;
        this.formBuilder = formBuilder;
        this.submitted = false;
        this.loading = false;
        this.authenticationData = {};
      }

      _createClass(LoginComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {
          this.loginForm = this.formBuilder.group({
            username: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required],
            password: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]
          });
          this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        }
      }, {
        key: "redirectTo",
        value: function redirectTo(path) {
          this.router.navigate([path]);
        }
      }, {
        key: "login",
        value: function login() {
          var _this4 = this;

          console.log("Starting the authentication.");
          this.submitted = true;

          if (this.loginForm.invalid) {
            return;
          }

          this.loading = true;
          this.authenticationService.authenticate({
            username: this.f.username.value,
            password: this.f.password.value
          }) // .pipe(first())
          .subscribe(function (data) {
            _this4.router.navigate([_this4.returnUrl]);
          }, function (error) {
            // this.alertService.error(error);
            _this4.loading = false;
          });
        }
      }, {
        key: "f",
        // convenience getter for easy access to form fields
        get: function get() {
          return this.loginForm.controls;
        }
      }]);

      return LoginComponent;
    }();

    LoginComponent.ctorParameters = function () {
      return [{
        type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]
      }, {
        type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"]
      }, {
        type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
      }, {
        type: _js_services_jwtAuthenticationService__WEBPACK_IMPORTED_MODULE_4__["JwtAuthenticationService"]
      }, {
        type: _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormBuilder"]
      }];
    };

    LoginComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
      selector: 'app-login',
      template: Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(
      /*! raw-loader!./login.component.html */
      "./node_modules/raw-loader/dist/cjs.js!./views/login/login.component.html"))["default"],
      styles: [Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(
      /*! ./login.component.css */
      "./views/login/login.component.css"))["default"]]
    })], LoginComponent);
    /***/
  },

  /***/
  "./views/playingHall/playingHall.ts":
  /*!******************************************!*\
    !*** ./views/playingHall/playingHall.ts ***!
    \******************************************/

  /*! exports provided: PlayingHall */

  /***/
  function viewsPlayingHallPlayingHallTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "PlayingHall", function () {
      return PlayingHall;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _js_services_jwtAuthenticationService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./../../js/services/jwtAuthenticationService */
    "./js/services/jwtAuthenticationService.ts");
    /* harmony import */


    var _js_services_websocketService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./../../js/services/websocketService */
    "./js/services/websocketService.ts");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
    /* harmony import */


    var _node_modules_cm_chessboard_src_cm_chessboard_Chessboard_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ../../node_modules/cm-chessboard/src/cm-chessboard/Chessboard.js */
    "./node_modules/cm-chessboard/src/cm-chessboard/Chessboard.js");
    /* harmony import */


    var jquery__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! jquery */
    "./node_modules/jquery/dist/jquery.js");
    /* harmony import */


    var jquery__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_7__);

    var PlayingHall = /*#__PURE__*/function () {
      function PlayingHall($http, route, authenticationService, webSocketService) {
        var _this5 = this;

        _classCallCheck(this, PlayingHall);

        this.$http = $http;
        this.route = route;
        this.authenticationService = authenticationService;
        this.webSocketService = webSocketService;
        this.moveToHighlight = {
          variationId: null,
          moveNumber: null,
          whiteMove: true
        };
        this.chessboardUsageModes = {
          PLAYING: "P",
          OBSERVING: "O",
          ANALYZING: "A"
        };
        this.root = this;
        this.resignButtonPressed = false;
        this.MAIN_LINE = -1;
        this.chessRules = __webpack_require__(
        /*! ../../js/chessRules.js */
        "./js/chessRules.js");
        this.svgChessboard = null;
        this.castling = null;
        this.pawnPromotionMove = {
          from: null,
          to: null,
          promotion: null
        };
        this.lastMove = {
          startPosition: null,
          endPosition: null
        };
        this.positionOccurrencesMap = new Map();
        this.variationId = 0;
        this.mode = this.chessboardUsageModes.PLAYING;
        this.squareSize = 55;
        this.playingGame = null;
        this.seekingOponent = null;
        this.oponent = null;
        this.whitePlayer = true;
        this.time = 0;
        this.increment = 0;
        this.whiteMove = true;
        this.whiteClock = "00:00";
        this.blackClock = "00:00";
        this.myMove = null;
        this.whitePlayerName = "whitePlayer";
        this.whitePlayerElo = 1500;
        this.blackPlayerName = "blackPlayer";
        this.blackPlayerElo = 1500;
        this.whitePlayerEloChange = 0;
        this.blackPlayerEloChange = 0;
        this.gameResult = null;
        this.showPawnPromotionDiv = false;
        this.seekFormShown = false;
        this.annotatedMoves = [];
        this.scrollbarconfig = {
          setHeight: 400
        };
        this.chessboardProps = {
          position: "start",
          style: {
            cssClass: "default",
            showCoordinates: true,
            showBorder: false
          },
          responsive: true,
          animationDuration: 300,
          moveInputMode: _node_modules_cm_chessboard_src_cm_chessboard_Chessboard_js__WEBPACK_IMPORTED_MODULE_6__["MOVE_INPUT_MODE"].dragPiece,
          sprite: {
            url: "./assets/images/chessboard-sprite.svg",
            grid: 40 // the sprite is tiled with one piece every 40px

          }
        };
        this.currentVariation = null;
        this.drawOfferReceived = false;
        this.variations = new Map();

        this.moveInputHandler = function (event) {
          var startPosition = _this5.convertSquareToCoordinates(event.squareFrom);

          var endPosition = _this5.convertSquareToCoordinates(event.squareTo);

          var piece;
          console.log("event", event);

          if (event.type === _node_modules_cm_chessboard_src_cm_chessboard_Chessboard_js__WEBPACK_IMPORTED_MODULE_6__["INPUT_EVENT_TYPE"].moveStart) {
            piece = _this5.svgChessboard.getPiece(event.square);
          }

          if (event.type === _node_modules_cm_chessboard_src_cm_chessboard_Chessboard_js__WEBPACK_IMPORTED_MODULE_6__["INPUT_EVENT_TYPE"].moveDone) {
            var move = {
              from: event.squareFrom,
              to: event.squareTo,
              promotion: null
            };

            var validMove = _this5.chess.move(move);

            if (validMove) {
              var currentPositionAsFEN = _this5.chess.fen();

              setTimeout(function () {
                _this5.processValidMove(validMove, currentPositionAsFEN, true);
              });
            } else {
              if (_this5.pawnReachedPromotionSquare(event.squareFrom, event.squareTo)) {
                _this5.pawnPromotionMove = move;
                _this5.showPawnPromotionDiv = true;
              }

              console.warn("invalid move", move);
            }
          } else {
            return true;
          }
        };
      }

      _createClass(PlayingHall, [{
        key: "ngOnInit",
        value: function ngOnInit() {
          var _this6 = this;

          this.route.params.subscribe(function (params) {
            _this6.observedPlayer = params['observedPlayer'];
            _this6.gameId = params['gameId'];
          });
          this.whitePlayer = true;
          this.user = this.authenticationService.authenticatedUser;
          this.initialiseWebSockets();
          this.initialiseChessboard();
          this.determineInitialModeOfUsage();
          this.requestGameInfo();
        }
      }, {
        key: "ngAfterViewInit",
        value: function ngAfterViewInit() {
          setTimeout(function () {});
        }
      }, {
        key: "handleKeyboardEvent",
        value: function handleKeyboardEvent(event) {
          if (this.mode === this.chessboardUsageModes.ANALYZING) {
            var key = event.key;

            switch (key) {
              case "Left": // IE/Edge specific value

              case "ArrowLeft":
                this.goToPreviousMove();
                break;

              case "Right": // IE/Edge specific value

              case "ArrowRight":
                this.goToNextMove();
                break;
            }
          }
        }
      }, {
        key: "setupVariation",
        value: function setupVariation($event) {
          this.redrawChessboard($event.fen, $event.variationId);
        }
      }, {
        key: "onActivate",
        value: function onActivate(componentReference) {
          console.log(componentReference);
          componentReference.anyFunction(); //Below will subscribe to the searchItem emitter

          componentReference.searchItem.subscribe(function (data) {// Will receive the data from child here 
          });
        }
      }, {
        key: "initPage",
        value: function initPage() {}
      }, {
        key: "convertSquareToCoordinates",
        value: function convertSquareToCoordinates(square_SAN) {
          if (typeof square_SAN !== 'undefined') {
            var columns = 'abcdefgh';
            var rowString = square_SAN.substr(1, 1);
            var row = +rowString - 1;
            var column = columns.indexOf(square_SAN.substr(0, 1));
            var piece = this.chessboard.squares[this.findIndexOfSquare(column, row)];
            return {
              row: row,
              column: column,
              piece: piece
            };
          } else return null;
        }
      }, {
        key: "pawnReachedPromotionSquare",
        value: function pawnReachedPromotionSquare(startsquare, endsquare) {
          var pieceOnStartSquare = this.svgChessboard.getPiece(startsquare);
          var pieceOnEndSquare = this.svgChessboard.getPiece(endsquare);

          if (pieceOnStartSquare === "wp" && endsquare.indexOf("8") !== -1 || pieceOnStartSquare === "bp" && endsquare.indexOf("1") !== -1) {
            if (pieceOnStartSquare === "wp" && (pieceOnEndSquare.indexOf("b") !== -1 || pieceOnEndSquare === null) || pieceOnStartSquare === "bp" && (pieceOnEndSquare.indexOf("w") !== -1 || pieceOnEndSquare === null)) {
              return true;
            }
          }

          return false;
        }
      }, {
        key: "checkMateDelivered",
        value: function checkMateDelivered(moveNotation) {
          return moveNotation.indexOf("#") !== -1;
        }
      }, {
        key: "processValidMove",
        value: function processValidMove(validMove, currentPositionAsFEN, sendMoveToOponent) {
          var moveNotation = validMove.san;
          this.svgChessboard.setPosition(currentPositionAsFEN);
          this.svgChessboard.disableMoveInput();
          this.addAnnotation(moveNotation);
          this.highlightLastMoveInNotation();

          if (validMove.color === _node_modules_cm_chessboard_src_cm_chessboard_Chessboard_js__WEBPACK_IMPORTED_MODULE_6__["COLOR"].white) {
            if (this.mode === this.chessboardUsageModes.ANALYZING) {
              this.svgChessboard.enableMoveInput(this.moveInputHandler, _node_modules_cm_chessboard_src_cm_chessboard_Chessboard_js__WEBPACK_IMPORTED_MODULE_6__["COLOR"].black);
            }
          } else {
            this.moveNumber = this.moveNumber + 1;

            if (this.mode === this.chessboardUsageModes.ANALYZING) {
              this.svgChessboard.enableMoveInput(this.moveInputHandler, _node_modules_cm_chessboard_src_cm_chessboard_Chessboard_js__WEBPACK_IMPORTED_MODULE_6__["COLOR"].white);
            }
          }

          if (this.mode === this.chessboardUsageModes.PLAYING) {
            if (sendMoveToOponent) {
              this.sendMove(currentPositionAsFEN, moveNotation);
              this.pressClock(!this.whitePlayer);
            }

            if (this.chess.game_over()) {
              var gameResult = this.getGameResult(validMove);
              this.endGame(gameResult);
            }
          }

          this.whiteMove = !this.whiteMove;
        }
      }, {
        key: "getGameResult",
        value: function getGameResult(validMove) {
          if (this.chess.in_stalemate()) {
            return "1/2 (stalemate)";
          } else if (this.chess.insufficient_material()) {
            return "1/2 (insufficient material)";
          } else if (this.chess.in_threefold_repetition()) {
            return "1/2 (threefold repetition)";
          } else if (this.chess.in_checkmate()) {
            return validMove.color === _node_modules_cm_chessboard_src_cm_chessboard_Chessboard_js__WEBPACK_IMPORTED_MODULE_6__["COLOR"].white ? "1-0" : "0-1";
          } else {
            return "1/2 (50 move rule)";
          }
        }
      }, {
        key: "initialiseChessboard",
        value: function initialiseChessboard() {
          if (!this.svgChessboard) {
            this.svgChessboard = new _node_modules_cm_chessboard_src_cm_chessboard_Chessboard_js__WEBPACK_IMPORTED_MODULE_6__["Chessboard"](document.getElementById("newChessboardContainer"), this.chessboardProps);
            this.svgChessboard.enableMoveInput(this.moveInputHandler, _node_modules_cm_chessboard_src_cm_chessboard_Chessboard_js__WEBPACK_IMPORTED_MODULE_6__["COLOR"].white);
          }

          this.chess = new this.chessRules();
          this.chessboard = {};
          this.chessboard.element = document.getElementsByName("chessboardTable")[0];
          this.chessboard.pieces = [];
          this.chessboard.annotatedMoves = [];
          this.squareSize = 0;
          this.startPosition = {};
          this.endPosition = {};
          this.moveNumber = 0;
          this.chessboard.coordinates = {};
          var index = 0;
          var pieceIndex = 0;
          var squares = [];
          var piece;

          for (var x = 0; x <= 7; x++) {
            for (var y = 0; y <= 7; y++) {
              piece = "";
              squares[index] = {};
              squares[index].row = y;
              squares[index].column = x;

              if (y === 6) {
                piece = "BP" + x + y;
              } else if (y === 1) {
                piece = "WP" + x + y;
              } else if (y === 0) {
                if (x === 0 || x === 7) {
                  piece = "WR" + x + y;
                } else if (x === 1 || x === 6) {
                  piece = "WN" + x + y;
                } else if (x === 2 || x === 5) {
                  piece = "WB" + x + y;
                } else if (x === 3) {
                  piece = "WQ" + x + y;
                } else if (x === 4) {
                  piece = "WK" + x + y;
                }
              } else if (y === 7) {
                if (x === 0 || x === 7) {
                  piece = "BR" + x + y;
                } else if (x === 1 || x === 6) {
                  piece = "BN" + x + y;
                } else if (x === 2 || x === 5) {
                  piece = "BB" + x + y;
                } else if (x === 3) {
                  piece = "BQ" + x + y;
                } else if (x === 4) {
                  piece = "BK" + x + y;
                }
              }

              if (piece !== "") {
                squares[index].piece = piece;
                this.chessboard.pieces[pieceIndex] = {};
                this.chessboard.pieces[pieceIndex].row = y;
                this.chessboard.pieces[pieceIndex].column = x;
                this.chessboard.pieces[pieceIndex].piece = piece;
                pieceIndex++;
              } else {
                squares[index].piece = "empty";
              }

              index++;
            }
          }

          this.chessboard.squares = squares;
        }
      }, {
        key: "determineInitialModeOfUsage",
        value: function determineInitialModeOfUsage() {
          if (typeof this.observedPlayer !== 'undefined') {
            this.mode = this.chessboardUsageModes.OBSERVING;
          } else if (this.route.snapshot['_routerState'].url.indexOf("analyzeGame") !== -1) {
            this.mode = this.chessboardUsageModes.ANALYZING;
          } else {
            this.mode = this.chessboardUsageModes.PLAYING;
          }
        }
      }, {
        key: "requestGameInfo",
        value: function requestGameInfo() {
          var _this7 = this;

          if (this.mode === this.chessboardUsageModes.PLAYING) {
            var getGameInfoMessage = {
              action: "getGameInfo",
              user: this.user,
              gameId: this.gameId
            };
            console.log("Sending request game info message:" + JSON.stringify(getGameInfoMessage));
            this.socket.send(JSON.stringify(getGameInfoMessage));
          } else if (this.mode === this.chessboardUsageModes.OBSERVING) {
            this.$http.get('http://localhost:8082/observe/' + this.observedPlayer, {
              headers: {
                'Authorization': 'Bearer:' + this.authenticationService.getJwtToken
              }
            }).subscribe(function (game) {
              _this7.observeGame(game);
            }, function (data) {
              console.log("Retrieval of moves of the observed game failed:" + data.error);
            });
          }
        }
      }, {
        key: "stopClocks",
        value: function stopClocks() {
          console.log("Stopping clock");
          clearTimeout(this.clockTimer);
        }
      }, {
        key: "ngOnDestroy",
        value: function ngOnDestroy() {
          if (this.mode === this.chessboardUsageModes.OBSERVING) {
            this.stopObservingGame();
          }

          this.stopClocks();
        }
      }, {
        key: "stopObservingGame",
        value: function stopObservingGame() {
          this.$http.get('//localhost:8082/observe/' + this.observedPlayer + "/cancel", {}).toPromise().then(function () {
            return console.log("Removing of observer successfull.");
          }, function (data) {
            return console.log("Removing of observer failed:" + data.error);
          });
        }
      }, {
        key: "setMyMove",
        value: function setMyMove(isItMyMove) {
          this.myMove = isItMyMove;
        }
      }, {
        key: "getChessboardCoordinates",
        value: function getChessboardCoordinates(obj) {
          var top;
          top = 0;

          if (obj.offsetParent) {
            do {
              top += obj.offsetTop;
            } while (obj = obj.offsetParent);
          }

          this.chessboard.coordinates.left = this.chessboard.element.getBoundingClientRect().left;
          this.chessboard.coordinates.right = this.chessboard.element.getBoundingClientRect().right;
          this.chessboard.coordinates.bottom = this.chessboard.element.getBoundingClientRect().bottom;
          this.chessboard.coordinates.top = top; // TODO squareSize =
          // (chessboard.coordinates.right -
          // chessboard.coordinates.left) / 8;

          this.squareSize = 55; // //console.log("Square size:" + squareSize);
          // //console.log(chessboard.coordinates);
        }
      }, {
        key: "activateAnalysisMode",
        value: function activateAnalysisMode() {
          this.mode = this.chessboardUsageModes.ANALYZING;
        }
      }, {
        key: "determineRowColumn",
        value: function determineRowColumn(x, y, whitePlayer) {
          var coordinates = {
            x: 0,
            y: 0
          };
          coordinates.x = (x - this.chessboard.coordinates.left) / this.squareSize;
          coordinates.y = 8 - (y - this.chessboard.coordinates.top) / this.squareSize;
          var row = !whitePlayer ? 7 - Math.floor(coordinates.y) : Math.floor(coordinates.y);
          var column = !whitePlayer ? 7 - Math.floor(coordinates.x) : Math.floor(coordinates.x);
          return {
            row: row,
            column: column,
            piece: this.chessboard.squares[this.findIndexOfSquare(column, row)].piece
          };
        }
      }, {
        key: "getInitialPositionOfPiece",
        value: function getInitialPositionOfPiece(piece) {
          var coordinates = {
            row: null,
            column: null,
            piece: null,
            index: null
          };

          for (var index = 0; index < this.chessboard.pieces.length; index++) {
            if (this.chessboard.pieces[index].piece === piece) {
              coordinates.row = this.chessboard.pieces[index].row;
              coordinates.column = this.chessboard.pieces[index].column;
              coordinates.piece = piece;
              coordinates.index = index;
              return coordinates;
            }
          }
        }
      }, {
        key: "goToNextMove",
        value: function goToNextMove() {
          var move;

          if (!this.currentVariation) {
            move = this.chessboard.annotatedMoves[this.moveNumber];

            if (!this.whiteMove && move.blackMove !== "") {
              this.redrawChessboard(move.chessboardAfterBlackMove, this.MAIN_LINE);
            } else if (this.whiteMove && this.chessboard.annotatedMoves.length > this.moveNumber) {
              this.redrawChessboard(move.chessboardAfterWhiteMove, this.MAIN_LINE);
            }
          } else {
            move = this.currentVariation.moves[this.moveNumber - this.currentVariation.moveNumber];
            var variationId = this.currentVariation.variationId;

            if (!this.whiteMove && move.blackMove !== "") {
              this.redrawChessboard(move.chessboardAfterBlackMove, variationId);
            } else if (this.whiteMove && this.chessboard.annotatedMoves.length > this.moveNumber) {
              this.redrawChessboard(move.chessboardAfterWhiteMove, variationId);
            }
          }
        }
      }, {
        key: "goToPreviousMove",
        value: function goToPreviousMove() {
          var move;

          if (!this.currentVariation) {
            move = this.chessboard.annotatedMoves[this.moveNumber - 1];

            if (!this.whiteMove && this.moveNumber - 1 >= 0) {
              this.redrawChessboard(move.chessboardAfterBlackMove, this.MAIN_LINE);
            } else if (this.whiteMove) {
              this.redrawChessboard(move.chessboardAfterWhiteMove, this.MAIN_LINE);
            }
          } else {
            move = this.currentVariation.moves[this.moveNumber - this.currentVariation["this"].moveNumber];
            var variationId = this.currentVariation.variationId;

            if (!this.whiteMove && this.moveNumber - 1 >= 0) {
              this.redrawChessboard(move.chessboardAfterBlackMove, variationId);
            } else if (this.whiteMove) {
              this.redrawChessboard(move.chessboardAfterWhiteMove, variationId);
            }
          }
        }
      }, {
        key: "goToFirstMove",
        value: function goToFirstMove() {
          var move = this.chessboard.annotatedMoves[0];
          this.redrawChessboard(move.chessboardAfterWhiteMove, this.MAIN_LINE);
        }
      }, {
        key: "goToLastMove",
        value: function goToLastMove() {
          var lastMoveNumber = this.chessboard.annotatedMoves.length - 1;
          var move = this.chessboard.annotatedMoves[lastMoveNumber];

          if (move.blackMove !== "") {
            this.redrawChessboard(move.chessboardAfterWhiteMove, this.MAIN_LINE);
          } else {
            this.redrawChessboard(move.chessboardAfterWhiteMove, this.MAIN_LINE);
          }
        }
      }, {
        key: "isRookMoveLegal",
        value: function isRookMoveLegal(startPosition, endPosition, kingInCheck) {
          var isLegal = true;

          if (endPosition.row === startPosition.row) {
            for (var x = 1; x < Math.abs(endPosition.column - startPosition.column); x++) {
              var square = this.findSquare(endPosition.column > startPosition.column ? startPosition.column + x : startPosition.column - x, startPosition.row);

              if (!kingInCheck && !this.isSquareEmpty(square) || kingInCheck && !this.isSquareEmpty(square) && !this.isPieceOnSquare(square, "K")) {
                isLegal = false;
              }
            }
          } else if (endPosition.column === startPosition.column) {
            for (var _x = 1; _x < Math.abs(endPosition.row - startPosition.row); _x++) {
              var _square = this.findSquare(startPosition.column, endPosition.row > startPosition.row ? startPosition.row + _x : startPosition.row - _x);

              if (!kingInCheck && !this.isSquareEmpty(_square) || kingInCheck && !this.isSquareEmpty(_square) && !this.isPieceOnSquare(_square, "K")) {
                isLegal = false;
              }
            }
          } else {
            isLegal = false;
          } // console.log("Rook move legal:" + isLegal);


          return isLegal;
        }
      }, {
        key: "isPawnMoveLegal",
        value: function isPawnMoveLegal(startPosition, endPosition, whitePlayer, kingInCheck) {
          if (Math.abs(startPosition.row - endPosition.row) > 2 || Math.abs(startPosition.column - endPosition.column) > 1) {
            return false;
          } else if (this.whiteMove === true && endPosition.row < startPosition.row || this.whiteMove === false && endPosition.row > startPosition.row) {
            return false;
          } else if (Math.abs(!whitePlayer ? startPosition.row - endPosition.row : endPosition.row - startPosition.row) === 1 && Math.abs(startPosition.column - endPosition.column) === 1 && (endPosition.piece !== "empty" || kingInCheck)) {
            return true;
          } else if (Math.abs(!whitePlayer ? startPosition.row - endPosition.row : endPosition.row - startPosition.row) === 1 && startPosition.column - endPosition.column === 0 && endPosition.piece === "empty") {
            return true;
          } else if (Math.abs(!whitePlayer ? startPosition.row - endPosition.row : endPosition.row - startPosition.row) === 2 && startPosition.column - endPosition.column === 0) {
            var initialPositionOfPiece = this.getInitialPositionOfPiece(startPosition.piece);
            return startPosition.row === initialPositionOfPiece.row && startPosition.column === initialPositionOfPiece.column;
          } else if (!whitePlayer ? startPosition.row - endPosition.row : endPosition.row - startPosition.row === 1 && Math.abs(endPosition.column - startPosition.column) === 1) {
            return this.pieceTakenEnPassant(startPosition, endPosition, whitePlayer);
          }
        }
      }, {
        key: "pieceTakenEnPassant",
        value: function pieceTakenEnPassant(startPosition, endPosition, whitePlayer) {
          // console.log("En passant  called.");
          console.log(startPosition.piece.indexOf("P") !== -1);
          var squaresMovedForward;

          if (this.myMove === true) {
            squaresMovedForward = !whitePlayer ? startPosition.row - endPosition.row : endPosition.row - startPosition.row;
          } else {
            squaresMovedForward = Math.abs(startPosition.row - endPosition.row);
          }

          if (startPosition.piece.indexOf("P") !== -1 && squaresMovedForward === 1 && Math.abs(endPosition.column - startPosition.column) === 1) {
            // console.log(lastMove);
            if (this.lastMove.endPosition.piece.indexOf("P") !== -1 && Math.abs(this.lastMove.startPosition.row - this.lastMove.endPosition.row) === 2 && this.lastMove.endPosition.column === endPosition.column) {
              // console.log("En passant.");
              this.enPassant = true;
              return true;
            } else return false;
          }
        }
      }, {
        key: "canRookMateBePrevented",
        value: function canRookMateBePrevented(chessboard, kingPosition, checkingPiecePosition, whiteMove) {
          var matePreventionPossible = false;

          if (kingPosition.row === checkingPiecePosition.row) {
            for (var x = 1; x < Math.abs(kingPosition.column - checkingPiecePosition.column); x++) {
              if (this.canAnyOponentsPieceMoveToSquare(chessboard, kingPosition.row, kingPosition.column > checkingPiecePosition.column ? checkingPiecePosition.column + x : checkingPiecePosition.column - x, whiteMove, null, null) === true) {
                matePreventionPossible = true;
                break;
              }
            }
          } else if (kingPosition.column === checkingPiecePosition.column) {
            for (var _x2 = 1; _x2 < Math.abs(kingPosition.row - checkingPiecePosition.row); _x2++) {
              if (this.canAnyOponentsPieceMoveToSquare(chessboard, kingPosition.row > checkingPiecePosition.row ? checkingPiecePosition.row + _x2 : checkingPiecePosition.row - _x2, kingPosition.column, whiteMove, null, null) === true) {
                matePreventionPossible = true;
                break;
              }
            }
          }

          return matePreventionPossible;
        }
      }, {
        key: "canBishopMateBePrevented",
        value: function canBishopMateBePrevented(chessboard, kingPosition, checkingPiecePosition, whiteMove) {
          console.log("Can bishop mate be prevented?");
          var matePreventionPossible = false;

          if (kingPosition.row > checkingPiecePosition.row && kingPosition.column > checkingPiecePosition.column) {
            for (var x = 1; x < kingPosition.row - checkingPiecePosition.row; x++) {
              if (this.canAnyOponentsPieceMoveToSquare(chessboard, checkingPiecePosition.row + x, checkingPiecePosition.column + x, whiteMove, null, null) === true) {
                console.log("Yes - option 1");
                matePreventionPossible = true;
                break;
              }
            }
          } else if (kingPosition.row > checkingPiecePosition.row && kingPosition.column < checkingPiecePosition.column) {
            for (var _x3 = 1; _x3 < this.endPosition.row - checkingPiecePosition.row; _x3++) {
              if (this.canAnyOponentsPieceMoveToSquare(chessboard, kingPosition.row - _x3, kingPosition.column + _x3, whiteMove, null, null) === true) {
                console.log("Yes - option 2");
                matePreventionPossible = true;
                break;
              }
            }
          } else if (kingPosition.row < checkingPiecePosition.row && kingPosition.column > checkingPiecePosition.column) {
            for (var _x4 = 1; _x4 < this.startPosition.row - this.endPosition.row; _x4++) {
              if (this.canAnyOponentsPieceMoveToSquare(chessboard, kingPosition.row + _x4, kingPosition.column - _x4, whiteMove, null, null) === true) {
                console.log("Yes - option 3");
                matePreventionPossible = true;
                break;
              }
            }
          } else if (kingPosition.row < checkingPiecePosition.row && kingPosition.column < checkingPiecePosition.column) {
            for (var _x5 = 1; _x5 < checkingPiecePosition.row - this.endPosition.row; _x5++) {
              if (this.canAnyOponentsPieceMoveToSquare(chessboard, kingPosition.row + _x5, kingPosition.column + _x5, whiteMove, null, null) === true) {
                console.log("Yes - option 4");
                matePreventionPossible = true;
                break;
              }
            }
          }

          return matePreventionPossible;
        }
      }, {
        key: "canMateBePrevented",
        value: function canMateBePrevented(chessboard, kingPosition, checkingPiecePosition, whiteMove) {
          var matePreventionPossible = false;

          if (this.canAnyOponentsPieceMoveToSquare(chessboard, checkingPiecePosition.row, checkingPiecePosition.column, whiteMove, true)) {
            matePreventionPossible = true;
          } else {
            switch (checkingPiecePosition.piece.substr(1, 1)) {
              /*	case "P":
                      if (this.canAnyOponentsPieceMoveToSquare(
                              chessboard,
                              checkingPiecePosition.row,
                              checkingPiecePosition.column,
                              whiteMove)) {
                            matePreventionPossible = true;
                      }
                      break;
                    case "N":
                      if (this.canAnyOponentsPieceMoveToSquare(
                              chessboard,
                              checkingPiecePosition.row,
                              checkingPiecePosition.column,
                              whiteMove)) {
                            matePreventionPossible = true;
                      }
                      break;*/
              case "B":
                matePreventionPossible = this.canBishopMateBePrevented(chessboard, kingPosition, checkingPiecePosition, whiteMove);
                break;

              case "R":
                matePreventionPossible = this.canRookMateBePrevented(chessboard, kingPosition, checkingPiecePosition, whiteMove);
                break;

              case "Q":
                if (this.canBishopMateBePrevented(chessboard, kingPosition, checkingPiecePosition, whiteMove) === true || this.canRookMateBePrevented(chessboard, kingPosition, checkingPiecePosition, whiteMove) === true) {
                  matePreventionPossible = true;
                }

                break;
            }
          }

          return matePreventionPossible;
        }
      }, {
        key: "isKingMoveLegal",
        value: function isKingMoveLegal(startPosition, endPosition, whitePlayer, isKingInCheck) {
          if (Math.abs(endPosition.row - startPosition.row) <= 1 && Math.abs(endPosition.column - startPosition.column) <= 1) {
            if (startPosition.piece.indexOf('W') !== -1 ? this.isWhitePieceOnSquare(endPosition) : this.isBlackPieceOnSquare(endPosition)) {
              //same coloured piece as the king is on the target square, king move is illegal
              return false;
            } else {
              return !this.canAnyOponentsPieceMoveToSquare(this.chessboard, endPosition.row, endPosition.column, startPosition.piece.indexOf('W') !== -1, true, isKingInCheck);
            }
          } else if (endPosition.row === startPosition.row && Math.abs(endPosition.column - startPosition.column) === 2 && endPosition.column === 6) {
            if (whitePlayer === true && this.isSquareEmpty(this.findSquare(5, 0)) && !this.canAnyOponentsPieceMoveToSquare(this.chessboard, 0, 5, this.whiteMove, null, null) && this.isSquareEmpty(this.findSquare(6, 0)) && !this.canAnyOponentsPieceMoveToSquare(this.chessboard, 0, 6, this.whiteMove, null, null) && this.hasKingAlreadyMoved("white") === false) {
              console.log("White Short castle");
              this.castling = "0-0";
              return true;
            }

            if (whitePlayer === false && endPosition.column === 6 && this.isSquareEmpty(this.findSquare(5, 7)) && !this.canAnyOponentsPieceMoveToSquare(this.chessboard, 7, 5, this.whiteMove, null, null) && this.isSquareEmpty(this.findSquare(6, 7)) && !this.canAnyOponentsPieceMoveToSquare(this.chessboard, 7, 6, this.whiteMove, null) && this.hasKingAlreadyMoved("black") === false) {
              console.log("Black Short castle");
              this.castling = "0-0";
              return true;
            }
          } else if (endPosition.row === startPosition.row && Math.abs(endPosition.column - startPosition.column) === 2 && endPosition.column === 2) {
            if (whitePlayer === true && this.isSquareEmpty(this.findSquare(2, 0)) && !this.canAnyOponentsPieceMoveToSquare(this.chessboard, 0, 2, this.whiteMove, true) && this.isSquareEmpty(this.findSquare(3, 0)) && !this.canAnyOponentsPieceMoveToSquare(this.chessboard, 0, 3, this.whiteMove, true) && this.hasKingAlreadyMoved("white") === false) {
              console.log("White Long castle");
              this.castling = "0-0-0";
              return true;
            }

            if (whitePlayer === false && this.isSquareEmpty(this.findSquare(2, 7)) && !this.canAnyOponentsPieceMoveToSquare(this.chessboard, 7, 2, this.whiteMove, true) && this.isSquareEmpty(this.findSquare(3, 7)) && !this.canAnyOponentsPieceMoveToSquare(this.chessboard, 7, 3, this.whiteMove, true) && this.hasKingAlreadyMoved("black") === false) {
              console.log("Black Long castle");
              this.castling = "0-0-0";
              return true;
            }
          } else {
            console.log("King else condition.");
            console.log(startPosition);
            console.log(endPosition);
            console.log(whitePlayer);
            return false;
          }
        }
      }, {
        key: "isBishopMoveLegal",
        value: function isBishopMoveLegal(startPosition, endPosition, kingInCheck) {
          var isLegal = true;

          if (Math.abs(endPosition.row - startPosition.row) === Math.abs(endPosition.column - startPosition.column)) {
            if (endPosition.row > startPosition.row && endPosition.column > startPosition.column || endPosition.row < startPosition.row && endPosition.column < startPosition.column) {
              for (var x = 1; x < endPosition.row - startPosition.row; x++) {
                var square = this.findSquare(startPosition.column + x, startPosition.row + x);

                if (!kingInCheck && !this.isSquareEmpty(square) || kingInCheck && !this.isSquareEmpty(square) && !this.isPieceOnSquare(square, "K")) {
                  // console.log("Case1");
                  isLegal = false;
                  break;
                }
              }
            } else if (endPosition.row > startPosition.row && endPosition.column < startPosition.column) {
              for (var _x6 = 1; _x6 < endPosition.row - startPosition.row; _x6++) {
                var _square2 = this.findSquare(endPosition.column + _x6, endPosition.row - _x6);

                if (!kingInCheck && !this.isSquareEmpty(_square2) || kingInCheck && !this.isSquareEmpty(_square2) && !this.isPieceOnSquare(_square2, "K")) {
                  console.log(_square2.piece);
                  isLegal = false;
                  break;
                }
              }
            } else if (endPosition.row < startPosition.row && endPosition.column > startPosition.column) {
              for (var _x7 = 1; _x7 < startPosition.row - endPosition.row; _x7++) {
                var _square3 = this.findSquare(endPosition.column - _x7, endPosition.row + _x7);

                if (!kingInCheck && !this.isSquareEmpty(_square3) || kingInCheck && !this.isSquareEmpty(_square3) && !this.isPieceOnSquare(_square3, "K")) {
                  // console.log("Case3");
                  isLegal = false;
                  break;
                }
              }
            }
            /*     else if (endPosition.row < startPosition.row
                     && endPosition.column < startPosition.column) {
                     for (let x = 1; x < startPosition.row
                     - endPosition.row; x++) {
                         let square = this.findSquare(
                             endPosition.column + x,
                             endPosition.row + x)
                         if ((!kingInCheck && !this.isSquareEmpty(square)) ||
                             (kingInCheck && !this.isSquareEmpty(square) && !isPieceOnSquare(square, "K"))) {
                               // console.log("Case4");
                             isLegal = false;
                             break;
                         }
                         }
                   }*/

          } else {
            // console.log("Case 5");
            isLegal = false;
          } // console.log("Bishop move legal:" + isLegal);


          return isLegal;
        }
      }, {
        key: "checkLegalityOfMove",
        value: function checkLegalityOfMove(startPosition, endPosition, whitePlayer, isKingInCheck) {
          if (typeof endPosition === 'undefined' || startPosition.piece === "empty" || endPosition.row === startPosition.row && endPosition.column === startPosition.column || this.isWhitePieceOnSquare(startPosition) && this.isWhitePieceOnSquare(endPosition) || this.isBlackPieceOnSquare(startPosition) && this.isBlackPieceOnSquare(endPosition)) {
            return false;
          }

          switch (startPosition.piece.substr(1, 1)) {
            case "N":
              if ((Math.abs(startPosition.row - endPosition.row) === 2 && Math.abs(startPosition.column - endPosition.column) === 1 || Math.abs(startPosition.row - endPosition.row) === 1 && Math.abs(startPosition.column - endPosition.column) === 2) && ((this.whiteMove ? this.isBlackPieceOnSquare(endPosition) : this.isWhitePieceOnSquare(endPosition)) || this.isSquareEmpty(endPosition) || isKingInCheck)) {
                return true;
              } else {
                return false;
              }

            case "P":
              return this.isPawnMoveLegal(startPosition, endPosition, whitePlayer, isKingInCheck);

            case "K":
              return this.isKingMoveLegal(startPosition, endPosition, this.mode === this.chessboardUsageModes.ANALYZING ? this.whiteMove : whitePlayer, null);

            case "B":
              return this.isBishopMoveLegal(startPosition, endPosition, isKingInCheck);

            case "R":
              return this.isRookMoveLegal(startPosition, endPosition, isKingInCheck);

            case "Q":
              return this.isBishopMoveLegal(startPosition, endPosition, isKingInCheck) || this.isRookMoveLegal(startPosition, endPosition, isKingInCheck);

            default:
              return true;
          }
        }
      }, {
        key: "isSquareEmpty",
        value: function isSquareEmpty(square) {
          return square.piece === "empty";
        }
      }, {
        key: "isBlackPieceOnSquare",
        value: function isBlackPieceOnSquare(square) {
          return square.piece.indexOf("W") === -1 && !this.isSquareEmpty(square);
        }
      }, {
        key: "isWhitePieceOnSquare",
        value: function isWhitePieceOnSquare(square) {
          return square.piece.indexOf("W") !== -1 && !this.isSquareEmpty(square);
        }
      }, {
        key: "isPieceOnSquare",
        value: function isPieceOnSquare(square, piece) {
          return square.piece.indexOf(piece) !== -1;
        }
      }, {
        key: "canAnyOponentsPieceMoveToSquare",
        value: function canAnyOponentsPieceMoveToSquare(chessboard, row, column, whiteMove, ignoreKings) {
          var isKingInCheck = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
          var pieceFound = false;
          var targetSquare = this.findSquare(column, row);
          var colour = whiteMove ? "black" : "white";
          console.log("Can any " + colour + " piece move to square " + this.getSquareAsString(targetSquare) + "?");

          for (var i = 0; i < chessboard.squares.length; i++) {
            var initialSquare = chessboard.squares[i];

            if (ignoreKings === true && initialSquare.piece.indexOf('K') !== -1) {
              continue;
            }

            if (!this.isSquareEmpty(initialSquare)) {
              if (whiteMove === true && this.isBlackPieceOnSquare(initialSquare) || whiteMove === false && this.isWhitePieceOnSquare(initialSquare)) {
                if (this.checkLegalityOfMove(initialSquare, targetSquare, this.whitePlayer, isKingInCheck) === true) {
                  console.log("Following piece can move to target square " + this.getSquareAsString(targetSquare) + ": " + initialSquare.piece + ".");
                  pieceFound = true;
                  break;
                }
              }
            }
          }

          return pieceFound;
        }
      }, {
        key: "isKingMated",
        value: function isKingMated(chessboard, kingPosition, checkingPiecePosition) {
          var x = [1, 1, 1, -1, -1, -1, 0, 0];
          var y = [0, 1, -1, 0, 1, -1, 1, -1];
          var numberOfLegalSquareForKingMove = 8;

          for (var i = 0; i < x.length; i++) {
            var targetSquareIndex = this.findIndexOfSquare(kingPosition.column + x[i], kingPosition.row + y[i]);
            var targetSquare = chessboard.squares[targetSquareIndex];

            if (typeof targetSquare !== 'undefined' && this.isKingMoveLegal(kingPosition, targetSquare, this.whitePlayer, true) === false) {
              console.log("Retracting square:" + this.getSquareAsString(targetSquare));
              numberOfLegalSquareForKingMove--;
            } else if (typeof targetSquare === 'undefined') {
              console.log("Retracting invalid square:" + (kingPosition.column + x[i]) + " " + (kingPosition.row + y[i]));
              numberOfLegalSquareForKingMove--;
            } else {
              console.log("Valid square for king move:" + this.getSquareAsString(targetSquare));
            }
          }

          if (numberOfLegalSquareForKingMove > 0) {
            // console.log("King not mated:"
            // + numberOfLegalSquareForKingMove);
            return false;
          } else {
            console.log("King has no squares.");

            if (this.canMateBePrevented(chessboard, kingPosition, checkingPiecePosition, this.whiteMove) === true) {
              console.log("Mate can be prevented.");
              return false;
            } // console.log("King is mated.");
            else {
                return true;
              }
          }
        }
      }, {
        key: "isKingInCheckOrAndMate",
        value: function isKingInCheckOrAndMate(chessboard, whiteMove, startPosition, endPosition) {
          var _this8 = this;

          var kingPosition = {
            row: null,
            column: null,
            piece: null
          };
          var kingInCheckOrAndMate = {
            check: false,
            mate: false
          };
          chessboard.squares.forEach(function (square) {
            if (endPosition.piece.indexOf("W") !== -1 ? square.piece.indexOf("BK") !== -1 : square.piece.indexOf("WK") !== -1) {
              kingPosition.row = square.row;
              kingPosition.column = square.column;
              kingPosition.piece = square.piece;
            }
          });

          if (this.checkLegalityOfMove(endPosition, kingPosition, whiteMove, false) === true) {
            console.log("Checking piece " + endPosition.piece);
            kingInCheckOrAndMate.check = true;
            kingInCheckOrAndMate.mate = this.isKingMated(chessboard, kingPosition, endPosition);
          } else {
            chessboard.squares.forEach(function (square) {
              if (whiteMove === false ? _this8.isBlackPieceOnSquare(square) : _this8.isWhitePieceOnSquare(square)) {
                if (_this8.checkLegalityOfMove(square, kingPosition, whiteMove, false) === true) {
                  console.log("Checking piece " + square.piece);
                  kingInCheckOrAndMate.check = true;
                  kingInCheckOrAndMate.mate = _this8.isKingMated(chessboard, kingPosition, endPosition);
                }
              }
            });
          }

          return kingInCheckOrAndMate;
        }
        /*   highlightLastMoveInNotation(whiteMoveToHighlight:boolean, moveNumber:number, variationId:number){
              let elementId:string;
                  if (whiteMoveToHighlight) {
                  if (variationId === this.MAIN_LINE) {
                      elementId = "annotatedMoveWhite" + moveNumber;
                  } else {
                      elementId = 'moveOfVariationNo' + variationId + "White" + moveNumber;
                  }
              } else {
                  //decreasing as in the FEN after black move the moveNumber is increased
                  moveNumber = moveNumber - 1;
                  if (variationId === this.MAIN_LINE) {
                      elementId = "annotatedMoveBlack" + moveNumber;
                  } else {
                      elementId = 'moveOfVariationNo' + variationId + "Black" + moveNumber;
                  }
              }
                   $('td[id ^= "annotatedMove"]').css('font-weight', 'normal');
              $('a[id ^= "moveOfVariation"]').css('font-weight', 'normal');
              $("#" + elementId).css('font-weight', 'bold');
              } */

      }, {
        key: "redrawChessboard",
        value: function redrawChessboard(fen, variationId) {
          //redrawChessboard  (currentSquares, elementId, whiteMove, moveNo, variationId, redrawPreviousMove) {
          var fenParts = fen.split(" ");
          var lastMoveNumber = parseInt(fenParts[5]);
          var whiteMoveToRedraw = fenParts[1] === _node_modules_cm_chessboard_src_cm_chessboard_Chessboard_js__WEBPACK_IMPORTED_MODULE_6__["COLOR"].black ? true : false;
          var elementId;

          if (variationId === this.MAIN_LINE) {
            this.currentVariation = null;
          } else {
            this.currentVariation = this.variations.get(variationId);
            ;
          }

          this.whiteMove = whiteMoveToRedraw;
          this.moveNumber = whiteMoveToRedraw ? lastMoveNumber - 1 : lastMoveNumber - 2;
          this.highlightLastMoveInNotation();
          this.whiteMove = !this.whiteMove;

          if (!whiteMoveToRedraw) {
            this.moveNumber = this.moveNumber + 1;
          }

          this.chess.load(fen);
          this.svgChessboard.setPosition(fen);

          if (this.mode === this.chessboardUsageModes.ANALYZING) {
            var color = this.whiteMove ? _node_modules_cm_chessboard_src_cm_chessboard_Chessboard_js__WEBPACK_IMPORTED_MODULE_6__["COLOR"].white : _node_modules_cm_chessboard_src_cm_chessboard_Chessboard_js__WEBPACK_IMPORTED_MODULE_6__["COLOR"].black;
            this.svgChessboard.enableMoveInput(this.moveInputHandler, color);
            this.chessboard.squares = JSON.parse(JSON.stringify(fen));
          }
        }
      }, {
        key: "drawLastMove",
        value: function drawLastMove(startPosition, endPosition) {
          console.log("Drawing move");
          console.log(startPosition, endPosition);
          var chessboardsize = document.getElementById("chessboardOverlay").offsetWidth;
          var squaresize = Math.floor(chessboardsize / 8);
          this.createLine(this.whitePlayer ? (startPosition.column + 1) * squaresize - squaresize / 2 : (8 - startPosition.column) * squaresize - squaresize / 2, this.whitePlayer ? (8 - startPosition.row) * squaresize - squaresize / 2 : startPosition.row * squaresize + squaresize / 2, this.whitePlayer ? (endPosition.column + 1) * squaresize - squaresize / 2 : (8 - endPosition.column) * squaresize - squaresize / 2, this.whitePlayer ? (8 - endPosition.row) * squaresize - (!this.whiteMove ? 0.5 * squaresize : squaresize / 2) : endPosition.row * squaresize + (!this.whiteMove ? 0.5 * squaresize : squaresize / 2));
          this.eraseAllHighlightedSquares();
          this.highlightSquare(startPosition, squaresize, squaresize);
          this.highlightSquare(endPosition, squaresize, squaresize);
        }
      }, {
        key: "eraseAllHighlightedSquares",
        value: function eraseAllHighlightedSquares() {
          jquery__WEBPACK_IMPORTED_MODULE_7__(".rect").remove();
        }
      }, {
        key: "highlightSquare",
        value: function highlightSquare(square, width, height) {
          var y = this.whitePlayer ? (7 - square.row) * width : square.row * width;
          var x = this.whitePlayer ? square.column * width : (7 - square.column) * width;
          var svgNS = "http://www.w3.org/2000/svg";
          var rectangular = document.createElementNS(svgNS, "rect");
          rectangular.setAttributeNS(null, 'class', 'rect');
          rectangular.setAttributeNS(null, 'x', x.toString());
          rectangular.setAttributeNS(null, 'y', y.toString());
          rectangular.setAttributeNS(null, 'width', width.toString());
          rectangular.setAttributeNS(null, 'height', height.toString());
          rectangular.setAttributeNS(null, 'style', 'fill:none;stroke:yellow;stroke-width:2');
          document.getElementById("svgId").appendChild(rectangular);
          return rectangular;
        }
      }, {
        key: "createLineElement",
        value: function createLineElement(x1, y1, x2, y2) {
          var svgNS = "http://www.w3.org/2000/svg";
          var line = document.createElementNS(svgNS, "path");
          line.setAttributeNS(null, "id", "arrow");
          line.setAttributeNS(null, "stroke-width", '4');
          line.setAttributeNS(null, "marker-end", "url(#head)");
          line.setAttributeNS(null, "fill", "none");
          line.setAttributeNS(null, "stroke", "blue");
          line.setAttributeNS(null, "opacity", "0.2");
          line.setAttributeNS(null, "d", 'M' + Math.floor(x1) + " " + Math.floor(y1) + " " + Math.floor(x2) + " " + Math.floor(y2));
          return line;
        }
      }, {
        key: "createLine",
        value: function createLine(x1, y1, x2, y2) {
          jquery__WEBPACK_IMPORTED_MODULE_7__("#arrow").remove();
          var line = this.createLineElement(x1, y1, x2, y2);
          document.getElementById("svgId").appendChild(line);
        }
      }, {
        key: "movePieceToCoordinates",
        value: function movePieceToCoordinates(piece, row, column) {
          var top = (this.getInitialPositionOfPiece(piece).row - row) * this.squareSize + 0.13 * this.squareSize;
          var left = (column - this.getInitialPositionOfPiece(piece).column) * this.squareSize + 0.13 * this.squareSize;
          jquery__WEBPACK_IMPORTED_MODULE_7__("#" + piece).css({
            top: this.whitePlayer ? top + 'px' : top * -1 + 0.26 * this.squareSize + 'px',
            left: this.whitePlayer ? left + 'px' : left * -1 + 0.26 * this.squareSize + 'px'
          });
        }
      }, {
        key: "movePieceOnBoard",
        value: function movePieceOnBoard(element, startPosition, endPosition, whitePlayer) {
          var top = (this.getInitialPositionOfPiece(startPosition.piece).row - endPosition.row) * this.squareSize + 0.13 * this.squareSize;
          var left = (endPosition.column - this.getInitialPositionOfPiece(startPosition.piece).column) * this.squareSize + 0.13 * this.squareSize;
          element.css({
            top: whitePlayer ? top + 'px' : top * -1 + 0.26 * this.squareSize + 'px',
            left: whitePlayer ? left + 'px' : left * -1 + 0.26 * this.squareSize + 'px'
          });
        }
      }, {
        key: "updateChessboardAfterMove",
        value: function updateChessboardAfterMove(startPiece, element, startSquare, endSquare, ownMove, whitePlayer, promotedPiece) {
          console.log("Position before start updatechessboard:");

          if (this.chessboard.annotatedMoves.length > 0 && typeof this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined') {
            this.printSquares(this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove);
          }

          if (this.chessboard.annotatedMoves.length > 0 && typeof this.chessboard.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' && this.chessboard.annotatedMoves[0].chessboardAfterBlackMove.length !== 0) {
            this.printSquares(this.chessboard.annotatedMoves[0].chessboardAfterBlackMove);
          }

          var capture = false;
          this.movePieceOnBoard(element, startSquare, endSquare, whitePlayer);
          console.log("Position vefore en passant:");

          if (this.chessboard.annotatedMoves.length > 0 && typeof this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined') {
            this.printSquares(this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove);
          }

          if (this.chessboard.annotatedMoves.length > 0 && typeof this.chessboard.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' && this.chessboard.annotatedMoves[0].chessboardAfterBlackMove.length !== 0) {
            this.printSquares(this.chessboard.annotatedMoves[0].chessboardAfterBlackMove);
          }

          if (!this.isSquareEmpty(endSquare) || this.pieceTakenEnPassant(startSquare, endSquare, whitePlayer) === true) {
            capture = true;

            if (this.enPassant === true) {
              var enPassantPawnTakenRow = this.myMove ? whitePlayer ? endSquare.row - 1 : endSquare.row + 1 : !whitePlayer ? endSquare.row - 1 : endSquare.row + 1;
              var enPassantPawnSquare = this.findSquare(endSquare.column, enPassantPawnTakenRow);
              jquery__WEBPACK_IMPORTED_MODULE_7__("#" + enPassantPawnSquare.piece).hide();
              enPassantPawnSquare.piece = "empty";
              this.enPassant = false;
            } else {
              jquery__WEBPACK_IMPORTED_MODULE_7__("#" + endSquare.piece).hide();
            }
          }

          if (typeof promotedPiece !== 'undefined') {
            var promotedPieceFullName = promotedPiece + endSquare.column + endSquare.row;
            jquery__WEBPACK_IMPORTED_MODULE_7__(element).prop('id', promotedPieceFullName);
            jquery__WEBPACK_IMPORTED_MODULE_7__(element).css('top', "8px");
            jquery__WEBPACK_IMPORTED_MODULE_7__(element).css('left', "10px");
            jquery__WEBPACK_IMPORTED_MODULE_7__(element).attr('src', 'http://localhost:8082/images/pieces/' + promotedPiece + '.png');
            jquery__WEBPACK_IMPORTED_MODULE_7__(element).detach().appendTo('#squareDiv' + endSquare.column + endSquare.row);
            /*let indexOfNewPiece =chessboard.pieces.length;
            chessboard.pieces[indexOfNewPiece] = {};
            chessboard.pieces[indexOfNewPiece].row = endSquare.row;
            chessboard.pieces[indexOfNewPiece].column = endSquare.column;
            chessboard.pieces[indexOfNewPiece].piece = promotedPieceFullName;*/

            var indexOfPiece = this.getInitialPositionOfPiece(startPiece).index;
            this.chessboard.pieces[indexOfPiece].column = endSquare.column;
            this.chessboard.pieces[indexOfPiece].row = endSquare.row;
            this.chessboard.pieces[indexOfPiece].piece = promotedPieceFullName;
            endSquare.piece = promotedPieceFullName;
            this.findSquare(endSquare.column, endSquare.row).piece = promotedPieceFullName;
            startSquare.piece = "empty";
            this.findSquare(startSquare.column, startSquare.row).piece = "empty";
          } else {
            endSquare.piece = startPiece;
            this.findSquare(endSquare.column, endSquare.row).piece = startPiece;
            startSquare.piece = "empty";
            this.findSquare(startSquare.column, startSquare.row).piece = "empty";
          }

          if (this.hasThreeFoldRepetitionOccurred()) {
            this.endGame("1/2 - 1/2 (three fold repetition)");

            if (whitePlayer) {
              this.sendGameResult();
            }
          }

          var kingInCheckOrAndMate = this.isKingInCheckOrAndMate(this.chessboard, this.whiteMove, startSquare, endSquare);
          this.drawLastMove(startSquare, endSquare);

          if (this.castling === "0-0" || this.castling === "0-0-0") {
            this.moveRookIfPlayerCastled();
          }
          /*   let annotatedMove = this.addAnnotation(
                startSquare,
                endSquare,
                capture,
                typeof promotedPiece !== 'undefined', this.castling,
                kingInCheckOrAndMate.check,
                kingInCheckOrAndMate.mate);
                if (ownMove && this.mode === this.chessboardUsageModes.PLAYING) {
                this.sendMove(
                    typeof promotedPiece !== 'undefined' ? startPiece
                        : endSquare.piece,
                    startSquare, endSquare, null,
                    promotedPiece, annotatedMove);
            } */


          if (kingInCheckOrAndMate.mate === true) {
            this.endGame(this.whiteMove === true ? "1-0" : "0-1");
            this.sendGameResult();
          }

          this.castling = "";
          this.whiteMove = !this.whiteMove;
        }
      }, {
        key: "moveRookIfPlayerCastled",
        value: function moveRookIfPlayerCastled() {
          var targetSquare;
          var piece;
          var initialSquare;
          var initialSquareCoordinates;

          if (this.castling === "0-0") {
            if (this.whiteMove) {
              piece = "WR70";
              targetSquare = this.findSquare(5, 0);
              initialSquareCoordinates = this.getInitialPositionOfPiece("WR70");
              initialSquare = this.findSquare(initialSquareCoordinates.column, initialSquareCoordinates.row);
            } else {
              targetSquare = this.findSquare(5, 7);
              piece = "BR77";
              initialSquareCoordinates = this.getInitialPositionOfPiece(piece);
              initialSquare = this.findSquare(initialSquareCoordinates.column, initialSquareCoordinates.row);
            }
          } else if (this.castling === "0-0-0") {
            if (this.whiteMove) {
              console.log("White on move.");
              targetSquare = this.findSquare(3, 0);
              piece = "WR00";
              initialSquareCoordinates = this.getInitialPositionOfPiece(piece);
              initialSquare = this.findSquare(initialSquareCoordinates.column, initialSquareCoordinates.row);
            } else {
              console.log("Black on move.");
              targetSquare = this.findSquare(3, 7);
              piece = "BR07";
              initialSquareCoordinates = this.getInitialPositionOfPiece(piece);
              initialSquare = this.findSquare(initialSquareCoordinates.column, initialSquareCoordinates.row);
            }
          }

          this.movePieceOnBoard(jquery__WEBPACK_IMPORTED_MODULE_7__("#" + piece), initialSquareCoordinates, targetSquare, this.whitePlayer);
          targetSquare.piece = piece;
          this.findSquare(targetSquare.column, targetSquare.row).piece = piece;
          initialSquare.piece = "empty";
          this.findSquare(initialSquare.column, initialSquare.row).piece = "empty";
          this.printCurrentChessboard();
        }
      }, {
        key: "hasThreeFoldRepetitionOccurred",
        value: function hasThreeFoldRepetitionOccurred() {
          var threefoldrepetitionOccurred = false;
          var chessboardAsString = this.printCurrentChessboard();
          var numberOfOccurrences = 0;

          if (this.positionOccurrencesMap.has(chessboardAsString)) {
            numberOfOccurrences = this.positionOccurrencesMap.get(chessboardAsString) + 1;
          }

          this.positionOccurrencesMap.set(chessboardAsString, numberOfOccurrences);

          if (numberOfOccurrences === 3) {
            threefoldrepetitionOccurred = true;
          }

          return threefoldrepetitionOccurred;
        }
      }, {
        key: "hasKingAlreadyMoved",
        value: function hasKingAlreadyMoved(color) {
          var hasKingAlreadyMoved = false;
          this.chessboard.annotatedMoves.forEach(function (move) {
            if (color === "white" && (move.whiteMove.indexOf("K") !== -1 || move.whiteMove.indexOf("0") !== -1)) {
              hasKingAlreadyMoved = true;
            } else if (color === "black" && (move.blackMove.indexOf("K") !== -1 || move.blackMove.indexOf("0") !== -1)) {
              hasKingAlreadyMoved = true;
            }
          });
          return hasKingAlreadyMoved;
        }
      }, {
        key: "rookMovedDueToCastling",
        value: function rookMovedDueToCastling(piece) {
          var rookMovedDueToCastling = false;
          this.chessboard.annotatedMoves.forEach(function (move) {
            if (piece === 'WR70' && move.whiteMove.indexOf("0-0") !== -1) {
              rookMovedDueToCastling = true;
            } else if (piece === 'WR00' && move.whiteMove.indexOf("0-0-0") !== -1) {
              rookMovedDueToCastling = true;
            } else if (piece === 'BR07' && move.blackMove.indexOf("0-0-0") !== -1) {
              rookMovedDueToCastling = true;
            } else if (piece === 'BR77' && move.blackMove.indexOf("0-0") !== -1) {
              rookMovedDueToCastling = true;
            }
          });
          return rookMovedDueToCastling;
        }
      }, {
        key: "printSquares",
        value: function printSquares(squares) {
          var chessboardAsString = "";

          for (var rowIndex = 7; rowIndex >= 0; rowIndex--) {
            for (var columnIndex = 0; columnIndex <= 7; columnIndex++) {
              var squareIndex = void 0;

              for (var index = 0; index < squares.length; index++) {
                if (squares[index].column === columnIndex && squares[index].row === rowIndex) {
                  squareIndex = index;
                  break;
                }
              }

              var piece = squares[squareIndex].piece;

              if (piece === 'empty') {
                piece = '-';
              } else {
                if (piece.indexOf("W") !== -1) {
                  piece = piece.toLowerCase();
                }

                piece = piece.substring(1, 2);
              }

              chessboardAsString += piece;

              if (columnIndex !== 0 && columnIndex % 7 === 0) {
                chessboardAsString += "\n";
              }
            }
          }

          console.log(chessboardAsString);
          return chessboardAsString;
        }
      }, {
        key: "printCurrentChessboard",
        value: function printCurrentChessboard() {
          var chessboardAsString = "";

          for (var rowIndex = 7; rowIndex >= 0; rowIndex--) {
            for (var columnIndex = 0; columnIndex <= 7; columnIndex++) {
              var piece = this.findSquare(columnIndex, rowIndex).piece;

              if (piece === 'empty') {
                piece = '-';
              } else {
                if (piece.indexOf("W") !== -1) {
                  piece = piece.toLowerCase();
                }

                piece = piece.substring(1, 2);
              }

              chessboardAsString += piece;

              if (columnIndex !== 0 && columnIndex % 7 === 0) {
                chessboardAsString += "\n";
              }
            }
          }

          console.log(chessboardAsString);
          return chessboardAsString;
        }
        /* addAnnotation(startSquare,
                              endSquare, capture, promotion,
                              castling, check, mate) { */

      }, {
        key: "addAnnotation",
        value: function addAnnotation(moveNotation) {
          /* if (castling === "0-0" || castling === "0-0-0") {
              moveNotation = castling;
          } else {
              let pieceSymbol = (this.isPieceOnSquare(endSquare, "P") || promotion === true) ?
                  capture ? this.getSquareAsString(startSquare).substring(0, 1) : ""
                  : endSquare.piece.substr(1, 1);
              let captureSymbol = capture ? "x" : "";
              let promotionSymbol = promotion === true ? '=' + endSquare.piece.substr(1, 1) : "";
              let checkSymbol = check ? "+" : "";
              let mateSymbol = mate === true ? "#" : "";
                let endSquareAsString = this.getSquareAsString(endSquare);
              moveNotation = pieceSymbol
                  + captureSymbol + endSquareAsString
                  + promotionSymbol + checkSymbol
                  + mateSymbol;
          } */
          //let whiteMove = endSquare.piece.indexOf("W") !== -1;
          var whiteMove = this.whiteMove;
          var movecomplete;
          var currentchessboard = JSON.parse(JSON.stringify(this.chessboard.squares));

          if (this.whiteMove) {
            var newMove = {
              whiteMove: null,
              blackMove: null,
              whiteMoveStartSquare: null,
              whiteMoveEndSquare: null,
              blackMoveStartSquare: null,
              blackMoveEndSquare: null,
              whiteMoveVariations: [],
              blackMoveVariations: [],
              moveNumber: null,
              chessboardAfterWhiteMove: null,
              chessboardAfterBlackMove: null
            };
            newMove = this.addNewAnnotatedMove(moveNotation, currentchessboard, whiteMove);

            if (this.chessboard.annotatedMoves.length > this.moveNumber || this.currentVariation) {
              if (!this.currentVariation) {
                //adding white move to main line
                var variations = this.chessboard.annotatedMoves[this.moveNumber].whiteMoveVariations;
                var numberOfVariations = variations.length;
                var newVariationNeedsToBeCreated = true;

                for (var i = 0; i < numberOfVariations; i++) {
                  if (variations[i].moves[0].whiteMove === newMove.whiteMove) {
                    this.currentVariation = variations[i];
                    newVariationNeedsToBeCreated = false;
                    break;
                  }
                }

                if (newVariationNeedsToBeCreated) {
                  this.chessboard.annotatedMoves[this.moveNumber].whiteMoveVariations[numberOfVariations] = {
                    moves: []
                  };
                  this.chessboard.annotatedMoves[this.moveNumber].whiteMoveVariations[numberOfVariations].moves[0] = newMove;
                  this.chessboard.annotatedMoves[this.moveNumber].whiteMoveVariations[numberOfVariations].variationId = this.variationId;
                  this.currentVariation = {
                    "variationId": this.variationId,
                    "moveNumber": this.moveNumber,
                    "whiteMove": whiteMove,
                    "variationIndex": numberOfVariations,
                    "moves": this.chessboard.annotatedMoves[this.moveNumber].whiteMoveVariations[numberOfVariations].moves
                  };
                  this.variations.set(this.variationId, this.currentVariation);
                  this.variationId++;
                  /*   console.log("Position end of create variation:");
                    if(this.chessboard.annotatedMoves.length > 0 && typeof this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined' ){
                        this.printSquares(this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove);}
                    if(this.chessboard.annotatedMoves.length > 0 && typeof this.chessboard.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' && this.chessboard.annotatedMoves[0].chessboardAfterBlackMove.length!==0){
                        this.printSquares(this.chessboard.annotatedMoves[0].chessboardAfterBlackMove);} */
                }
              } else {
                //adding white move to an existing variation
                var variation = this.variations.get(this.currentVariation.variationId);
                var moveNumberInVariation = this.moveNumber - variation.moveNumber;

                if (variation.moves.length > moveNumberInVariation) {
                  var _newVariationNeedsToBeCreated = true;
                  var _variations = variation.moves[moveNumberInVariation].whiteMoveVariations;
                  var _numberOfVariations = _variations.length;

                  for (var _i = 0; _i < _numberOfVariations; _i++) {
                    if (_variations[_i].moves[0].whiteMove === newMove.whiteMove) {
                      this.currentVariation = _variations[_i];
                      _newVariationNeedsToBeCreated = false;
                      break;
                    }
                  }

                  if (_newVariationNeedsToBeCreated) {
                    /*   console.log("Creating new variation: " + this.variationId + " with the white starting move " + newMove.whiteMove);
                      console.log(this.printSquares(newMove.chessboardAfterWhiteMove)); */
                    variation.moves[moveNumberInVariation].whiteMoveVariations[_numberOfVariations] = {
                      moves: []
                    }; //newMove.moveNumber = this.moveNumber + 1;

                    variation.moves[moveNumberInVariation].whiteMoveVariations[_numberOfVariations].moves[0] = newMove;
                    variation.moves[moveNumberInVariation].whiteMoveVariations[_numberOfVariations].variationId = this.variationId;
                    this.currentVariation = {
                      "variationId": this.variationId,
                      "parentVariationId": variation.variationId,
                      "moveNumber": this.moveNumber,
                      "whiteMove": whiteMove,
                      "variationIndex": _numberOfVariations,
                      "moves": variation.moves[moveNumberInVariation].whiteMoveVariations[_numberOfVariations].moves
                    };
                    this.variations.set(this.currentVariation.variationId, this.currentVariation);
                    this.variationId++;
                  }
                } else {
                  //adding white move to existing variation
                  //newMove.moveNumber = variation.moves.length + 1;
                  variation.moves[variation.moves.length] = newMove;
                }
              }
            } else {
              this.chessboard.annotatedMoves[this.moveNumber] = newMove;
            }

            movecomplete = false;
          } else {
            //annotating black move
            if (this.currentVariation || this.chessboard.annotatedMoves[this.moveNumber].blackMove !== "") {
              if (!this.currentVariation) {
                var _variations2 = this.chessboard.annotatedMoves[this.moveNumber].blackMoveVariations;
                var _numberOfVariations2 = _variations2.length;
                var _newVariationNeedsToBeCreated2 = true;

                if (_numberOfVariations2 === 0 && this.chessboard.annotatedMoves[this.moveNumber].blackMove === moveNotation) {
                  _newVariationNeedsToBeCreated2 = false;
                } else {
                  for (var _i2 = 0; _i2 < _numberOfVariations2; _i2++) {
                    if (_variations2[_i2].moves[0].blackMove === moveNotation) {
                      _newVariationNeedsToBeCreated2 = false;
                      this.currentVariation = _variations2[_i2];
                      break;
                    }
                  }
                }

                if (_newVariationNeedsToBeCreated2) {
                  /*   console.log("Chessboard in the mainline start:");
                    console.log( this.printSquares( this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove));
                    console.log( this.printSquares( this.chessboard.annotatedMoves[0].chessboardAfterBlackMove)); */
                  //new variation with a black starting move created
                  this.chessboard.annotatedMoves[this.moveNumber].blackMoveVariations[_numberOfVariations2] = {
                    moves: []
                  };

                  var _newMove = this.addNewAnnotatedMove(moveNotation, currentchessboard, whiteMove);

                  this.chessboard.annotatedMoves[this.moveNumber].blackMoveVariations[_numberOfVariations2].moves[0] = _newMove;
                  this.chessboard.annotatedMoves[this.moveNumber].blackMoveVariations[_numberOfVariations2].variationId = this.variationId;
                  this.currentVariation = {
                    "variationId": this.variationId,
                    "moveNumber": this.moveNumber,
                    "whiteMove": this.whiteMove,
                    "variationIndex": _numberOfVariations2,
                    "moves": this.chessboard.annotatedMoves[this.moveNumber].blackMoveVariations[_numberOfVariations2].moves
                  };
                  this.variations.set(this.currentVariation.variationId, this.currentVariation);
                  this.variationId++;
                  /*        console.log("Creating new variation: "+ this.variationId + " with the black starting move "+newMove.blackMove);
                         console.log( this.printSquares(newMove.chessboardAfterBlackMove));
                         console.log("Chessboard in the mainline end:");
                                  console.log( this.printSquares( this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove));
                         console.log( this.printSquares( this.chessboard.annotatedMoves[0].chessboardAfterBlackMove)); */
                }
              } else {
                //adding black move to an existing variation
                var _variation = this.variations.get(this.currentVariation.variationId);

                var _newVariationNeedsToBeCreated3 = true;

                var _moveNumberInVariation = this.moveNumber - _variation.moveNumber;

                if (_variation.moves[_moveNumberInVariation].blackMove !== "") {
                  var _variations3 = _variation.moves[_moveNumberInVariation].blackMoveVariations;
                  var _numberOfVariations3 = _variations3.length;

                  for (var _i3 = 0; _i3 < _numberOfVariations3; _i3++) {
                    if (_variations3[_i3].moves[0].blackMove === moveNotation) {
                      _newVariationNeedsToBeCreated3 = false;
                      this.currentVariation = _variations3[_i3];
                      break;
                    }
                  } //adding variation starting with a black move


                  if (_newVariationNeedsToBeCreated3) {
                    _variation.moves[_moveNumberInVariation].blackMoveVariations[_numberOfVariations3] = {
                      moves: []
                    };
                    _variation.moves[_moveNumberInVariation].blackMoveVariations[_numberOfVariations3].moves[0] = this.addNewAnnotatedMove(moveNotation, currentchessboard, whiteMove);
                    _variation.moves[_moveNumberInVariation].blackMoveVariations[_numberOfVariations3].variationId = this.variationId;
                    this.currentVariation = {
                      "variationId": this.variationId,
                      "parentVariationId": _variation.variationId,
                      "moveNumber": this.moveNumber,
                      "whiteMove": whiteMove,
                      "variationIndex": _numberOfVariations3,
                      "moves": _variation.moves[_moveNumberInVariation].blackMoveVariations[_numberOfVariations3].moves
                    };
                    this.variations.set(this.currentVariation.variationId, this.currentVariation);
                    this.variationId++;
                  }
                } else {
                  /*  console.log("Position before adding black move to existing variation:");
                   if( this.chessboard.annotatedMoves.length > 0 && typeof  this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined' ){
                       this.printSquares( this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove);}
                   if( this.chessboard.annotatedMoves.length > 0 && typeof  this.chessboard.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' &&  this.chessboard.annotatedMoves[0].chessboardAfterBlackMove.length!==0){
                       this.printSquares( this.chessboard.annotatedMoves[0].chessboardAfterBlackMove);} */
                  _variation.moves[_variation.moves.length - 1].blackMove = moveNotation;
                  /*    variation.moves[variation.moves.length - 1].blackMoveStartSquare = startSquare;
                     variation.moves[variation.moves.length - 1].blackMoveEndSquare = endSquare; */

                  _variation.moves[_variation.moves.length - 1].chessboardAfterBlackMove = this.chess.fen(); //variation.moves[variation.moves.length - 1].chessboardAfterBlackMove = currentchessboard;

                  /*    console.log("Position after adding black move to existing variation:");
                     if( this.chessboard.annotatedMoves.length > 0 && typeof  this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined' ){
                         this.printSquares( this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove);}
                     if( this.chessboard.annotatedMoves.length > 0 && typeof  this.chessboard.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' &&  this.chessboard.annotatedMoves[0].chessboardAfterBlackMove.length!==0){
                         this.printSquares( this.chessboard.annotatedMoves[0].chessboardAfterBlackMove);} */
                }
              }
            } else {
              this.chessboard.annotatedMoves[this.moveNumber].blackMove = moveNotation;
              /*     this.chessboard.annotatedMoves[this.moveNumber].blackMoveStartSquare = startSquare;
                  this.chessboard.annotatedMoves[this.moveNumber].blackMoveEndSquare = endSquare; */

              this.chessboard.annotatedMoves[this.moveNumber].chessboardAfterBlackMove = this.chess.fen(); // this.chessboard.annotatedMoves[ this.moveNumber].chessboardAfterBlackMove = currentchessboard;

              /* console.log("Position after new mainline black move:");
              this.printSquares( this.chessboard.annotatedMoves[0].chessboardAfterWhiteMove);
              this.printSquares( this.chessboard.annotatedMoves[0].chessboardAfterBlackMove); */
            }

            movecomplete = true;
          }

          this.annotatedMoves = this.chessboard.annotatedMoves; //updateScrollbar('scrollTo', 440);

          return moveNotation;
        }
      }, {
        key: "highlightLastMoveInNotation",
        value: function highlightLastMoveInNotation() {
          this.moveToHighlight.variationId = this.currentVariation ? this.currentVariation.variationId : this.MAIN_LINE;
          this.moveToHighlight.moveNumber = this.moveNumber;
          this.moveToHighlight.whiteMove = this.whiteMove;
        }
      }, {
        key: "addNewAnnotatedMove",
        value: function addNewAnnotatedMove(moveNotation, currentchessboard, whiteMove) {
          var newAnnotatedMove = {
            whiteMove: null,
            blackMove: null,
            whiteMoveStartSquare: null,
            whiteMoveEndSquare: null,
            blackMoveStartSquare: null,
            blackMoveEndSquare: null,
            whiteMoveVariations: [],
            blackMoveVariations: [],
            moveNumber: null,
            chessboardAfterWhiteMove: null,
            chessboardAfterBlackMove: null
          };
          newAnnotatedMove.whiteMove = whiteMove ? moveNotation : "";
          newAnnotatedMove.blackMove = whiteMove ? "" : moveNotation;
          /*  newAnnotatedMove.whiteMoveStartSquare = whiteMove ? startSquare : "";
           newAnnotatedMove.whiteMoveEndSquare = whiteMove ? endSquare : "";
           newAnnotatedMove.blackMoveStartSquare = whiteMove ? "" : startSquare;
           newAnnotatedMove.blackMoveEndSquare = whiteMove ? "" : endSquare; */

          newAnnotatedMove.whiteMoveVariations = [];
          newAnnotatedMove.blackMoveVariations = [];
          newAnnotatedMove.moveNumber = this.moveNumber + 1; // newAnnotatedMove.chessboardAfterWhiteMove = whiteMove ? currentchessboard : [];
          // newAnnotatedMove.chessboardAfterBlackMove = whiteMove ? [] : currentchessboard;

          newAnnotatedMove.chessboardAfterWhiteMove = whiteMove ? this.chess.fen() : "";
          newAnnotatedMove.chessboardAfterBlackMove = whiteMove ? "" : this.chess.fen();
          return newAnnotatedMove;
        }
      }, {
        key: "getSquareAsString",
        value: function getSquareAsString(square) {
          return String.fromCharCode(97 + square.column) + (square.row + 1);
        }
      }, {
        key: "findIndexOfSquare",
        value: function findIndexOfSquare(x, y) {
          for (var index = 0; index < this.chessboard.squares.length; index++) {
            if (this.chessboard.squares[index].column === x && this.chessboard.squares[index].row === y) {
              return index;
            }
          }
        }
      }, {
        key: "findSquare",
        value: function findSquare(x, y) {
          return this.chessboard.squares[this.findIndexOfSquare(x, y)];
        }
      }, {
        key: "updatePlayerElos",
        value: function updatePlayerElos(gameResultWhite, gameResultBlack) {
          // //console.log(elowhite, eloblack,
          // gameResultWhite, gameResultBlack);
          var expectedOutcomeWhite = 1 / (1 + Math.pow(10, (this.blackPlayerElo - this.whitePlayerElo) / 400));
          var expectedOutcomeBlack = 1 / (1 + Math.pow(10, (this.whitePlayerElo - this.blackPlayerElo) / 400));
          var newRatingWhite = Math.round(this.whitePlayerElo + 15 * (gameResultWhite - expectedOutcomeWhite));
          var newRatingBlack = Math.round(this.blackPlayerElo + 15 * (gameResultBlack - expectedOutcomeBlack));
          this.whitePlayerEloChange = newRatingWhite - this.whitePlayerElo;
          this.blackPlayerEloChange = newRatingBlack - this.blackPlayerElo;
          this.whitePlayerElo = newRatingWhite;
          this.blackPlayerElo = newRatingBlack;
          /*return {
              "newRatingWhite": newRatingWhite,
              "newRatingBlack": newRatingBlack
          };*/
        }
      }, {
        key: "initialiseWebSockets",
        value: function initialiseWebSockets() {
          var _this9 = this;

          this.socket = this.webSocketService.initWebSockets();

          var onOpen = function onOpen() {
            console.log("opening session and requesting game info");
          };

          var onError = function onError(event) {// //console.log("Error occured:" + event);
          };

          var onMessage = function onMessage(message) {
            var data = JSON.parse(message.data);

            if (data.action === "move") {
              _this9.executeReceivedMove(data);
            } else if (data.action === "startGame") {
              _this9.startGame(data);
            } else if (data.action === "offerDraw") {
              _this9.displayDrawOffer();
            } else if (data.action === "drawOfferReply") {
              if (data.acceptDraw === true) {
                _this9.endGame("1/2 - 1/2");
              } else {}
            } else if (data.action === "resign") {
              _this9.endGame(_this9.whitePlayer ? "1-0" : "0-1");
            } else if (data.action === "gameInfo") {
              _this9.startGame(data);
            } else if (data.action === "gameResult") {
              _this9.endGame(data.gameResult);
            }
          };

          this.socket.onmessage = function (message) {
            return onMessage(message);
          };

          this.socket.onerror = onError;
          this.socket.onopen = onOpen;
        }
      }, {
        key: "displayDrawOffer",
        value: function displayDrawOffer() {
          this.drawOfferReceived = true;
        }
      }, {
        key: "executeReceivedMove",
        value: function executeReceivedMove(move) {
          console.log(move);
          this.lastMove = move;
          this.whiteTime = move.whiteTime;
          this.blackTime = move.blackTime;
          this.myMove = true;
          this.castling = "";
          var validMove = this.chess.move(move.annotatedMove);
          this.processValidMove(validMove, move.chessboardAfterMove, false);
          this.pressClock(!move.whiteMove);
          this.svgChessboard.enableMoveInput(this.moveInputHandler, this.whitePlayer ? _node_modules_cm_chessboard_src_cm_chessboard_Chessboard_js__WEBPACK_IMPORTED_MODULE_6__["COLOR"].white : _node_modules_cm_chessboard_src_cm_chessboard_Chessboard_js__WEBPACK_IMPORTED_MODULE_6__["COLOR"].black);
        }
      }, {
        key: "generateClockTimeFromSeconds",
        value: function generateClockTimeFromSeconds(seconds) {
          var clockSeconds = seconds % 60;
          var clockSecondsString;

          if (clockSeconds < 10) {
            clockSecondsString = "0" + +clockSeconds;
          } else {
            clockSecondsString = clockSeconds.toString();
          }

          var clockMinutes = Math.floor(seconds / 60);
          return clockMinutes + ":" + clockSecondsString;
        }
      }, {
        key: "onTimeout",
        value: function onTimeout(whitePlayer) {
          var _this10 = this;

          if (whitePlayer) {
            if (this.whiteTime > 0 // && playingGame === true
            ) {
                this.whiteTime -= 1;
                this.whiteClock = this.generateClockTimeFromSeconds(this.whiteTime);
                console.log("Decreasing white time.");
              } else {
              if (whitePlayer === whitePlayer) {
                this.endGame("0-1 (Black won on time)");
                this.sendGameResult();
              }

              return;
            }
          } else {
            if (this.blackTime > 0 //&& playingGame === true
            ) {
                this.blackTime -= 1;
                this.blackClock = this.generateClockTimeFromSeconds(this.blackTime);
              } else {
              if (whitePlayer === whitePlayer) {
                this.endGame("1-0 (White won on time)");
                this.sendGameResult();
              }

              return;
            }
          }

          if (this.playingGame || this.mode === this.chessboardUsageModes.OBSERVING) {
            this.clockTimer = setTimeout(function () {
              return _this10.onTimeout(whitePlayer);
            }, 1000);
          }
        }
      }, {
        key: "startClock",
        value: function startClock(whitePlayer) {
          var _this11 = this;

          console.log("Starting clock for whitePlayer:" + whitePlayer);
          this.clockTimer = setTimeout(function () {
            return _this11.onTimeout(whitePlayer);
          }, 1000);
        }
      }, {
        key: "pressClock",
        value: function pressClock(whitePlayer) {
          console.log("Pressing clock");
          clearTimeout(this.clockTimer);
          this.startClock(whitePlayer);
        }
      }, {
        key: "startGame",
        value: function startGame(data) {
          console.log("starting game");
          jquery__WEBPACK_IMPORTED_MODULE_7__(".chessPiece").show();
          this.eraseAllHighlightedSquares();
          this.moveNumber = 0;
          this.seekingOponent = false;
          this.playingGame = true;
          this.whiteMove = true;
          this.gameResult = "";
          this.whiteTime = data.time * 60;
          this.blackTime = data.time * 60;
          this.drawOfferReceived = false;
          this.whitePlayerElo = data.whitePlayer.elo;
          this.blackPlayerElo = data.blackPlayer.elo;
          this.whitePlayerName = data.whitePlayer.username;
          this.blackPlayerName = data.blackPlayer.username;
          this.whiteClock = this.generateClockTimeFromSeconds(this.whiteTime);
          this.blackClock = this.generateClockTimeFromSeconds(this.blackTime); // $apply( () {

          this.initialiseChessboard();

          if (this.mode === this.chessboardUsageModes.OBSERVING) {
            this.annotatedMoves = data.annotatedMoves;
          }

          this.newGame = true;

          if (data.blackPlayer.username === this.user) {
            this.oponent = data.whitePlayer.username;
            this.whitePlayer = false;
            this.myMove = false;
            this.svgChessboard.setOrientation(_node_modules_cm_chessboard_src_cm_chessboard_Chessboard_js__WEBPACK_IMPORTED_MODULE_6__["COLOR"].black);
            this.svgChessboard.disableMoveInput();
          } else {
            this.oponent = data.blackPlayer.username;
            this.whitePlayer = true;
            this.myMove = true;
            this.svgChessboard.setOrientation(_node_modules_cm_chessboard_src_cm_chessboard_Chessboard_js__WEBPACK_IMPORTED_MODULE_6__["COLOR"].white);
          }
        }
      }, {
        key: "displayPromotionPicker",
        value: function displayPromotionPicker(elem, startPos, endPos) {
          this.startPosition = startPos;
          this.endPosition = endPos;
          this.element = elem;
          this.showPawnPromotionDiv = true;
        }
      }, {
        key: "promotePiece",
        value: function promotePiece(piece) {
          /*  this.updateChessboardAfterMove(this.startPosition.piece, this.element,
               this.startPosition, this.endPosition, true,
               this.whitePlayer, piece);
           this.lastMove.startPosition = this.startPosition;
           this.lastMove.endPosition = this.endPosition; */
          this.pawnPromotionMove.promotion = piece;
          var validMove = this.chess.move(this.pawnPromotionMove);

          if (validMove) {
            var currentPositionAsFEN = this.chess.fen();
            this.processValidMove(validMove, currentPositionAsFEN, true);
            /*      this.pressClock(!this.whitePlayer);
                 this.setMyMove(false); */
          }

          this.showPawnPromotionDiv = false;
        }
      }, {
        key: "endGame",
        value: function endGame(gameResult) {
          jquery__WEBPACK_IMPORTED_MODULE_7__("#arrow").remove();
          var gameResultWhite;
          var gameResultBlack;

          if (gameResult === "1-0" || gameResult === "1-0 (White won on time)") {
            gameResultWhite = 1;
            gameResultBlack = 0;
          } else if (gameResult === "0-1" || gameResult === "0-1 (Black won on time)") {
            gameResultWhite = 0;
            gameResultBlack = 1;
          } else if (gameResult === "1/2 - 1/2") {
            gameResultWhite = 0.5;
            gameResultBlack = 0.5;
          }

          this.stopClocks();
          this.playingGame = false;
          var newElos = this.updatePlayerElos(gameResultWhite, gameResultBlack);
          this.gameResult = gameResult;
          /* this.openPostGameModal(
              this.whitePlayerName,
              this.blackPlayerName,
              gameResult, this.whitePlayer, this.mode); */

          return newElos;
        }
      }, {
        key: "postGameModalController",
        value: function postGameModalController($modalInstance, whitePlayerName, blackPlayerName, gameResult, whitePlayer, mode) {
          whitePlayerName = whitePlayerName;
          blackPlayerName = blackPlayerName;
          gameResult = gameResult;
          whitePlayer = whitePlayer;

          this.resultMessage = function () {
            if (mode === this.chessboardUsageModes.PLAYING && (gameResult === "1-0" && whitePlayer === true || gameResult === "0-1" && whitePlayer === false)) {
              return "Congratulation you won the game.";
            } else if (mode === this.chessboardUsageModes.PLAYING && (gameResult === "1-0 (White won on time)" && whitePlayer === true || gameResult === "0-1 (Black won on time)" && whitePlayer === false)) {
              return "Congratulation you won the game on time.";
            } else if (mode === this.chessboardUsageModes.PLAYING && (gameResult === "1-0 (White won on time)" && whitePlayer === false || gameResult === "0-1 (Black won on time)" && whitePlayer === true)) {
              return "You lost the game on time.";
            } else if (mode === this.chessboardUsageModes.PLAYING && (gameResult === "1-0" && whitePlayer === false || gameResult === "0-1" && whitePlayer === true)) {
              return "You lost the game.";
            } else if (gameResult === "1-0" && mode === this.chessboardUsageModes.OBSERVING) {
              return whitePlayerName + " won the game.";
            } else if (gameResult === "0-1" && mode === this.chessboardUsageModes.OBSERVING) {
              return blackPlayerName + " won the game.";
            } else if (gameResult === "1-0 (White won on time)" && mode === this.chessboardUsageModes.OBSERVING) {
              return whitePlayerName + " won the game on time.";
            } else if (gameResult === "0-1 (Black won on time)" && mode === this.chessboardUsageModes.OBSERVING) {
              return blackPlayerName + " won the game on time.";
            } else if (gameResult === "1/2 - 1/2") {
              return "Game ended in a draw.";
            } else {
              console.log(gameResult, whitePlayer);
              return "Else called.";
            }
          };

          this.close = function () {
            console.log("Closing dialog window;");
            $modalInstance.close();
          };

          this.offerRematch = function () {};
        }
      }, {
        key: "openPostGameModal",

        /*     this.postGameModalController['$inject'] = ['this',
                '$modalInstance', 'whitePlayerName',
                'blackPlayerName', 'gameResult',
                'whitePlayer', 'mode']; */
        value: function openPostGameModal(whitePlayerName, blackPlayerName, gameResult, whitePlayer, mode) {
          /* $modal
             .open({
                 templateUrl: 'views/playingHall/postGameModal.html',
                 controller: this.postGameModalController,
                 scope: $new(true),
                 resolve: {
                     whitePlayerName:  () => {
                         return whitePlayerName
                     },
                     blackPlayerName:  ()=>  {
                         return blackPlayerName
                     },
                     gameResult:  () => {
                         return gameResult
                     },
                     whitePlayer:  () => {
                         return whitePlayer
                     },
                     mode:  () =>{
                         return mode
                     }
                 }
             }); */
        }
      }, {
        key: "offerDraw",
        value: function offerDraw() {
          var drawOffer = {
            action: "offerDraw",
            oponent: this.oponent
          };
          this.socket.send(JSON.stringify(drawOffer));
        }
      }, {
        key: "drawOfferReply",
        value: function drawOfferReply(acceptDraw) {
          var drawOffer = {
            action: "drawOfferReply",
            player: this.user.username,
            oponent: this.oponent,
            acceptDraw: acceptDraw
          };

          if (acceptDraw) {
            this.endGame("1/2 - 1/2");
            this.sendGameResult();
          } else {
            this.socket.send(JSON.stringify(drawOffer));
          }
        }
      }, {
        key: "sendGameResult",
        value: function sendGameResult() {
          var gameResult = {
            action: "gameResult",
            oponent: this.oponent,
            gameId: this.gameId,
            gameResult: this.gameResult,
            whitePlayerElo: this.whitePlayerElo,
            blackPlayerElo: this.blackPlayerElo
          };
          this.socket.send(JSON.stringify(gameResult));
        }
      }, {
        key: "resign",
        value: function resign() {
          var gameResult = !this.whitePlayer ? "1-0" : "0-1";
          this.endGame(gameResult);
          this.sendGameResult();
        }
      }, {
        key: "observeGame",
        value: function observeGame(game) {
          this.whitePlayerName = game.whitePlayer.username;
          this.blackPlayerName = game.blackPlayer.username;
          this.whitePlayerElo = game.whitePlayer.elo;
          this.blackPlayerElo = game.blackPlayer.elo;
          this.annotatedMoves = Object.keys(game.annotatedMoves).map(function (key) {
            return game.annotatedMoves[key];
          });
          var lastMove = this.annotatedMoves[this.annotatedMoves.length - 1];
          this.whiteTime = lastMove.whiteTime;
          this.blackTime = lastMove.blackTime;
          this.whiteClock = this.generateClockTimeFromSeconds(this.whiteTime);
          this.blackClock = this.generateClockTimeFromSeconds(this.blackTime);

          if (lastMove.blackMove) {
            this.redrawChessboard(JSON.parse(lastMove.chessboardAfterBlackMove), null);
            this.startClock(true);
          } else {
            this.redrawChessboard(JSON.parse(lastMove.chessboardAfterWhiteMove), null);
            this.startClock(false);
          }

          console.log(game);
        }
      }, {
        key: "sendMove",
        value: function sendMove(fen, annotatedMove) {
          var moveAction = {
            action: "move",
            oponent: this.oponent,
            chessboardAfterMove: fen,
            gameId: this.gameId,
            annotatedMove: annotatedMove,
            whiteMove: this.whiteMove,
            whiteTime: this.whiteTime,
            blackTime: this.blackTime
          };
          console.log("sending move to server:");
          console.log(JSON.stringify(moveAction));
          this.socket.send(JSON.stringify(moveAction));
        }
      }]);

      return PlayingHall;
    }();

    PlayingHall.ctorParameters = function () {
      return [{
        type: _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClient"]
      }, {
        type: _angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"]
      }, {
        type: _js_services_jwtAuthenticationService__WEBPACK_IMPORTED_MODULE_1__["JwtAuthenticationService"]
      }, {
        type: _js_services_websocketService__WEBPACK_IMPORTED_MODULE_2__["WebSocketService"]
      }];
    };

    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["HostListener"])('document:keydown', ['$event'])], PlayingHall.prototype, "handleKeyboardEvent", null);
    PlayingHall = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
      selector: 'selector-name',
      template: Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(
      /*! raw-loader!./playingHall.html */
      "./node_modules/raw-loader/dist/cjs.js!./views/playingHall/playingHall.html"))["default"]
    })], PlayingHall);
    /***/
  },

  /***/
  "./views/playingHall/subcomponents/moveVariationTree/move-variation-tree/move-variation-tree.component.css":
  /*!*****************************************************************************************************************!*\
    !*** ./views/playingHall/subcomponents/moveVariationTree/move-variation-tree/move-variation-tree.component.css ***!
    \*****************************************************************************************************************/

  /*! exports provided: default */

  /***/
  function viewsPlayingHallSubcomponentsMoveVariationTreeMoveVariationTreeMoveVariationTreeComponentCss(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = ".highlighted{\r\n    color:red;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdzL3BsYXlpbmdIYWxsL3N1YmNvbXBvbmVudHMvbW92ZVZhcmlhdGlvblRyZWUvbW92ZS12YXJpYXRpb24tdHJlZS9tb3ZlLXZhcmlhdGlvbi10cmVlLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxTQUFTO0FBQ2IiLCJmaWxlIjoidmlld3MvcGxheWluZ0hhbGwvc3ViY29tcG9uZW50cy9tb3ZlVmFyaWF0aW9uVHJlZS9tb3ZlLXZhcmlhdGlvbi10cmVlL21vdmUtdmFyaWF0aW9uLXRyZWUuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5oaWdobGlnaHRlZHtcclxuICAgIGNvbG9yOnJlZDtcclxufSJdfQ== */";
    /***/
  },

  /***/
  "./views/playingHall/subcomponents/moveVariationTree/move-variation-tree/move-variation-tree.component.ts":
  /*!****************************************************************************************************************!*\
    !*** ./views/playingHall/subcomponents/moveVariationTree/move-variation-tree/move-variation-tree.component.ts ***!
    \****************************************************************************************************************/

  /*! exports provided: MoveVariationTreeComponent */

  /***/
  function viewsPlayingHallSubcomponentsMoveVariationTreeMoveVariationTreeMoveVariationTreeComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "MoveVariationTreeComponent", function () {
      return MoveVariationTreeComponent;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");

    var MoveVariationTreeComponent = /*#__PURE__*/function () {
      function MoveVariationTreeComponent() {
        _classCallCheck(this, MoveVariationTreeComponent);

        this.positionToRedraw = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
      }

      _createClass(MoveVariationTreeComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {}
      }, {
        key: "redrawPosition",
        value: function redrawPosition(fen, variationId) {
          var data = {
            fen: fen,
            variationId: variationId
          };
          this.positionToRedraw.emit(data);
        }
      }]);

      return MoveVariationTreeComponent;
    }();

    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])()], MoveVariationTreeComponent.prototype, "mainVariation", void 0);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])()], MoveVariationTreeComponent.prototype, "moveToHighlight", void 0);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])()], MoveVariationTreeComponent.prototype, "positionToRedraw", void 0);
    MoveVariationTreeComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
      selector: 'variation-tree',
      template: Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(
      /*! raw-loader!./move-variation-tree.component.html */
      "./node_modules/raw-loader/dist/cjs.js!./views/playingHall/subcomponents/moveVariationTree/move-variation-tree/move-variation-tree.component.html"))["default"],
      styles: [Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"])(__webpack_require__(
      /*! ./move-variation-tree.component.css */
      "./views/playingHall/subcomponents/moveVariationTree/move-variation-tree/move-variation-tree.component.css"))["default"]]
    })], MoveVariationTreeComponent);
    /***/
  },

  /***/
  0:
  /*!***********************!*\
    !*** multi ./main.ts ***!
    \***********************/

  /*! no static exports found */

  /***/
  function _(module, exports, __webpack_require__) {
    module.exports = __webpack_require__(
    /*! C:\Users\t.valkovic\git\ChessPortal\TV-reservation\src\main\resources\static\main.ts */
    "./main.ts");
    /***/
  }
}, [[0, "runtime", "vendor"]]]);
//# sourceMappingURL=main-es5.js.map