# Load environment variables from .env file
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

# Download the OpenAPI specification using the GitHub API
# curl -H "Authorization: token ${GITHUB_TOKEN}" -H "Accept: application/vnd.github.v3.raw" -o deployo-merged.swagger.json https://api.github.com/repos/deployo-ai/deployo-monorepo/contents/openapi/deployo-merged.swagger.json

# Clean up the previous API and models directories
export MSYS_NO_PATHCONV=1
rm -rf api
find models -type f -not -name 'protobuf-any.ts' -delete

# Run the OpenAPI generator
docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli:v7.8.0 generate -i /local/deployo-merged.swagger.json -g typescript-axios -o /local -c /local/tools/config.json
