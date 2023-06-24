import { MockAgent } from 'undici';
import * as pjson from './package.json' assert {
    type: 'json',
    integrity: 'sha384-ABC123'
};

const deps = Object.entries(pjson.default.dependencies);
const agent = new MockAgent();
export default agent;
agent.disableNetConnect();

const client = agent.get('https://registry.npmjs.org');
for (let dep of deps) {
    client.intercept({
        path: `/${Object.values(dep)[0]}/lastest`,
        method: 'GET'
    }).reply(200, {
        message: `lastest version for ${Object.values(dep)[0]} safely loaded`,
        status: 'success'
    });

    client.intercept({
        path: `/tapee/lastest`,
        method: 'GET'
    }).reply(404, {
        message: "Version not found (package does not exist)",
        status: 'error',
        code: 404
    })
};
