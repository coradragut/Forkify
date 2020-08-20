import uniqid from 'uniqid';

export default class List{
    constructor(){
        this.items = [];
    }

    addItem (count, unit, ingredient){
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem (id){
        const index = this.items.findIndex(el => el.id === id);
        // [2,4,8] splice(1,1)=> returns 4, original array is [2,8]; second one means how many elements to remove; first one is start index for both methods
        //  [2,4,8] slice(1,2) => returns 4, original array is [2,4,8]; "2" means end index, which is not included in the result
        this.items.splice(index, 1); //we only want to remove 1 element
    }

    updateCount(id, newCount){ //daca vrei sa modifici cantitatile de ingrediente
        this.items.find(el=> el.id === id).count = newCount;
    }
}