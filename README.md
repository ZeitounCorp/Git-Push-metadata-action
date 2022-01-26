# Git-Push-metadata-action

> Github action that should execute when a new push happens on a repository, should alert the maintainer by mail with the number of files modified, number of modifications, full date (DD/MM/YYYY @ time) and the commit message

## How to use it

- Open an existing repository or create a new one
- Add the action to your workflow (inside `.github/workflows/`)
- Create the GitHub Secrets required for running the action (`Settings > Secrets > Actions > New repository secret`)
- Enjoy detailed notifications on your repository when a new push happens !

## Action configuration file (.yaml)

```yml
name: Git commit metadata annotation

on: push

jobs:
  annotate-pr:
    runs-on: ubuntu-latest
    name: Annotates commits with metadata
    steps:
      # - uses: hmarr/debug-action@v2 uncomment to debug
      - name: Annotate Commit
        uses: ZeitounCorp/Git-Push-metadata-action@main
        with:
          owner: ${{ github.repository_owner }} # Owner of the repository
          repo: ${{ github.event.repository.name }} # Name of the repository where the push happened
          push_user: ${{ github.event.sender.login }} # User who pushed
          commit_sha: ${{ github.event.after }} # SHA of the commit
          ref: ${{ github.event.ref }} # Reference id of the commit
          commit_message: ${{ github.event.commits[0].message }} # Commit message
          push_id: ${{ github.event.commits[0].id }} # Commit id
          token: ${{ secrets.GITHUB_TOKEN }}
          receivers: ${{ secrets.LIST_OF_RECEIVERS }} # List of receivers, it's a secret
          mailer_password: ${{ secrets.MAILER_PASSWORD }} # Mailer password, it's a secret
          mailer_sender: ${{ secrets.MAILER_SENDER }} # Mailer sender, it's a secret
          nodemailer_host: ${{ secrets.NODEMAILER_HOST }} # Mailer host (host from your mail provider), it's a secret
          nodemailer_port: ${{ secrets.NODEMAILER_PORT }} # Mailer port (465 for ssl, comes from your mail provider), it's a secret
```

## Secrets

> **General secrets**

- `GITHUB_TOKEN`: Github Personal access token. you can generate one [here](https://github.com/settings/tokens) (**required**)
- `LIST_OF_RECEIVERS`: List of receivers separated by a comma (egc: `test@tester.com,john@seed.com`) (**required**)

> **Mailer secrets** look at the [nodemailer](https://nodemailer.com/about/) documentation for more information

- `MAILER_PASSWORD`: Mailer password, in order to use the mailing functionnality, you need to have a mailer account on your mail provider (gmail, hotmail, personnal mail server, etc...) (**required**)
- `MAILER_SENDER`: email address, in order to use the mailing functionnality, you need to have a mailer account on your mail provider (gmail, hotmail, personnal mail server, etc...) (**required**)
- `NODEMAILER_HOST`: Mailer host (host from your mail provider, egc: For OVH: ssl0.ovh.net) (**required**)
- `NODEMAILER_PORT`: Mailer port (465 for ssl, comes from your mail provider) (**required**)

**Enjoy ! Made with 🖤 by [@ZeitounCorp](https://github.com/ZeitounCorp)**
