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

  const createDiscount = {
    "query": `mutation {
      discountCodeBasicCreate(basicCodeDiscount: {
        title: "Code discount basic test",
        startsAt: "2022-01-01",
        endsAt: "2023-01-01",
        usageLimit: 10,
        appliesOncePerCustomer: true,
        customerSelection: {
          all: true
        }
        code: "TESTCODE1234",
        customerGets: {
          value: {
            discountAmount:  {
              amount: 1.00,
              appliesOnEachItem: true
            }
          }
          items: {
            products: {
              productsToAdd: ["gid://shopify/Product/5591484858390"]
            }
          }
        }}) {
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
  }


  const newDiscount = await graphql(createDiscount)
  console.log(newDiscount)

  // await put(`customers/${data.customer}.json`, {
  //   customer: { id: data.customer, tags: tags.join(',') }
  // })

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({})
  }
}
