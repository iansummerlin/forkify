import axios from 'axios';
import { key } from '../config';


export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResult() {
        try {
            const response = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = response.data.recipes;
            console.log(this.result);
        } catch (error) {
            alert(error);
        }
    }
}