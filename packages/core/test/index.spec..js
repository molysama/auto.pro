"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __importDefault(require("assert"));
var index_1 = __importDefault(require("../src/index"));
describe('app', function () {
    it('use', function () {
        var plugin = {
            install: function (app) {
                app.provide('action', function () { return 1; });
            }
        };
        var app = index_1.default();
        app.use(plugin);
        var action = app.inject('action');
        assert_1.default.equal(action(), 1);
    });
});
