import axios from 'axios';
import { key } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    async getRecipe() {
        try {
            const result = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`)
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.image = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;
        } 
        catch (error) {
            alert("Something went wrong!");
            console.log(error);
        }
    }
    calcTime() {
        // Assuming 15 mins per 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }
    calcServings() {
        this.servings = 4;
    }
    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'teaspoon', 'teaspoons', 'ounce', 'ounces', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'tsp', 'tsp', 'oz', 'oz', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g']

        const newIngredients = this.ingredients.map(e => {
            // Uniform units
            let ingredient = e.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, '');

            // Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(e2 => units.includes(e2));
            let objIng;

            if (unitIndex > -1) {
                // There is a unit
                // E.g. 4 1/2 cups, arrCount = [4, 1/2] ---> eval("4+1/2") ---> 4.5
                // E.g. 4 cups, arrCount = [4]
                const arrCount = arrIng.slice(0, unitIndex); // slice array until the unit is found
                let count;

                if (arrCount.length === 1) {
                    count = eval(arrCount[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };


            } else if (parseInt(arrIng[0], 10)) {
                // There is no unit, but 1st element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                };
            } else if (unitIndex === -1) {
                // There is no unit and no number in 1st position 
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                };
            } 

            return objIng;
        });
        this.ingredients = newIngredients;
    }
    updateServings(type) {
        // Increment/decrement servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Update ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        // Update servings
        this.servings = newServings;
    }
}