import RESTSerializer from '@ember-data/serializer/rest';

export default class TodoSerializer extends RESTSerializer {
  primaryKey = 'id';

  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    // Format payload to match Ember Data expectations
    payload = { todos: payload };

    return super.normalizeResponse(
      store,
      primaryModelClass,
      payload,
      id,
      requestType
    );
  }
}
