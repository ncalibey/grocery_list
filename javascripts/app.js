$(() => {
  const Templates = {};

  Handlebars.registerPartial('item', $('#item').html());

  $('[type="text/x-handlebars"]').each((i, template) => {
    const $template = $(template).remove();

    Templates[$template.attr('id')] = Handlebars.compile($template.html());
  });

  const Items = {
    $tbody: $('tbody'),
    collection: [],
    currentId: 1,

    create (itemData) {
      const item = new ProductModel(itemData);

      item.set('id', this.currentId++);

      this.collection.push(item);

      return item;
    },

    render () {
      this.$tbody.html(Templates.items({
        items: this.collection
      }));
    },

    renderPartial (product) {
      this.$tbody.append(Templates.item(product.attributes));
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

      this.renderPartial(product);

      e.currentTarget.reset();
    },

    delete (e) {
      e.preventDefault();

      const id = Number($(e.target).attr('data-id'));
      let mismatches = _.groupBy(this.collection, item => item.get('id') === id).false;

      if (mismatches === undefined) mismatches = [];
      this.collection = mismatches;

      this.render();
    },

    deleteAll (e) {
      e.preventDefault();

      this.collection = [];

      this.render();
    },

    sortItems (e) {
      const property = $(e.target).attr('data-prop');

      this.collection = _.sortBy(this.collection, item => item.get(property));

      this.render();
    },

    bindEvents () {
      this.$tbody.on('click', 'a', this.delete.bind(this));
      $('form').on('submit', this.add.bind(this));
      $('p a').on('click', this.deleteAll.bind(this));
      $('th').on('click', this.sortItems.bind(this));
    },

    init () {
      this.seedCollection();
      this.render();
      this.bindEvents();
    },
  };

  const ProductModel = Backbone.Model.extend();

  Items.init();
});
