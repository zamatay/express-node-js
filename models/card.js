const card = require('../data/card')
const path = require('path')
const fs = require('fs')

const pathToData = path.join(path.dirname(process.mainModule.filename), 'data', 'card.json');
class Card{

    static add(course){
        const idx = card.courses.findIndex(item=>item.id === course.id)
        if (idx === -1)
        {
            course.count = 1;
            card.courses.push(course)
            // card.price = card.courses.reduce((sum, current)=>{
            //     return sum + current.price;
            // }, 0)
        } else {
            card.courses[idx].count++;
        }
        card.price += +((course.price)?course.price:0);
        Card.saveFile();
    }

    static remove(id){
        const idx = card.courses.findIndex(item=>item.id===id);
        const item = card.courses[idx];
        if(item){
            if (item.count === 1)
                card.courses = card.courses.filter(i=>i.id !== id);
            else
                card.courses[idx].count--;
            card.price -= item.price;
            this.saveFile();
        }
        return card;
    }

    static fetch(){
      return card;
    }

    static async saveFile(){
        return new Promise((resolve, reject)=>{
            fs.writeFile(pathToData, JSON.stringify(card), (err)=>{
                if (err)
                    reject(err);
                else
                    resolve(card)
            });
        })
    }
}

module.exports = Card;