# aries-activity-marketo-source (In Progress)
Aries activity for [Marketo](https://developers.marketo.com/)

[![CircleCI](https://circleci.com/gh/aries-data/aries-activity-marketo-source.svg?style=svg)](https://circleci.com/gh/aries-data/aries-activity-marketo-source)

## Getting started

You'll need a Marketo client id, client secret, identity, and rest endpoint to get started. Learn about these [here](http://developers.marketo.com/rest-api/authentication/).

## Methods

This integration uses x methods:

- `getStaticList({ listId, fields })` - Returns the static list filtered by the given params
    - `listId` - a number
    - `fields` - a string with fields separated by comma
- `listDescribeLeads({ fieldKey, fieldValue })` - Gets a list of ids for field keys that match the field values
    - `fieldKey` - a string
    - `fieldValue` - a string
- `lookupLeads({ fieldKey, fieldValue, nextPageToken = null })` - Returns a list of leads matching the id(s) given
    - `nextPageToken` - a string and the token for the next page of leads (null by default)

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
