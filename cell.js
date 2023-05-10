// оголошуємо клас Cell
export class Cell {
    // створуємо конструктор який в параметрах приийматиме (gridElement, x ,y)
    constructor(gridElement, x ,y) {
        // створуємо пустий div елемент і зберігаємо його в константу cell
        const cell = document.createElement("div");
        // за допомогою classList.add додаємо до div елементу клас cell
        cell.classList.add("cell");
        // додаємо створений елемент всередину div gameBoard 
        gridElement.append(cell);
        // збережемо х/у всередиині класа
        this.x = x;
        this.y = y;

    }


    // опис методу linlTile (в аргументах він має приймати плиточку tile)
    // цей метод буде зберігати плиточку  в всередиині ячейки 

    linkTile(tile) {
        // буде встановлювати координати плиточки з допомогою методу setXY
        tile.setXY(this.x, this.y);
         // цей метод буде зберігати плиточку  в всередиині ячейки 
        this.linkedTile = tile;

    }

    // додаємо метод unLinkTile
        unLinkTile() {
        // записуємо ссилку на привязану плиточку на null
        this.linkedTile = null;
    }

        // описуємо метод isEmpty
    
        isEmpty(){
            // він повертати ме false/true в залeжності від того чи є у ячейки прив'язана плиточка чи ні
            return !this.linkedTile;
        }
    

        // цей метод змінює координати плиточки на нові з допомогою setXY
        linkTileForMerge (tile) {
            tile.setXY(this.x, this.y);
            // зберігати в linkTileForMerge
            this.linkedTileForMerge = tile;
        }

        // метод буде очищувати значення  linkedTileForMerge 
        unLinkTileForMerge () {
            this.linkedTileForMerge = null;
        }

// цим методом ми будемо повертати true коли до ячейкии   вже привязали плиточку на обєднання  
    hasTileForMerge () {
        return !!this.linkedTileForMerge;
    }


        // цим методом мии м аємо відповісти чи зможемо ми перемістити плиточку на поточну ячейку (true/false)
        canAccept (newTile) {
//  ячейка зможе прийняти плиточку якщо вона пуста 
// або якщо до ячейки ще не привязали іншу плиточку для обєднання і у поточної плиточки ячейки  і нової плиточки однакові значення 
// важливо перевірити щоб  до плиточки не була привязана інша плиточка на обєднання 
            return (
                this.isEmpty() || 
                (!this.hasTileForMerge() && this.linkedTile.value === newTile.value)
            );
        }

        // метод mergeTiles

        mergeTiles () {
            //       заміна значення привязаної плиточки на суму  двох плиточок
            this.linkedTile.setValue(this.linkedTile.value + this.linkedTileForMerge.value);
            // видалимо другу прилотчку з верстки
            this.linkedTileForMerge.removeFromDOM();
            //  відвяжемо другу плиточку від ячейки 
            this.unLinkTileForMerge();
        }



}