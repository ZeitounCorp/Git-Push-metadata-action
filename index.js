const core = require('@actions/core');
const github = require('@actions/github');
const moment = require('moment');

const main = async () => {
  try {
    /**
     * We need to fetch all the inputs that were provided to our action
     * and store them in variables for us to use.
     **/
    const owner = core.getInput('owner');
    const repo = core.getInput('repo');
    const token = core.getInput('token');
    const push_user = core.getInput('push_user');
    const push_id = core.getInput('push_id');
    const commit_sha = core.getInput('commit_sha');
    const commit_message = core.getInput('commit_message');
    const ref = core.getInput('ref');

    /**
     * Now we need to create an instance of Octokit which will use to call
     * GitHub's REST API endpoints.
     * We will pass the token as an argument to the constructor. This token
     * will be used to authenticate our requests.
     * You can find all the information about how to use Octokit here:
     * https://octokit.github.io/rest.js/v18
     **/
    const octokit = new github.getOctokit(token);

    const { data } = await octokit.rest.repos.getCommit({
      owner,
      repo,
      ref,
    });

    const { stats, files } = data;

    /**
     * Contains the sum of all the additions, deletions, and changes
     * in all the files in the push commit.
     **/
    let diffData = {
      additions: stats.additions,
      deletions: stats.deletions,
      changes: stats.total,
    };

    /**
     * Extract the file names from the files array.
     * We will use this array to create a list of files that were
     * changed in the push commit.
     **/
    const fileNames = files.map((file) => file.filename);

    /** Create a comment on the commit with the information we compiled from the
     * list of changed files.
     */
    await octokit.rest.repos.createCommitComment({
      owner,
      repo,
      commit_sha,
      body: `
        - Push date: ${moment().format('MMMM Do YYYY, h:mm:ss a')}
        - Push made by: ${push_user}
        - Commit message: ${commit_message.split('\n').join(', ')}
        New commit with id: #${push_id}, it contained:
          - ${diffData.changes} changes
          - ${diffData.additions} additions
          - ${diffData.deletions} deletions
          - ${files.length} files edited
        Files modified:
          ${fileNames.map((file) => `- ${file}`)}
      `,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
};

// Call the main function to run the action
main();
