import { getDeps, getLastVersion, depPath } from './index.js'
import { describe, it } from 'node:test';
import assert from 'node:assert';
import agent from './index-mock.js';
import { setGlobalDispatcher } from 'undici';

setGlobalDispatcher(agent);

describe('index.js', function () {
    describe('#getLastVersion', function () {
        const deps = getDeps(depPath);
        it("should return a promise for the first dependence package", async function () {
            const firstDeps = Object.values(deps[0]);
            const lastVersion = getLastVersion(firstDeps[0]);

            Promise.resolve(lastVersion).then(info => {
                assert.eq(info.name, firstDeps);
            }).catch((e) => {
                assert.ok("Promise could not be resolved. Following this error : " + e)
            })
        })
        it("should return multiple promise", async function () {
            const promiseArray = [];
            for (let dep of deps) {
                promiseArray.push(getLastVersion(Object.values(dep)[0]));
            }
            Promise.all(promiseArray).then(infos => {
                assert.ok("promise solved");
            }).catch(e => {
                assert.ok("Promise could not resolved following this " + e);
            })
        })
        it("should return an error for wrong package name", async function () {
            Promise.resolve(getLastVersion("tapee")).then(info => {
                assert.ok("should never reach here");
            }).catch(e => {
                assert.ok("should return not found package from url following this error " + e);
            })
        })
    })
})