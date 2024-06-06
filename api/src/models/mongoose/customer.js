module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: String,
      surname: String,
      email: String,
      telephone: String,
      images: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
      },
      deletedAt: Date
    },
    { timestamps: true }
  )

  const Customer = mongoose.model('Customer', schema, 'customers')
  return Customer
}