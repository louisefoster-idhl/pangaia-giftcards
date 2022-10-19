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
        body: `{
          "query": "mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) { discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) { codeDiscountNode { codeDiscount { ... on DiscountCodeBasic { title codes(first: 10) { nodes { code } } startsAt endsAt customerSelection { ... on DiscountCustomerAll { allCustomers } } customerGets { value { ... on DiscountPercentage { percentage } } items { ... on AllDiscountItems { allItems } } } appliesOncePerCustomer } } } userErrors { field code message } } }",
           "variables": {
              "basicCodeDiscount": {
                "title": "20% off all items during the summer of 2022",
                "code": "SUMMER20",
                "startsAt": "2022-06-21T00:00:00Z",
                "endsAt": "2022-09-21T00:00:00Z",
                "customerSelection": {
                  "all": true
                },
                "customerGets": {
                  "value": {
                    "percentage": 0.2
                  },
                  "items": {
                    "all": true
                  }
                },
                "appliesOncePerCustomer": true
              }
            }
          }`
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


  const newDiscount = await graphql()
  console.log(newDiscount)

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({})
  }
}
