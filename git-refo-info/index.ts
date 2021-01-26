import * as cp from 'child_process';

export default function getRepoInfo() {
  try {
    const cwd = process.cwd();
    const execConfig: { encoding: 'utf8', cwd: string } = { encoding: 'utf8', cwd };

    //获取格式化后的git信息；
    const detailString = cp.execSync(`git show --format='%H%n%h%n%cn%n%cI%n%an%n%aI%n%s' -q --encoding=UTF-8`, execConfig);
    const [sha, abbreviatedSha, committer, committerDate, author, authorDate, commitMessage] = detailString.split('\n');
    
    //获取当前的branch；
    const branch = cp.execSync('git symbolic-ref --short HEAD', execConfig).trim();
    
    //获取git tags
    const tagString = cp.execSync('git describe --tags --long --always', execConfig).trim();
    const [, lastTag, commitsSinceLastTag] = /^(.*)-(\d+)-\w+$/.exec(tagString) || [null, null, Infinity];

    return {
      branch,
      sha,
      abbreviatedSha,
      tag: +commitsSinceLastTag === 0 ? lastTag as string : null,
      lastTag: lastTag as string,
      commitsSinceLastTag: +commitsSinceLastTag,
      committer,
      committerDate,
      author,
      authorDate,
      commitMessage,
    };
  } catch(err) {
    return null;
  }
}