const fs = require('fs')

export const write = (data, dataName) => {
    const data = JSON.stringify(data, dataName)
    fs.writeFile('../config/global.json', data, (err) => {
        if (err) {
            throw err
        }
        console.log("JSON data is saved.")
    })
}

export const read = (dataName) => {

}