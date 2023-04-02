require("dotenv").config()
const path = require("path")
const express = require("express")
const {
  RecaptchaEnterpriseServiceClient
} = require("@google-cloud/recaptcha-enterprise")

const port = 3000
const app = express()

app.use(express.json())
app.set("view engine", "ejs")

/**
 * Create an assessment to analyze the risk of an UI action. Note that
 * this example does set error boundaries and returns `null` for
 * exceptions.
 *
 * projectID: GCloud Project ID
 * recaptchaSiteKey: Site key obtained by registering a domain/app to use recaptcha services.
 * token: The token obtained from the client on passing the recaptchaSiteKey.
 * recaptchaAction: Action name corresponding to the token.
 */
async function createAssessment({
  projectID,
  recaptchaSiteKey,
  token,
  recaptchaAction
}) {
  // Create the reCAPTCHA client & set the project path. There are multiple
  // ways to authenticate your client. For more information see:
  // https://cloud.google.com/docs/authentication
  // TODO: To avoid memory issues, move this client generation outside
  // of this example, and cache it (recommended) or call client.close()
  // before exiting this method.
  const client = new RecaptchaEnterpriseServiceClient()
  const projectPath = client.projectPath(projectID)

  // Build the assessment request.
  const request = {
    assessment: {
      event: {
        token: token,
        siteKey: recaptchaSiteKey
      }
    },
    parent: projectPath
  }
  // client.createAssessment() can return a Promise or take a Callback
  const [response] = await client.createAssessment(request)

  // Check if the token is valid.
  if (!response.tokenProperties.valid) {
    console.log(
      "The CreateAssessment call failed because the token was: " +
        response.tokenProperties.invalidReason
    )

    return null
  }

  // Check if the expected action was executed.
  // The `action` property is set by user client in the
  // grecaptcha.enterprise.execute() method.
  if (response.tokenProperties.action === recaptchaAction) {
    // Get the risk score and the reason(s).
    // For more information on interpreting the assessment,
    // see: https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment
    console.log("The reCAPTCHA score is: " + response.riskAnalysis.score)

    response.riskAnalysis.reasons.forEach((reason) => {
      console.log(reason)
    })
    return response.riskAnalysis.score
  } else {
    console.log(
      "The action attribute in your reCAPTCHA tag " +
        "does not match the action you are expecting to score"
    )
    return null
  }
}

app.post("/api/verify", async (req, res) => {
  try {
    /**
     * Set the path to the service account key JSON file.
     * This is used to authenticate your requests to the reCAPTCHA Enterprise API.
     */
    const creds = path.join(__dirname, "service_account_key.json")
    process.env.GOOGLE_APPLICATION_CREDENTIALS = creds

    const { token, action } = req.body
    const score = await createAssessment({
      projectID: process.env.PROJECT_ID,
      recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
      token,
      recaptchaAction: action
    })

    res.json({ score })
  } catch (error) {
    res.json({ error: error.message })
  }
})

app.get("/", (req, res) => {
  res.render("index", {
    recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
    recaptchaThreshold: process.env.RECAPTCHA_THRESHOLD
  })
})

app.listen(port, () => console.log(`App running on http://localhost:${port}/`))
