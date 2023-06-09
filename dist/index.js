"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yt_1 = __importDefault(require("./yt"));
const app = new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        resolve(yield (0, yt_1.default)("PLbJr1Hz1efqQLiG96yDtiZJkG7YGf8X-K"));
    }
    catch (error) {
        reject(error);
    }
}));
app.then((response) => {
    console.log(response);
});
console.log("yeah");
