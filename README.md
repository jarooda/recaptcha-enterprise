# recaptcha-enterprise

This is a demo application that shows how to use Recaptcha Enterprise with Node.js to protect your website from spam and abuse.

## Prerequisites

- Node.js installed on your machine
- A Google Cloud project with Recaptcha Enterprise API enabled
- Recaptcha Enterprise API key
- Service Account Key in `.json` format with reCAPTCHA Enterprise Agent role

## Installation

1. Clone the repository:

```bash
git clone https://github.com/jarooda/recaptcha-enterprise.git
```

2. Install dependencies:

```bash
cd recaptcha-enterprise
npm install
```

3. Create a .env file and set your Recaptcha Enterprise API key and secret key:

```bash
RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_THRESHOLD=your_recaptcha_threshold
PROJECT_ID=your_project_id
```

4. Copy Service Account Key file and paste in the same directory as `index.js`, rename it to `service_account_key.json`

## Usage

1. Start the server:

```bash
npm start
```

2. Open your browser and go to http://localhost:3000.

3. You should see a single button. Click it to get the score.

4. If the Recaptcha challenge is successful, it will show green ribbon. If the challenge fails, it will show red ribbon and the button is disabled.

## Notes

- This demo uses the @google-cloud/recaptchaenterprise package to interact with Recaptcha Enterprise API.
- The demo includes a simple Express.js server and a HTML templates to illustrate how to integrate Recaptcha Enterprise with your website.
- This is a demo and not intended for production use. Please make sure to follow best practices and guidelines when implementing Recaptcha Enterprise in your production environment.
- For more information, refer to [reCAPTCHA Enterprise ](https://cloud.google.com/recaptcha-enterprise/docs/create-assessment) docs.

## License

This demo is licensed under the MIT license. See LICENSE file for more details.
