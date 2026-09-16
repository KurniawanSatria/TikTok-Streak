> [!WARNING]
> **This TikTok Streak Bot is illegal. Use it at your own risk.**
>
> This project is provided for educational and experimental purposes only. By using this bot, you acknowledge that you are responsible for your own actions and any consequences that may result from its use.
>
> **You have been warned.**

# TikTok Streak Bot

<img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/67aef3dc-6cc5-48d8-8d3c-f8a40d999ac2" />

An automated TikTok streak bot that sends messages to TikTok conversations using **GitHub Actions**.

It runs entirely in the cloud, so you don't need to keep your PC running.

## Features

* 🔐 Login using TikTok session cookies
* 💬 Automatically send messages to multiple conversations
* ⚙️ Configurable through `config.json`
* ⏰ Automatically runs on a cron schedule
* ▶️ Can be triggered manually at any time
* ☁️ Runs on GitHub Actions without requiring a local machine

## Setup

### 1. Fork or Clone the Repository

Fork this repository to your GitHub account, or clone it locally and push it to your own repository.

> **Note:** A public repository is supported because sensitive TikTok cookies are stored securely as GitHub Actions Secrets.

### 2. Configure `COOKIES_JSON`

The bot requires TikTok session cookies to authenticate.

**Never put your cookies directly inside the source code or commit them to the repository.**

Instead, store them as a GitHub Actions Secret.

#### Export your TikTok cookies

Use a browser cookie-export extension such as EditThisCookie or another compatible cookie exporter.

The exported data should look similar to:

```json
[
  {
    "name": "sessionid",
    "value": "xxx",
    "domain": ".tiktok.com"
  }
]
```

#### Add the cookies to GitHub Secrets

1. Open your GitHub repository.
2. Go to **Settings → Secrets and variables → Actions**.
3. Click **New repository secret**.
4. Set the following:

   * **Name:** `COOKIES_JSON`
   * **Secret:** Your exported TikTok cookies in JSON format.
5. Save the secret.

For convenience, the JSON can be compressed into a single line before being pasted.

> [!CAUTION]
> **Treat your TikTok cookies like a password.**
>
> Anyone who obtains valid session cookies may potentially access your TikTok session. Never publish them, commit them to Git, or share them with anyone.

### 3. Configure the Bot

Edit `config.json` in the root directory according to your needs.

Example:

```json
{
  "message": "Auto Streak",
  "totalUsers": 13,
  "actionDelayMs": 300,
  "headless": true
}
```

### Configuration Options

| Key                 | Description                                              | Default                                   |
| ------------------- | -------------------------------------------------------- | ----------------------------------------- |
| `message`           | Message sent to each conversation                        | `"Auto Streak"`                           |
| `totalUsers`        | Number of conversations to process                       | `13`                                      |
| `actionDelayMs`     | Delay between conversations in milliseconds              | `300`                                     |
| `typeDelayMs`       | Delay between each typed character in milliseconds       | `0`                                       |
| `afterSendDelayMs`  | Delay after sending a message in milliseconds            | `500`                                     |
| `afterClickDelayMs` | Delay after clicking an element in milliseconds          | `300`                                     |
| `pageLoadDelayMs`   | Delay while waiting for the page to load in milliseconds | `5000`                                    |
| `finishDelayMs`     | Delay before closing the browser in milliseconds         | `3000`                                    |
| `headless`          | Run Chromium in headless mode                            | `true`                                    |
| `bannerFont`        | Figlet banner font                                       | `"DOS Rebel"`                             |
| `targetUrl`         | TikTok messaging URL                                     | `https://www.tiktok.com/messages?lang=en` |

## Running the Bot

### Automatic Schedule

The GitHub Actions workflow is configured to run automatically at:

* **22:00 WIB** → `15:00 UTC`
* **00:00 WIB** → `17:00 UTC`

Example:

```yaml
cron: "0 15 * * *" # 22:00 WIB
cron: "0 17 * * *" # 00:00 WIB
```

To change the schedule, edit:

```text
.github/workflows/TikTok-Streak.yml
```

### Manual Workflow Dispatch

You can also run the bot manually whenever you want.

1. Open your GitHub repository.
2. Go to **Actions**.
3. Select **TikTok Streak**.
4. Click **Run workflow**.
5. Click **Run workflow** again to start the job.

The workflow output can be monitored in real time from the **Actions** tab.

## How It Works

The bot runs through the following process:

1. GitHub Actions checks out the repository.
2. Required dependencies are installed.
3. The `COOKIES_JSON` secret is injected into the workflow environment.
4. Puppeteer launches Chromium.
5. TikTok session cookies are loaded into the browser.
6. The bot opens the TikTok messaging page.
7. Messages are sent to the configured conversations.
8. Success and failure information is displayed in the GitHub Actions logs.
9. The browser closes after the workflow finishes.

## Troubleshooting

### Cookies Expired

TikTok session cookies may expire.

If the bot can no longer authenticate:

1. Export fresh cookies from your browser.
2. Replace the existing `COOKIES_JSON` GitHub Secret.
3. Run the workflow again.

### TikTok UI Changes

TikTok may change its website structure or UI over time.

If the bot stops finding elements, the CSS selectors used by the bot may need to be updated.

Check:

```text
index.js
```

and update the affected selectors accordingly.

### Workflow Fails

Check the workflow logs under:

**GitHub → Actions → TikTok Streak**

The logs should indicate which step failed.

## Runner

The workflow currently uses:

```yaml
runs-on: windows-latest
```

The Windows runner is used to provide a stable environment for the bundled Chromium/Puppeteer setup.

## Disclaimer

This project is **not affiliated with, endorsed by, or sponsored by TikTok**.

The repository owner provides this project as-is and does not take responsibility for how it is used.

Users are responsible for understanding and accepting any risks, restrictions, consequences, or rules that may apply to their use of the bot.

> **Use responsibly. You've been warned.**
