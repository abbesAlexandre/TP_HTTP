import { fetch } from 'undici'
import * as semver from 'semver'
import * as pjson from './package.json' assert {
  type: 'json',
  integrity: 'sha384-ABC123'
};

export function getDeps(depPath) {
  return Object.entries(depPath);
}

export async function getLastVersion(depName) {
  let res = await fetch(`https://registry.npmjs.org/${depName}/latest`);
  return res.json();
}

function isInRange(version, localVersion) {
  const range = semver.validRange(localVersion);
  if (range != null) {
    return semver.satisfies(version, range);
  } else {
    return null;
  }
}
export const depPath = pjson.default.dependencies;
const depArray = getDeps(depPath);
let versionArray = [];
const mapDependencies = new Map();

for (let dep of depArray) {
  mapDependencies.set(Object.values(dep)[0], Object.values(dep)[1]);
  versionArray.push(getLastVersion(Object.values(dep)[0]));
}
Promise.all(versionArray).then(infos => {
  for (let info of infos) {
    const version = info.version;
    const localVersion = mapDependencies.get(info.name);
    const packageName = info.name;
    let formatedVersion = localVersion.replace('^', '');
    formatedVersion = formatedVersion.replace('~', '');
    if (isInRange(version, localVersion) === false) {
      if (semver.major(version) > semver.major(formatedVersion)) {
        console.log(packageName + ' update major');
      } else if (semver.minor(version) > semver.minor(formatedVersion)) {
        console.log(packageName + ' update minor');
      } else {
        console.log(packageName + ' update patch');
      }
    }
  }
}).catch((error) => {
  throw new Error(`une erreur est survenu lors de la récupération des versions des packages, 
  error message => ${error}`);
});

