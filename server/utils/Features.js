class Features {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating = (limit) => {
    const page = this.queryString.page * 1 || 1;
    // const limit = this.queryString.limit * 1 || 10;
    const skip = limit * (page - 1);
    this.query = this.query.limit(limit).skip(skip);
    return this;
  };

  sorting = () => {
    const sort = this.queryString.sort || "-createdAt";
    this.query = this.query.sort(sort);
    return this;
  };

  searching = () => {
    const search = this.queryString.search;

    if (search) {
      this.query = this.query.find({
        $text: { $search: search },
      });
    } else {
      this.query = this.query.find();
    }
    return this;
  };

  filtering = () => {
    const queryObj = { ...this.queryString };

    const excludedFields = ["page", "sort", "limit", "search"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  };

  counting = () => {
    this.query = this.query.count();
    return this;
  };
}

module.exports = Features;
