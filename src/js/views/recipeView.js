import {elements} from './base';
import fracty from 'fracty';
//import {Fraction} from 'fractional';


export const clearRecipe = () => {
    elements.recipe.innerHTML = '';
};

const formatCount = count =>{
    if(count){
        // ex count = 2.5 --> 2 1/2
        // ex count = 0.5 --> 1/2
        // const newCount = Math.round((count * 10000) / 10000); //hack, pt a ne da un numar cu 4 zecimale si nu doar un integer; atatea zerouri -cate zecimale vrem sa avem
        // const[int, dec] = newCount.toString().split('.').map(el => parseInt(el, 10));
        
        // if(!dec) return newCount;

        // if(int === 0){
        //     const fr = new Fraction(newCount);
        //     return `${fr.numerator}/${fr.denominator}`;
        // } else {
        //     const fr = new Fraction(newCount - int);
        //     return `${int} ${fr.numerator}/${fr.denominator}`;
        // }
        return `${fracty(count)}`; //cu noua metoda aici nu se modifica nimic pt ca linia asta nu facea parte din metoda initiala
    }
    return '?';
};

const createIngredient = ingredient => `
    <li class="recipe__item">
    <svg class="recipe__icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMinYMin">
        <use xlink:href="#img-checkmark"></use>
    </svg>
    <div class="recipe__count">${formatCount(ingredient.count)}</div>
    <div class="recipe__ingredient">
        <span class="recipe__unit">${ingredient.unit}</span>
        ${ingredient.ingredient}
    </div>
    </li>
`;

export const renderRecipe = (recipe, isLiked) => {
    const markup = `
        <figure class="recipe__fig">
            <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
             </h1>
        </figure>

        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMinYMin">
                    <use xlink:href="#img-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMinYMin">
                     <use xlink:href="#img-user"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                <span class="recipe__info-text"> servings</span>

                <div class="recipe__info-buttons">
                    <button class="btn-tiny btn-decrease">
                        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMinYMin">
                            <use xlink:href="#img-subtract"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny btn-increase">
                         <svg  width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMinYMin">
                            <use xlink:href="#img-add"></use>
                         </svg>
                    </button>
                </div>

            </div>
            <button class="recipe__love">
                 <svg class="header__likes" width="20" height="20" viewBox="0 0 20 20"  xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMinYMin">
                    <use xlink:href="#img-heart${isLiked ? '' : '-outlined'}"></use>
                </svg>
            </button>
        </div>



        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map(el => createIngredient(el)).join('')}
            </ul>

            <button class="btn-small recipe__btn recipe__btn--add">
                <svg class="search__icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMinYMin">
                    <use xlink:href="#img-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>

        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                <span>Directions</span>
                <svg class="search__icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMinYMin">
                    <use xlink:href="#img-triangle-right"></use>
                </svg>

            </a>
        </div>
    `;
    elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

export const updateServingsIngredients = recipe => {
    //update servings
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

    //update ingredients
    const countElements = Array.from(document.querySelectorAll('.recipe__count'));
    countElements.forEach((el, i) => {
        el.textContent = formatCount(recipe.ingredients[i].count);
    })

};