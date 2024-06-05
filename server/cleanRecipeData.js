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
function parseQuantity(quantityStr) {
    if (typeof quantityStr === "number")
        return quantityStr;
    var parts = quantityStr.split("/");
    if (parts.length === 2) {
        var numerator = parseInt(parts[0], 10);
        var denominator = parseInt(parts[1], 10);
        if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
            return numerator / denominator;
        }
    }
    return parseFloat(quantityStr) || 0; // Fallback to parseFloat or 0 if invalid
}
// Function to fix a single recipe
function cleanRecipe(recipe) {
    var cleanedRecipe = __assign(__assign({}, recipe), { "unique id": parseInt(recipe["unique id"], 10) || 0, "serving info": __assign(__assign({}, recipe["serving info"]), { "prep time": recipe["serving info"]["prep time"] || "", "cook time": recipe["serving info"]["cook time"] || "", "total time": recipe["serving info"]["total time"] || "", "number of people served": parseInt(recipe["serving info"]["number of people served"], 10) || 0 }), ingredients: Object.keys(recipe.ingredients).reduce(function (acc, category) {
            if (Array.isArray(recipe.ingredients[category])) {
                acc[category] = recipe.ingredients[category].map(function (ingredient) { return (__assign(__assign({}, ingredient), { id: ingredient.id || 0, quantity: parseQuantity(ingredient.quantity), unit: ingredient.unit || undefined })); });
            }
            return acc;
        }, {}), "dietary restrictions and designations": recipe["dietary restrictions and designations"] || [], notes: recipe.notes || [] });
    return cleanedRecipe;
}
exports.cleanRecipe = cleanRecipe;
// Fix all recipes in the data
function cleanedRecipeData(recipeData) {
    var seenRecipes = new Set(); // Keep track of seen recipe combinations
    var cleanedRecipes = recipeData.map(cleanRecipe); // Clean the recipes first
    var uniqueRecipes = [];
    for (var _i = 0, cleanedRecipes_1 = cleanedRecipes; _i < cleanedRecipes_1.length; _i++) {
        var recipe = cleanedRecipes_1[_i];
        var recipeKey = "".concat(recipe.name, "-").concat(recipe.cuisine); // Create a unique key
        if (!seenRecipes.has(recipeKey)) {
            uniqueRecipes.push(recipe);
            seenRecipes.add(recipeKey);
        }
    }
    return uniqueRecipes;
}
exports.cleanedRecipeData = cleanedRecipeData;
