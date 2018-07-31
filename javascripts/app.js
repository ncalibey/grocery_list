$(() => {
  const Templates = {};

  Handlebars.registerPartial('item', $('#item').html());

  $('[type="text/x-handlebars"]').each((i, template) => {
    const $template = $(template).remove();

    Templates[$template.attr('id')] = Handlebars.compile($template.html());
  });


const ProductModel = Backbone.Model.extend();
const Products = Backbone.Collection.extend({
  model: ProductModel,
  lastId: 0,

  render () {
    $('tbody').html(Templates.items({
      items: this.toJSON()
    }));
  },

  renderPartial () {
    $('tbody').append(Templates.item(this.last().toJSON()));
  },

  sortItems (e) {
    const property = $(e.target).attr('data-prop');

    this.comparator = property;
    this.sort();
  },

  isEmpty () {
    return this.length <= 0;
  },

  setLastId () {
    if (this.isEmpty()) return;

    this.lastId = this.last().get('id');
  },

  nextId () {
    return this.lastId + 1;
  },

  initialize () {
    this.on('update', this.setLastId);
    this.on('remove', this.render);
    this.on('add', this.renderPartial);
    this.on('reset', this.render);
    this.on('sort', this.render);
  }
});

  const App = {
    $tbody: $('tbody'),
    collection: new Products(),
    currentId: 1,

    create (itemData) {
      const item = new ProductModel(itemData);
      item.set('id', this.collection.nextId());

      this.collection.add(item);

      return item;
    },

    renderPartial (product) {
      this.$tbody.append(Templates.item(product.toJSON()));
    },

    seedCollection () {
      items_json.forEach(this.create.bind(this));
    },

    formatData (data) {
      const formatted = {};

      data.forEach(obj => {
        formatted[obj.name] = obj.value;
      });

      return formatted;
    },

    add (e) {
      e.preventDefault();

      const data = this.formatData($('form').serializeArray());
      const product = this.create(data);

      e.currentTarget.reset();
    },

    delete (e) {
      e.preventDefault();

      const id = Number($(e.target).attr('data-id'));
      let match = this.collection.where({ id: id });

      this.collection.remove(match);
    },

    deleteAll (e) {
      e.preventDefault();

      this.collection.reset();
    },

    bindEvents () {
      this.$tbody.on('click', 'a', this.delete.bind(this));
      $('form').on('submit', this.add.bind(this));
      $('p a').on('click', this.deleteAll.bind(this));
      $('th').on('click', this.collection.sortItems.bind(this.collection));
    },

    init () {
      this.seedCollection();
      this.collection.render();
      this.bindEvents();
    },
  };

  App.init();
});
