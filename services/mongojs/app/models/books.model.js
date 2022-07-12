module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      name: String
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const myDB = mongoose.connection.useDb('library')
  const Books = myDB.model("books", schema);
  return Books;
};
