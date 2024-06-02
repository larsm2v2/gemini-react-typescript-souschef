"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanedRecipeData = exports.cleanRecipe = void 0;
// Function to fix a single recipe
function cleanRecipe(recipe) {
    var cleanedRecipe = __assign(__assign({}, recipe), { "unique id": parseInt(recipe["unique id"], 10) || 0, "serving info": __assign(__assign({}, recipe["serving info"]), { "prep time": recipe["serving info"]["prep time"] || "", "cook time": recipe["serving info"]["cook time"] || "", "total time": recipe["serving info"]["total time"] || "", "number of people served": parseInt(recipe["serving info"]["number of people served"], 10) || 0 }), ingredients: Object.keys(recipe.ingredients).reduce(function (acc, category) {
            if (Array.isArray(recipe.ingredients[category])) {
                acc[category] = recipe.ingredients[category].map(function (ingredient) { return (__assign(__assign({}, ingredient), { id: ingredient.id || 0, quantity: ingredient.quantity || 0, unit: ingredient.unit || undefined })); });
            }
            return acc;
        }, {}), "dietary restrictions and designations": recipe["dietary restrictions and designations"] || [], notes: recipe.notes || [] });
    return cleanedRecipe;
}
exports.cleanRecipe = cleanRecipe;
// Fix all recipes in the data
function cleanedRecipeData(recipeData) {
    return recipeData.map(cleanRecipe);
}
exports.cleanedRecipeData = cleanedRecipeData;
