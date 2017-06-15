# aries-activity-marketo-source
Aries activity for [Marketo](https://developers.marketo.com/)

[![CircleCI](https://circleci.com/gh/aries-data/aries-activity-marketo-source.svg?style=svg)](https://circleci.com/gh/aries-data/aries-activity-marketo-source)

## Getting started

You'll need a Marketo client id, client secret, identity endpoint, and rest endpoint to get started. Learn about these [here](http://developers.marketo.com/rest-api/authentication/).

## Methods

This integration uses 1 method:

- `getStaticList({ listId, fields, nextPageToken = null })` - Returns the static list filtered by the given fields
    - `listId` - a number
    - `fields` - a string with fields separated by comma
    - `nextPageToken` - a string and the token for the next page of leads (null by default)

## Configuration

As noted in the getting started section, you'll need a client id, client secret, identity endpoint, and rest endpoint for your configuration. You can get these credentials by following [this Marketo documentation](http://developers.marketo.com/rest-api/authentication/). An example configuration can be found in `.env.example`.

## Example

Example call to get the fields `firstName`, `lastName`, `id`, and `company` from a static list with id `57777`:

```js
(async() => {
    const source = new MarketoSource('client_id', 'client_secret', 'https://example.mktorest.com/rest', 'https://example.mktorest.com/identity');
    const result = await source.getStaticList({ listId: '57777', fields: 'firstName,lastName,id,company' });
});
```
And example response for the call:

```json
[
  {
    "id": 1726852,
    "firstName": "John",
    "lastName": "Doe",
    "company": "John Doe, Inc."
  },
  {
    "id": 8989321,
    "firstName": "Johnny",
    "lastName": "Appleseed",
    "company": "Findlay Market"
  }
]
```


## Tests

Copy `.env.example` to `.env` and replace values with your client id, client secret, etc. Run tests with `npm test`. Check coverage with `npm run coverage`.

## License

[MIT](LICENSE)
