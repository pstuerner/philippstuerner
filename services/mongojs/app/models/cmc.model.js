module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        timestamp: Date,
        listings: Array,
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const myDB = mongoose.connection.useDb('cmcscanner')
    const Listings = myDB.model("listings", schema);
    return Listings;
  };
  