// import str from './models/Search';
// //import {add as a, multiply as m, ID} from './views/searchView';
// import * as searchView from './views/searchView';

// //console.log(`Using imported functions! ${a(ID, 2)} and ${m (3,5)}. ${str}`);
// console.log(`Using imported functions! ${searchView.add(searchView.ID, 2)} and ${searchView.multiply (3,5)}. ${str}`);

// import axios from 'axios';

// async function getResults(query){
//     try{
//     const res = await axios(`https://cors-anywhere.herokuapp.com/https://forkify-api.herokuapp.com/api/search?q=${query}`);
//     const recipes = res.data.recipes;
//     console.log(recipes);
//     } catch (error) {
//         alert(error);
//     }
    
    
// }
// getResults('pizza');


import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView'; 
import * as recipeView from './views/recipeView'; 
import * as listView from './views/listView'; 
import * as likesView from './views/likesView'; 
import {elements, renderLoader, clearLoader} from './views/base';



/** Global state of the app
 * -Search object
 * -Current recipe object
 * -Shopping list object
 * -Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async() => {
    //1.get query from view
    const query = searchView.getInput();

    if(query){
        //2.new search object and add it to state
        state.search = new Search(query);

        //3.prepare UI for results
        listView.clearList(); 
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try{
        //4.search for recipes
        await state.search.getResults();    

        //5.render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
        } catch (error){
            alert('Something wrong with the search...');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e=> {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }

});

/**
 * RECIPE CONTROLLER
 */

// const r = new Recipe(46956);
// r.getRecipe(); 
// console.log(r);

const controlRecipe = async() => {
   //get ID from URL
    const id = window.location.hash.replace('#', '');

    if(id){
        //1.prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //1a.highlight selected search item
        if(state.search) searchView.highlightSelected(id);

        //2.create new recipe object
        state.recipe = new Recipe(id);

        try{
        //3.get recipe data and parse ingredients
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();

        //4.calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();

        //5.render recipe
        clearLoader();
        recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (error){
            alert('Error processing recipe!');
        }
    }
};


/**
 * LIST CONTROLLER
 */

 const controlList = () => {
     //create a new list if there is none yet
    if(!state.list) {state.list = new List();}

    //add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });      
 }


//Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        //delete from state
        state.list.deleteItem(id);

        //delete from UI
        listView.deleteItem(id);

        //handle the count update
    } else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        if(val >= 0){
            state.list.updateCount(id, val);
        }
        
    }
});



/**
 * LIKE CONTROLLER
 */

const controlLike = () => {
    if(!state.likes) {state.likes = new Likes();}
    const currentID = state.recipe.id;

    //user has NOT yet liked current recipe
    if(!state.likes.isLiked(currentID)){
        //add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        //toggle the like button
        likesView.toggleLikeBtn(true);

        //add like to the UI list
        likesView.renderLike(newLike);

    //user HAS liked current recipe
    } else {
        //remove like from the state
        state.likes.deleteLike(currentID);
        
        //toggle the like button
        likesView.toggleLikeBtn(false);

        //remove like from the UI list
        likesView.deleteLike(currentID);

    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

 
//restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    //restore likes
    state.likes.readStorage();

    //toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //render existing like
    state.likes.likes.forEach(like => likesView.renderLike(like));
});


// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//handling recipe button clicks
elements.recipe.addEventListener('click', e=> {
    //if the element clicked matched the .btn-decrease class or any child of this class
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //decrease button is clicked
        if(state.recipe.servings >1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')){
        //increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){ 
        listView.clearList();  
        //add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')){
        //like controller
        controlLike();
    }  
});






