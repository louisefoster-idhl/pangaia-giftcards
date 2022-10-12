import fetch from 'node-fetch'

const apiKey = process.env.API_KEY || ''
const storeUrl = process.env.STORE_URL
const apiVersion = process.env.API_VERSION

exports.handler = async (event, context) => {
  const data = JSON.parse(event.body)

  const graphql = async gql => {
    const res = await fetch(
      `https://${storeUrl}/admin/api/${apiVersion}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/graphql',
          'X-Shopify-Access-Token': apiKey
        },
        body: gql
      }
    )
    return await res.json()
  }
  const put = async (endpoint, data) => {
    const res = await fetch(
      `https://${storeUrl}/admin/api/${apiVersion}/${endpoint}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': apiKey
        },
        body: JSON.stringify(data)
      }
    )
    return await res.json()
  }

  console.log(data)

  const priceRuleQuery = `query GetPriceRule($id: ID!) {
    priceRule(id: $id) {
      id
      title
      status
    }
  }`

  const priceRule = await graphql(priceRuleQuery)
  console.log(priceRule)

  await put(`customers/${data.customer}.json`, {
    customer: { id: data.customer, tags: tags.join(',') }
  })

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({})
  }
}
