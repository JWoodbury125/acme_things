const Sequelize = require('sequelize')
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme-things')

const Thing = db.define('thing', {
    name:{
        type: Sequelize.STRING,
    }
})

const express = require('express')
const app = express()
const path = require('path')

app.use('/src', express.static(path.join(__dirname, 'src')))

app.get('/', (req, res) => res.redirect('/api/things'))

app.get('/api/things', async (req, res, next) => {
    try{
        const things = await Thing.findAll()
        const html = things.map(thing => {
            return `<div> ${thing.name}</div>`
        }).join('')
        res.send(`<html>
                    ${html}
                  </html>`)
    }
    catch(ex){
        next(ex)
    }
})

const init = async () => {
    try{
        await db.sync( {force: true})

        const foo = await Thing.create({name: 'foo'})
        const bar = await Thing.create({name: 'bar'})
        const bazz = await Thing.create({name: 'bazz'})
        const PORT = process.env.PORT || 3000
        app.listen(PORT, () => {
        console.log (`listening on port ${PORT}`)
})

    }
    catch(ex){
        console.log(ex)
    }
}

init()




