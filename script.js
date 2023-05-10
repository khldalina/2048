import{ Grid }  from "./grid.js";
import { Tile } from "./tile.js";


const  gameBoard = document.getElementById("game-board");


// grid це буде клас який зберігає в собі всі ячейки ...переходимо до файлу grid.js
const grid = new Grid(gameBoard);

// додаємо плииточку з цифрою, для цього нам потрібно отримати рандомну пусту ячейку (grid.getRandomEmptyCell())
// до ячейки присвоїм плиточку (.linkTile)
//  створиимо нову плиточку (new Tile(gameBoard))
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));



// переміщення і обєднання плииточок можна буде стрілками на клавуатурі , тому треба підписатися на подію натискання клавіші 
// підписуватися будемо 1 раз потім прораховувати логіку і підписуватися заново
//  додаємо визов функції 
setupInputOnce();


// описуємо вище наведену функцію
function setupInputOnce() {
// підписалися на натиск клавіші 1 раз
    window.addEventListener("keydown", handleInput, {once:true});

    
}

//після  натиску клавіші буде визвана функція handleInput
async function handleInput(event) {
    switch (event.key) {
        case "ArrowUp":
            // якщо немає куди двигатися вгору (щоб не створювалася новва плиточка)
            if (!canMoveUp()){
                setupInputOnce();
                return
            }
           await moveUp();
            break;
    
        case "ArrowDown":
        // якщо немає куди двигатися вниз (щоб не створювалася новва плиточка)
            if (!canMoveDown()){
                
                setupInputOnce();
                return
            }
            await moveDown();
            break;

        case "ArrowLeft":
        // якщо немає куди двигатися в ліво (щоб не створювалася новва плиточка)
            if (!canMoveLeft()){
                setupInputOnce();
                return
            }
            await moveLeft();
            break;

        case "ArrowRight":
        // якщо немає куди двигатися в право (щоб не створювалася новва плиточка)
            if (!canMoveRight()){
                setupInputOnce();
                return
            }
            await moveRight();
            break;

            default:
                setupInputOnce();
                return;
    }

    // додавання нової плиточкии у випадкову ячейку
const newTile = new Tile(gameBoard);
grid.getRandomEmptyCell().linkTile(newTile);

// 
if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    await newTile.waitForAnimationEnd();
    alert("Try again!");
    return;
}

    setupInputOnce();
}


// в цій функції ми будемо здвигати плиточки вгору
async function moveUp() {
    //  спочатку ми гркпуємо наші 16 иячейко по стовпчикам ->  у нас вийде масиив із 4 стовпчииків
    // кожен стовпчик це масиив із 4 ячейок 
    // після цього ми пройдемося по всім стовпчикам , а в кожносму стовпчику здвинемо привязані плиточкий вверх
    await slideTiles(grid.cellsGroupedByColumn);
}

// в цій функції ми будемо здвигати плиточки вниз (перевернутий група масиива)
async function moveDown() {
    await slideTiles(grid.cellsGroupedByReversedColumn);
}

// в цій функції ми будемо здвигати плиточки в ліво
async function moveLeft() {
    // по суті slideTiles знову переміщує вгору плииточки, але чрез те що ми передаємо масив згрупований по рядкам , slideTiles буде переміщуквати в ліво
   await  slideTiles(grid.cellsGroupedByRow);
}

// в цій функції ми будемо здвигати плиточки в право
async function moveRight() {
    // 
    await slideTiles(grid.cellsGroupedByReversedRow);
}



// описуємо функцію
async function slideTiles(groupedCells) {
    // при кожному переміщенні плиточок будемо створювати проміси
    const promises = [];
//  описуємо логіку переміщення плиточок вверх
//  forEach --  пробіжимся по згрупованим ячейкам
// для кожної групи виклиичемо slideTilesInGroup тобто slideTilesInGroup викличеться 4 рази для кожного стовпчика з ячейками
    groupedCells.forEach(group =>  slideTilesInGroup(group, promises));

    // тут ми дочекаємся переміщення аніфмації всіх плиточок і після цього перейдемо до обєднання плиточок
await Promise.all(promises);

// обєднання плиточок
    grid.cells.forEach(cell => {
    cell.hasTileForMerge() && cell.mergeTiles();
});
}

//  приймати згруповвані стопчики з ячейками
function slideTilesInGroup(group, promises) {
    //пробіжимся по ячецками в стовпчику, але найвищу ячейку ми НЕ ВРАХОВУЄМО через те починаємо з і=1
    for (let i=1; i<group.length; i++){
        // зміщувати ми будемо тільки плиточкии, тому спершу перевіряємо ячейку на пустоту
        // якщо вона пуста тобто без плиточки .. ми продовжуємо 
         if (group[i].isEmpty()) {
            continue;
         }

        //  записуємо в констату ячейку group[i];
         const cellWithTile = group[i];
        //  далі ми шукаємо плиточку на яку ми можемо змістити нашу поточку плиточку
        //  для цільової ячейки стврорюємо змінну
        let targetCell;
        //  нам потрібно пробігтися циклом по ячейкам вище нашої
        let j = i - 1;
//  умова циклу буде що ми не досягли верху 
         while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
            // будемо зберігатии провірену ячейку в targetCell
            // коли ми досягнемо самого верху або впремося в попередню плиточку(місце якої ми не зможумо заняти )у нас буде в targetCell ячейка куди ми зможемо перемістити плиотчку 
            targetCell = group[j];
            j--;  
        }
// якщо ми не знайшли цільову ячейку для переміщення (наприклад сусідня ячейка була з плиточкою з іншим значенням ) в цьому випадку continue
        if (!targetCell) {
            continue;
        }

        // додаємо в масиив промісів очікування закінчення анімації при обєднанні плиточок 
        promises.push( cellWithTile.linkedTile.waitForTransitionEnd());


// якщо цільова ячейка пуста ми просто присврїмо їй плиточку за допомогою  методу .linkTile
        if(targetCell.isEmpty()) {
            targetCell.linkTile(cellWithTile.linkedTile);
            // у випадку якщо цільова ячейка з  плиточкою  ми присвоїми їй нашу плииточку інакше за допомогою методy linkTileForMerge
        } else{
            // зав допомогоб цього методу ми зможемо спершу перемістити плиточку в нове місце а потім обєднати з іншою плиточкою
            targetCell.linkTileForMerge(cellWithTile.linkedTile);
        }
        cellWithTile.unLinkTile();
    }
}
// 
function canMoveUp() {
    return canMove(grid.cellsGroupedByColumn);
}
function canMoveDown() {
    return canMove(grid.cellsGroupedByReversedColumn);
}
function canMoveLeft() {
    return canMove(grid.cellsGroupedByRow);
}
function canMoveRight() {
    return canMove(grid.cellsGroupedByReversedRow);
}

// буде проходити по згрупованим стовпчикам ячейкам 
// і з допомогою метода some буде перевіряти що хоч в якомусь із стовпчиків модна двигатися вверх
function canMove(groupedCells) {
    return groupedCells.some(group => canMoveInGroup(group));
}

// 
function canMoveInGroup (group) {
 return group.some((cell, index) => {
    // логіка чи є куди двигатися плиточці
    if (index === 0) {
        return false;
    }
    if (cell.isEmpty()) {
        return false;
    }

    // якщо ми можемо переміститися в сусідню наприклад то вже гуд (сусідня це так в якої індекс на 1 менше)
    const targetCell = group[index -1];
    return targetCell.canAccept(cell.linkedTile);
 });
}