module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      sp: String,
      es: String,
      regular: Boolean
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const myDB = mongoose.connection.useDb('conjugator')
  const Verbs = myDB.model("verbs", schema);
  return Verbs;
};
