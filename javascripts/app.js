$(() => {
  const App = {
    init () {
      this.Items = new ItemsCollection(items_json);
      this.View = new ItemsView({ collection: this.Items });
      this.Items.sortByName();
    }
  };

  const ItemModel = Backbone.Model.extend({
    idAttribute: 'id',
    initialize () {
      this.collection.incrementID();
      this.set('id', this.collection.lastId);
    }
  });

  const ItemsView = Backbone.View.extend({
    events: {
      'click a': 'removeItem',
    },
    template: Handlebars.compile($('#items').html()),
    el: 'tbody',

    render () {
      this.$el.html(this.template({
        items: this.collection.toJSON()
      }));
    },

    removeItem (e) {
      e.preventDefault();

      const model = this.collection.get(Number($(e.target).attr('data-id')));
      this.collection.remove(model);
    },

    initialize () {
      this.render();
      this.listenTo(this.collection, 'remove reset rerender', this.render);
    },
  });

  const ItemsCollection = Backbone.Collection.extend({
    lastId: 0,
    model: ItemModel,

    incrementID () {
      this.lastId++;
    },

    sortBy (prop) {
      this.models = _(this.models).sortBy(m => m.attributes[prop]);
      this.trigger('rerender');
    },

    sortByName () {
      this.sortBy('name');
    },

    initialize () {
      this.on('add', this.sortByName);
    }
  });

  Handlebars.registerPartial('item', $('#item').html());

  $('form').on('submit', (e) => {
    e.preventDefault();

    const $form = $(e.target);
    const inputs = $form.serializeArray();
    const attrs = {};

    inputs.forEach(input => attrs[input.name] = input.value);

    let item = App.Items.add(attrs);
    $form.reset();
  });

  $('th').on('click', (e) => {
    const prop = $(e.currentTarget).attr('data-prop');
    App.Items.sortBy(prop);
  });

  $('p a').on('click', e => {
    e.preventDefault();

    App.Items.reset();
  });

  App.init();
});
