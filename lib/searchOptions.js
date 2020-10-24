const config = require('../config')

module.exports = function (req) {
    const maxQueryLimit = 15;
    const query = req.query;
    const searchOptions = {};

    // page number
    searchOptions.page = query.page > 0 ? query.page * 1 : 1;

    // set the limit
    searchOptions.limit = query.limit 
        && query.limit < maxQueryLimit
        && query.limit > 0
        ? query.limit * 1 : maxQueryLimit;

    // sort order for price (default == asc)
    searchOptions.sort = query.sort == 'desc' ? '-price' : 'price';

    return searchOptions;
}