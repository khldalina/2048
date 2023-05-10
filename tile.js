// оголошуємо клас Tile
export class Tile {
    // створуємо конструктор який в аргументах приийматиме (gridElement) щоб ми могли додати плиточку всередиину div gameBoard
    constructor(gridElement) {
        // створюємо пустий div елемент (через this бо він нам пригодиться ще надалі)
        this.tileElemnt = document.createElement("div");
         // за допомогою classList.add додаємо  div елементу клас tile
         this.tileElemnt.classList.add("tile");
         this.setValue( Math.random()> 0.5 ? 2 : 4);
        //  перенесла все в метод setValue
        // за правилами гри у плииточки має буде випадкове значення 2 або 4 тому створємо через Math.random і збережемо у this.value
        // // Math.random() повертає випадкове значення від 0 до 1, в нашому значенні коли Math.random()>0.5 , ти мо будемо задавати значення 2 , якщо інакше то 4
        // this.value = Math.random()> 0.5 ? 2 : 4;
        // // отримане значення додати текстом всередину div елемента .textContent
        // this.tileElemnt.textContent = this.value;


        // додаємо створений елемент всередину div gameBoard ////.append
        gridElement.append(this.tileElemnt);
}


    // описуємо метод setXY , цей мктод змінюватиме значення x y на нові 
    setXY(x, y){
    this.x = x;
    this.y = y;
    //  (також можне змінювати в css стилях значення --x ---y )
    this.tileElemnt.style.setProperty("--x", x);
    this.tileElemnt.style.setProperty("--y", y);
    }

    //  опиисуємо метод setValue, цей метод змінюватиимк=е значення плиточок, а також текст і колір
    setValue(value){
        this.value = value;
        this.tileElemnt.textContent = value;
        // напишемо логіку змінення lightness  зі стиилів на клас tile в css
        // числа на плиточках завждии рівно 2 в якійсь степені   Math.log2 допоможе нам отриимати цю степінь
    //  якщо значення = 2 , то наш вираз стає 100 - 1*9 => 91  (2-> 100 - 1*9 -> 91 ... ~white~); (2048-> 100 - 11*9 -> 1 ...black)
        const bgLightness = 100 - Math.log2 (value) * 9; 
// тепер можна записати вичислене значення замість bgLightness
        this.tileElemnt.style.setProperty("--bg-lightness", `${bgLightness}%`);
        // для світлих плииточок коли bgligtness менше 50 колір тексту буде майже чорним, для темних майже білим 
        this.tileElemnt.style.setProperty("--text-lightness", `${bgLightness < 50 ? 90 : 10}%`);
    }

    // в ньому ми видаляємо tileElement 
    removeFromDOM () {
        this.tileElemnt.remove();
    }
     
    // цей метод повертає проміс який закінчииться коли закінчииться анімаіція переміщення плиточки
    waitForTransitionEnd() {
// щоб спіймати момент колии анімація скінчитьися ми у tileElemen підпишемося на подію transitionend
// в кінці додамо once:true так як нам потрібно підписатися на полію один раз
        return new Promise(resolve => {
            this.tileElemnt.addEventListener("transitionend", resolve, { once:true });
        });
    }

    waitForAnimationEnd () {
        return new Promise(resolve => {
            this.tileElemnt.addEventListener("animationend", resolve, { once:true });
        });
    }

}