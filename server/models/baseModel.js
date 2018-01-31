class BaseModel {
  toJson() {
    const jsonString = JSON.stringify(this, (key, value) => {
      return (value && typeof value.toJSON === 'function')
        ? value.toJSON()
        : JSON.stringify(value);
    });

    return JSON.parse(jsonString);
  }
}

module.exports = BaseModel;
