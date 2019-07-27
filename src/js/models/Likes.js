export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, image) {
        const like = { id, title, author, image };
        this.likes.push(like);

        // Persist data in local storage
        this.persistData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(e => e.id === id); // finds the index of the element that has the passed in id
        this.likes.splice(index, 1);

        // Persist data 
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(e => e.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        // Restoring likes from the localStorage
        if (storage) this.likes = storage;
    }
}