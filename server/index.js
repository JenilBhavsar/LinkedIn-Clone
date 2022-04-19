//Add babel
const express = require('express')
const products = require('./data')

const app = express()

app.listen(5000, () => {
    console.log('server is listening on port 5000')
})

const auth = (req, res, next) => {
    const user = req.query.user
    if (user === 'admin') {
        req.user = { name: 'admin', id: 1 }
        next()
    } else {
        res.status(401).send('Unauthorized')
    }
}

app.use(auth)

app.get('/api/products', (req, res) => {
    const partial_products = products.map(product => {
        return { id: product.id, name: product.name }
    })
    res.json(partial_products)
})

app.get('/api/products/:productID', (req, res) => {
    const id = Number(req.params.productID)
    const product = products.find(product => product.id === id)
    
    if (!product) {
        return res.status(404).send('Product not found')
    }

    res.json(product)
})

app.get('/api/query', (req, res) => {
    const name = req.query.name.toLowerCase()
    console.log(name)
    const products_result = products.filter(product => product.name.toLowerCase().includes(name))

    if (products_result.length < 1) {
        return res.status(200).send('No products matched your search')
    }
    res.json(products_result)
})

app.get('/about', (req, res) => {
    console.log(req.user)
    return res.send('About Page')
})