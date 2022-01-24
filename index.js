const core = require('@actions/core');
const github = require('@actions/github');

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

    console.log(data);

    const { stats, files } = data;

    /**
     * Contains the sum of all the additions, deletions, and changes
     * in all the files in the Pull Request.
     **/
    let diffData = {
      additions: stats.additions,
      deletions: stats.deletions,
      changes: stats.total,
    };

    /** Create a comment on the PR with the information we compiled from the
     * list of changed files.
     */
    await octokit.rest.repos.createCommitComment({
      owner,
      repo,
      commit_sha,
      body: `
        - Push date: ${new Date().toISOString()}
        - Push made by: ${push_user}
        - Commit message: ${commit_message}
        New commit with id: #${push_id}, it contained: \n
          - ${diffData.changes} changes \n
          - ${diffData.additions} additions \n
          - ${diffData.deletions} deletions \n
          - ${files.length} files edited \n
      `,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
};

// Call the main function to run the action
main();
