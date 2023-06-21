const express = require('express')
const cors = require('cors')

let { stocks, carts } = require('./db')
const { login, authenticateToken } = require('./controller/AuthController')

const app = express()

app.use(cors())
app.use(express.json())

app.post('/login', login)
app.get('/stocks', authenticateToken, (req, res) => {
    let cartsByUser = carts.filter(cart => cart.user === req.user.username)
    const totalValueReducer = (accumulator, cartItem) => {
        const itemValue = cartItem.price * cartItem.qty;
        return accumulator + itemValue;
    };

    const totalValue = cartsByUser.reduce(totalValueReducer, 0);

    const response = {
        user: req.user.username,
        stocks: stocks,
        carts: cartsByUser,
        total: parseFloat(totalValue).toFixed(2)
    }
    res.json(response)
})

app.put('/stocks', authenticateToken, (req, res) => {
    let { productName, qty } = req.body
    let product = stocks.find(product => product.name == productName)
    let index = carts.findIndex(item => item.name === productName)
    if (index != -1) {
        if (qty == 0) {
            carts.splice(index, 1)
            res.status(201).send({ message: 'Success' });
        } else {
            carts[index].qty = qty
            res.status(201).send({ message: 'Success' });
        }

    } else {
        item = {};
        item.name = product.name
        item.price = product.price
        item.user = req.user.username
        item.qty = qty
        carts.push(item)
        res.status(201).send({ message: 'Success' });
    }


})

app.post('/checkout', authenticateToken, (req,res) => {
    const updatedStocks = stocks.map(stockItem => {
        const cartItem = carts.find(cartItem => cartItem.name === stockItem.name);
        if (cartItem) {
          stockItem.stock -= cartItem.qty;
        }
        return stockItem;
      });

      stocks = updatedStocks

      carts = []

      res.status(201).send({ message: 'Success' });
})

app.use('/public', express.static('public'))

app.listen(3000, () => {
    console.log('Server running on port 3000')
})