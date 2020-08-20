export default class Likes {
    constructor(){
        this.likes = [];
    }

    addLike(id, title, author, img){
        const like = {id, title, author, img};
        this.likes.push(like);

        //persist the data in localStorage
        this.persistData();

        return like;
    }

    deleteLike(id){
        const index = this.likes.findIndex(el => el.id === id); //ca sa stim de la ce index din arrayul de likes sa stergem elementul
        this.likes.splice(index,1);

        //persist the data in localStorage
        this.persistData();
    }

    isLiked(id){
        return this.likes.findIndex(el => el.id === id) !== -1; //find if the element with that id is present in the array of likes or not
    }

    getNumLikes(){
        return this.likes.length;
    }

    persistData(){
        localStorage.setItem('likes', JSON.stringify(this.likes)); //converts the array to string
    }

    readStorage(){
        const storage = JSON.parse(localStorage.getItem('likes')); //converts to the data structure that it was before
        if(storage){
            //restore likes from localStorage
            this.likes = storage;
        }
    }
}