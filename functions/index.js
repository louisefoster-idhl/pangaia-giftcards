import fetch from 'node-fetch'

const accessToken = process.env.API_KEY || ''
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
          'X-Shopify-Access-Token': accessToken
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

  const discountMutation = `mutation {
    discountCodeBasicCreate(basicCodeDiscount: {
      title: "Test",
      code: "TEST1",
      startsAt: "2022-06-21T00:00:00Z",
      endsAt: "2022-12-21T00:00:00Z",
      customerSelection: {
        all: true
      },
      customerGets: {
        value: {
          amount: 25
        },
        items: {
          all: true
        }
      },
      appliesOncePerCustomer: true
      }) {
      userErrors { field message code }
      codeDiscountNode {
        id
          codeDiscount {
          ... on DiscountCodeBasic {
            title
            summary
            status
            codes (first:10) {
              edges {
                node {
                  code
                }
              }
            }
          }
        }
      }
    }
  }`

  const createDiscountCode = await graphql(discountMutation)
  console.log(createDiscountCode)

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({})
  }
}
