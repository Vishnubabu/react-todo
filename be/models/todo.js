import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * Todo Schema
 */
const TodoSchema = new Schema({
  title: { type: String, trim: true, maxlength: 400 },
  checked: { type: Boolean,  default: false },
  createdAt: { type: Date, default: Date.now }
});

/**
 * Validations
 */
TodoSchema.path('title').required(true, 'Title cannot be blank');

/**
 * Statics
 */
TodoSchema.statics = {
  /**
   * List Todos
   *
   * @param {Object} options
   * @api private
   */

  list: function (options) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 30;
    return this.find(criteria)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
};

export default () => {
  mongoose.model('Todo', TodoSchema);
}