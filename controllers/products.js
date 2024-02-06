const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({price: {$gt: 30,}}).sort('price')
    res.status(200).json({products})
} 

const getAllProducts = async (req, res) => {
    const {featured, company, name, sort, filter, numericfilters} = req.query
    const queryObject = {}

    if(featured){
        queryObject.featured = featured === 'true' ? true : false
    }
    if(company){
        queryObject.company = company
    }
    if(name){
        queryObject.name = { $regex: name, $options: 'i'}
    }
    if(numericfilters){
        const operatorMap = {
            '>':'$gt',
            '<':'$lt',
            '>=':'$gte',
            '<=':'$lte',
            '=':'$eq',
        }
        const regEX = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericfilters.replace(regEX, (match) => `-${operatorMap[match]}-`)
        const options = ['price', 'rating']
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if(options.includes(field)){
                queryObject[field] = {[operator]: Number(value)}
            }
        });
    }
    console.log(queryObject)
    let result =  Product.find(queryObject)
    //sort
    if(sort){
       const sortList = sort.split(',').join('')
       result = result.sort(sortList)
    }else{
        result = result.sort('createdAt')
    }

    if(filter){
        const filterList = filter.split(',').join(' ')
        result = result.select(filterList) 
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)

    const products = await result
    res.status(200).json({products, nbHits: products.length})
} 

module.exports = {
    getAllProducts, 
    getAllProductsStatic
}