const getPagination = (page = 1, limit = 10) => {

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    return {
        pageNumber,
        limitNumber,
        skip: (pageNumber - 1) * limitNumber,
    };
};

module.exports = getPagination;