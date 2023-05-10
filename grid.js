// додаємо клас створений клас  Cell  за допомогою import{Cell}
import { Cell } from "./cell.js";



const GRID_SIZE = 4;
//всередині конструктора ми створемо 16 ячейок  і збережемо їх в масив cells 4*4=16
const CELLS_COUNT = GRID_SIZE * GRID_SIZE; 
// об'являємо клас grid .. створємо конструктор всередиині цього класу.. який в параметрах приймає grid елемент.. 
// конструктор викликається 1 раз в момент створення екземпляра класа
// для цього об'явимо об'єкт з класом cells і спочатку задамо йому значення рівне пустому масиву []
// конструктор викликається 1 раз в момент створення екземпляра класа
// за допомогою циклу for заповнимо цей масиив
export class Grid {
    constructor(gridElement) {
        this.cells = [];
        // вставляємо в  array.length  константу CELLS_COUNT і на кожній ітерації циклу методом push будемо додавати нову ячейку
        for (let i = 0; i<CELLS_COUNT; i++) {
            this.cells.push(
                // нова ячуейка це екземпляра класа Cell, який ми створимо (new Cell)
           // клас Cell в якості аргументів приматиме gridElement, x, y
// gridElement потрібен щою ми могли додати ячейку в  div gameBoard 
// x/y щоб ми розуміли положення ячейки
// коли ми створили і імпортували клас Cell, потрібно коректно ввести х і у
                // new Cell (gridElement, x, y)
                // х = i % GRID_SIZE, тобто ми будемо брати залишок від ділення і на 4, х буде змінюватися від 0 до 3 і так 4 рази
                // y = Math.floor(i / GRID_SIZE),  тобто ми будемо брати цілу частину від ділення і на 4
                // у буде змінюватися також від 0 до 3, але перші 4 елемент отримують у=0, наступні у=1, потім у=2, потім у=3
                new Cell (gridElement, i % GRID_SIZE, Math.floor(i / GRID_SIZE))
            );
        }

        // описуємо властивості cellsGroupedBByColumn 
        //  його вичеслення зробимо в методі gruopCellsByColumn()
        this.cellsGroupedByColumn = this.gruopCellsByColumn();
        // перевернутий масив cellsGroupedByReversedColumn буде рівний cellsGroupedByColumn
        // з допомогою map і  reverse ми можемо змінити порядок ячейок навпаки
        this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn.map(column => [...column].reverse());
        this.cellsGroupedByRow = this.groupCellsByRow();
        this.cellsGroupedByReversedRow = this.cellsGroupedByRow.map(row => [...row].reverse());
    }
  
// нам потрібно згрупувати ячейки в новий масив, для цього використаємо матод .reduce () по нашим 16 ячейкам із this.cells
    gruopCellsByColumn() {
        // метод reduce прицмає в якості аргумента функцію, де ми будемо писати групування і початковий елемент (в нашому випадку пустий масив)
        // функціє матим е 2 параметра (groupCells , cell)    
    //  groupCells - це акамулятор метода reduce (спочатку це []) ,(там зберігається значення яке ми повертаємо з внутрішньої функції на кожній ітерації)
    //  cell - це порядкова ячейка з масива cells
        return  this.cells.reduce((groupedCells , cell) => {
// логіка групування 
//   groupedCells[cell.x] дорівнює номеру стовпчика  
            groupedCells[cell.x] = groupedCells[cell.x] || []; 
            groupedCells[cell.x][cell.y] = cell;

            return groupedCells;
        },[]);
    }

    groupCellsByRow() {
        return  this.cells.reduce((groupedCells , cell) => {
            // логіка групування 
            //   groupedCells[cell.y] дорівнює номеру рядка  
                        groupedCells[cell.y] = groupedCells[cell.y] || []; 
                        groupedCells[cell.y][cell.x] = cell;
            
                        return groupedCells;
                    },[]);
    }

    // описуємо метод getRandomEmptyCell() , всередині ноього ми шукаємо всі пусті ячейки 
    getRandomEmptyCell() {
            // для цього потрібно відфільтрувати всі  ячейки 
        // збережемо в константі emptyCells тільки пусті ячейки
        const emptyCells = this.cells.filter(cell => cell.isEmpty());
        // дістаємо випадкову ячейку серед всіх пустих
        // для цього Math.random  помножимо на довжину масива і округлиимо до цілої частини
        //  так як Math.random повертає виипадкове число від 0 до 1 (не включаючи 1) при множенні на довживану масива  ми отримаємо число від 0 до довжини масива (не включаючиии число яке дорівною довжині масива) 
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        // повертаємо пусту ячейку
        return emptyCells [randomIndex];

    }
}
