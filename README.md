# aries-activity-marketo-source (In Progress)
Aries activity for [Marketo](https://developers.marketo.com/)

[![CircleCI](https://circleci.com/gh/aries-data/aries-activity-marketo-source.svg?style=svg)](https://circleci.com/gh/aries-data/aries-activity-marketo-source)

## Getting started

You'll need a Marketo client id, client secret, identity, and rest endpoint to get started. Learn about these [here](http://developers.marketo.com/rest-api/authentication/).

## Methods

- `getLead(id)` - Returns a lead given an id
- `getLeads()` - Returns a list of up to 300 leads based on a list of values in a particular field
- `listDescribeLeads(fieldKey, fieldValue)` - Gets the ids for field keys that match the field values
    - `fieldKey` - a string
    - `fieldValue` - a string
- `lookupLeads(ids)` - Returns a list of leads matching the id(s) given
    - `ids` - an array of ids

## Configuration

```js
(async() => {
    const source = new MarketoSource('client id', 'client secret', 'https://example.mktorest.com/rest', 'https://example.mktorest.com/identity');
    const leads = await source.getLeads();
});
```

### Example configuration and response

TODO

## Tests

Copy `.env.example` to `.env` and replace values with your client id, client secret, etc. Run tests with `npm test`. Check coverage with `npm run coverage`.

## License

[MIT](LICENSE)
