const { json } = require('express');
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid');
let data = require('./../data/courses.json')

class Course {
    constructor(title, price, img){
        this.title = title
        this.price=price
        this.img=img
        this.id = uuidv4()
    }

    toJSON(){
        return {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        }
    }

    static async saveFile(){
        return new Promise((resolve, reject)=>{
            fs.writeFile(path.join(__dirname, '../data/courses.json'), JSON.stringify(data), (err)=>{
                if (err)
                    reject(err);
                else
                    resolve(data)
            });
        })
    }

    async save (){
        data.push(this.toJSON());
        return Course.saveFile();
    }

    static getById(id){
        return data.find(c => c.id === id)
    }

    static getAll(){
        return data;
    }

    static update(course){
        const idx = data.findIndex(item=>item.id===course.id)
        data[idx].title = course.title;
        data[idx].price = course.price;
        data[idx].img = course.img;
        return this.saveFile();
    }
}

module.exports = Course;