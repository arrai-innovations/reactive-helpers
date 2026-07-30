const token = process.env.CIRCLECI_TOKEN;

if (!token) {
    throw new Error("Set CIRCLECI_TOKEN to a CircleCI personal API token.");
}

const projectSlug = "gh/arrai-innovations/reactive-helpers";
const response = await fetch(`https://circleci.com/api/v2/project/${projectSlug}/pipeline`, {
    method: "POST",
    headers: {
        Accept: "application/json",
        "Circle-Token": token,
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        branch: "main",
        parameters: {
            "deploy-docs": true,
        },
    }),
});

const body = await response.text();
let result;

try {
    result = JSON.parse(body);
} catch {
    result = body;
}

if (!response.ok) {
    const detail = typeof result === "string" ? result : JSON.stringify(result);
    throw new Error(`CircleCI returned ${response.status}: ${detail}`);
}

console.log(`Triggered docs deployment pipeline ${result.number}.`);
console.log(`https://app.circleci.com/pipelines/github/arrai-innovations/reactive-helpers/${result.number}`);
