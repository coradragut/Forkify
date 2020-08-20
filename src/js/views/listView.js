import {elements} from './base';

export const renderItem = item => {
    const markup = `
        <li class="shopping__item" data-itemid = ${item.id}>
            <div class="shopping__count">
                <input type="number" min="0" value="${item.count}" step="${item.count}" class="shopping__count-value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMinYMin">
                    <use xlink:href="#img-cancel-circle"></use>
                </svg>
            </button>
        </li>
    `;
    elements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    if(item) {item.parentElement.removeChild(item);}
};

export const clearList = () => {
    elements.shopping.innerHTML = '';
};