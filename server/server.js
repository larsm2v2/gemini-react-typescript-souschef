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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
//import cors from "cors"
var cors = require("cors");
var fs = require("fs");
var fsPromises = require("fs/promises");
var path = require("path");
var dotenv = require("dotenv");
var cleanRecipeData_1 = require("./cleanRecipeData");
var generative_ai_1 = require("@google/generative-ai");
dotenv.config();
var PORT = 8000;
var app = express();
app.use(cors());
app.use(express.json());
express.response;
//API key for Google Generative AI
var apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not found!");
}
var genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
var recipeFilePath = path.resolve(__dirname, "Recipes.json");
var activeSSEConnections = [];
// Serve Recipes.json
app.get("/api/recipes-stream", function (req, res) {
    //SSE Headers
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
    });
    // Send initial "ping" message to keep the connection alive
    res.write("event: ping\ndata: \n\n");
    activeSSEConnections.push(res); // Add new connection to the list
    req.on("close", function () {
        activeSSEConnections = activeSSEConnections.filter(function (conn) { return conn !== res; }); // Remove closed connection
    });
});
fs.watchFile(recipeFilePath, function (curr, prev) { return __awaiter(void 0, void 0, void 0, function () {
    var rawData, recipeData, cleanedRecipes, eventData_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(curr.mtime !== prev.mtime)) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fsPromises.readFile(recipeFilePath, "utf-8")];
            case 2:
                rawData = _a.sent();
                recipeData = JSON.parse(rawData);
                cleanedRecipes = (0, cleanRecipeData_1.cleanedRecipeData)(recipeData);
                eventData_1 = {
                    type: "recipe-update",
                    data: cleanedRecipes,
                };
                // Send the updated recipe data as an SSE event
                activeSSEConnections.forEach(function (res) {
                    res.write("event: recipe-update\n"); // Event type
                    res.write("data: ".concat(JSON.stringify(eventData_1), "\n\n")); // Data payload
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error sending SSE update:", error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/gemini", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var model, chat, msg, result, response, text;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-001" });
                chat = model.startChat({
                    history: req.body.history,
                    generationConfig: {
                        /* maxOutputTokens: 100, */
                        temperature: 0.7,
                        topP: 0.4,
                    },
                });
                msg = req.body.message;
                return [4 /*yield*/, chat.sendMessageStream(msg)];
            case 1:
                result = _a.sent();
                return [4 /*yield*/, result.response];
            case 2:
                response = _a.sent();
                text = response.text();
                res.send(text);
                return [2 /*return*/];
        }
    });
}); });
app.post("/api/clean-recipe", function (req, res) {
    try {
        var recipe = req.body; // Type assertion to RecipeModel
        var cleanedRecipe = (0, cleanRecipeData_1.cleanRecipe)(recipe);
        res.status(200).json(cleanedRecipe);
    }
    catch (error) {
        console.error("Error cleaning recipe data:", error);
        res.status(500).json({ error: "Error cleaning recipe data." });
    }
});
app.post("/api/clean-recipes", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var rawData, readError_1, recipeData, cleanedRecipes, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                rawData = void 0;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 7]);
                return [4 /*yield*/, fsPromises.readFile(recipeFilePath, "utf-8")];
            case 2:
                rawData = _a.sent();
                return [3 /*break*/, 7];
            case 3:
                readError_1 = _a.sent();
                if (!(readError_1.code === "ENOENT")) return [3 /*break*/, 5];
                console.warn("Recipes.json not found, creating an empty file.");
                return [4 /*yield*/, fsPromises.writeFile(recipeFilePath, "[]")];
            case 4:
                _a.sent();
                rawData = "[]";
                return [3 /*break*/, 6];
            case 5: throw readError_1; // Re-throw other errors
            case 6: return [3 /*break*/, 7];
            case 7:
                recipeData = JSON.parse(rawData);
                cleanedRecipes = (0, cleanRecipeData_1.cleanedRecipeData)(recipeData);
                console.log("Recipes.json path:", recipeFilePath);
                // 3. Write cleaned data back to file
                return [4 /*yield*/, fsPromises.writeFile(recipeFilePath, JSON.stringify(cleanedRecipes, null, 2))
                    // 4. Send success response
                ];
            case 8:
                // 3. Write cleaned data back to file
                _a.sent();
                // 4. Send success response
                res.status(200).json({
                    message: "Recipe data fixed successfully.",
                    data: cleanedRecipes,
                });
                return [3 /*break*/, 10];
            case 9:
                error_2 = _a.sent();
                console.error("Error fixing recipe data:", error_2);
                res.status(500).json({ error: "Error fixing recipe data." });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
app.post("/api/clean-and-add-recipes", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var rawData, readError_2, recipeData, recipe, cleanedRecipe, withAddedRecipe, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                rawData = void 0;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 7]);
                return [4 /*yield*/, fsPromises.readFile(recipeFilePath, "utf-8")];
            case 2:
                rawData = _a.sent();
                return [3 /*break*/, 7];
            case 3:
                readError_2 = _a.sent();
                if (!(readError_2.code === "ENOENT")) return [3 /*break*/, 5];
                console.warn("Recipes.json not found, creating an empty file.");
                return [4 /*yield*/, fsPromises.writeFile(recipeFilePath, "[]")];
            case 4:
                _a.sent();
                rawData = "[]";
                return [3 /*break*/, 6];
            case 5: throw readError_2; // Re-throw other errors
            case 6: return [3 /*break*/, 7];
            case 7:
                recipeData = JSON.parse(rawData);
                recipe = req.body;
                cleanedRecipe = (0, cleanRecipeData_1.cleanRecipe)(recipe);
                withAddedRecipe = Array.isArray(cleanedRecipe)
                    ? __spreadArray(__spreadArray([], recipeData, true), cleanedRecipe, true) : __spreadArray(__spreadArray([], recipeData, true), [cleanedRecipe], false);
                console.log("All Recipes with Addition: ", withAddedRecipe);
                console.log("Recipes.json path: ", recipeFilePath);
                // 3. Write cleaned data back to file
                return [4 /*yield*/, fsPromises.writeFile(recipeFilePath, JSON.stringify(withAddedRecipe, null, 2))
                    // 4. Send success response
                ];
            case 8:
                // 3. Write cleaned data back to file
                _a.sent();
                // 4. Send success response
                res.status(200).json({
                    message: "Recipe data fixed successfully.",
                    data: withAddedRecipe,
                });
                return [3 /*break*/, 10];
            case 9:
                error_3 = _a.sent();
                console.error("Error fixing recipe data:", error_3);
                res.status(500).json({ error: "Error fixing recipe data." });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
app.listen(PORT, function () { return console.log("Listening on port ".concat(PORT)); });
