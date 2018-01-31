const parseToJson = (jsonString) => {
  const obj = JSON.parse(jsonString);
  return typeof obj === 'string' || obj instanceof String ?
    parseToJson(obj) :
    obj;
}

class BaseModel {
  toJson() {
    const jsonString = JSON.stringify(this, (key, value) => {
      return (value && typeof value.toJSON === 'function')
        ? value.toJSON()
        : JSON.stringify(value);
    });

    return parseToJson(jsonString);
  }
}

module.exports = BaseModel;
