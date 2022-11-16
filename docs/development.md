# Development

## Provider account setup

A free trial of Aquasec can be set up
[`here`](https://cloud.aquasec.com/signup).

Upon creation of an account, navigate to the
[`API Keys`](https://cloud.aquasec.com/cspm/#/apikeys) section and click
Generate Key. Make note of your API key and secret. Note that the secret will
only be displayed once.

Open the development console of your browser and navigate to the
**_Application->Local Storage_** area. Make note of the `account_id` value.

## Configure your .env

Using the above values you noted down, provide the following three items in a
.env file in the root directory of this project:

```ini
API_KEY=
API_SECRET=
ACCOUNT_ID=
ACCOUNT_EMAIL=
ACCOUNT_PASSWORD=
```

## Authentication

Details of Aquasec's API authorization strategy can be found
[`here`](https://cloudsploit.docs.apiary.io/#introduction/signature-creation).
