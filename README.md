#LDC Via Blog

This is a simple node.js blog application that makes use of [LDC Via](http://ldcvia.com) for back-end storage.

We assume that you run Google Apps For Your Domain, so all authentication is handled by Google. You can change this relatively easily by adding another Passport strategy that matches your needs.

The easiest way to deploy this is to a Heroku dyno. You will need to set four environment variables:

* GOOGLE_APPS_DOMAIN is the Google apps domain name (e.g. ldcvia.com) that users will authenticate against. Blog readers do not need to authenticate
* GOOGLE_CLIENT_ID which can be set / accessed from [Google Developers Console](https://console.developers.google.com/) where you will need to create a new project
* GOOGLE_CLIENT_SECRET which can be set / accessed from [Google Developers Console](https://console.developers.google.com/) where you will need to create a new project
* PUBLICAPIKEY which can be accessed from your [LDC Via Profile](https://eu.ldcvia.com/account/)
