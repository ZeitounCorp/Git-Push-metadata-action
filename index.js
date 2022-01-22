const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {
  try {
    /**
     * We need to fetch all the inputs that were provided to our action
     * and store them in variables for us to use.
     **/
    const owner = core.getInput('owner', { required: true });
    const repo = core.getInput('repo', { required: true });
    const token = core.getInput('token', { required: true });
    const push_user = core.getInput('push_user', { required: false });
    const commit_number = core.getInput('commit_number', { required: false });
    const push_id = core.getInput('push_id', { required: false });
    const commit_sha = core.getInput('commit_sha', { required: false });

    /**
     * Now we need to create an instance of Octokit which will use to call
     * GitHub's REST API endpoints.
     * We will pass the token as an argument to the constructor. This token
     * will be used to authenticate our requests.
     * You can find all the information about how to use Octokit here:
     * https://octokit.github.io/rest.js/v18
     **/
    const octokit = new github.getOctokit(token);

    /**
     * We need to fetch the list of files that were changes in the Pull Request
     * and store them in a variable.
     * We use octokit.paginate() to automatically loop over all the pages of the
     * results.
     * Reference: https://octokit.github.io/rest.js/v18#pulls-list-files
     */
    const { data: changedFiles } = await octokit.rest.git.getCommit({
      owner,
      repo,
      commit_sha,
    });

    console.log(changedFiles);

    /**
     * Contains the sum of all the additions, deletions, and changes
     * in all the files in the Pull Request.
     **/
    let diffData = {
      additions: 0,
      deletions: 0,
      changes: 0,
    };

    // Reference for how to use Array.reduce():
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
    diffData = changedFiles.reduce((acc, file) => {
      acc.additions += file.additions;
      acc.deletions += file.deletions;
      acc.changes += file.changes;
      return acc;
    }, diffData);

    /**
     * Create a comment on the PR with the information we compiled from the
     * list of changed files.
     */
    await octokit.rest.repos.createCommitComment({
      owner,
      repo,
      commit_sha,
      body: `
        - Push date: ${new Date().toISOString()}
        - Push made by: ${push_user}
        New commit #${push_id} it contained: \n
        - ${diffData.changes} changes \n
        - ${diffData.additions} additions \n
        - ${diffData.deletions} deletions \n
        - ${changedFiles.length} files edited \n
      `,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
};

// Call the main function to run the action
main();
