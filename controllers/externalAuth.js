const https = require('https')
const http = require('http')
const { URL } = require('url')

const EXTERNAL_BASE = 'https://urja-ops.flockenergy.tech'
const EXTERNAL_LOGIN_URL = `${EXTERNAL_BASE}/login`
const EXTERNAL_METER_SEARCH_URL = `${EXTERNAL_BASE}/portal/meters/search`

const httpRequest = ({ url, method = 'GET', headers = {}, body = null }) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url)
    const client = parsedUrl.protocol === 'https:' ? https : http
    const requestOptions = {
      method,
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: `${parsedUrl.pathname}${parsedUrl.search}`,
      headers,
    }

    const request = client.request(requestOptions, (response) => {
      const chunks = []
      response.on('data', (chunk) => chunks.push(chunk))
      response.on('end', () => {
        const rawBody = Buffer.concat(chunks).toString('utf-8')
        const result = {
          statusCode: response.statusCode,
          headers: response.headers,
          body: rawBody,
          ok: response.statusCode >= 200 && response.statusCode < 300,
        }
        resolve(result)
      })
    })

    request.on('error', reject)

    if (body) {
      request.write(body)
    }

    request.end()
  })
}

const parseResponseBody = (response) => {
  const contentType = response.headers['content-type'] || ''
  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(response.body)
    } catch (error) {
      return { raw: response.body }
    }
  }
  return { raw: response.body }
}

const loginPortal = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'email and password are required' })
    }

    const payload = JSON.stringify({ email, password })
    const response = await httpRequest({
      url: EXTERNAL_LOGIN_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
      body: payload,
    })

    const cookies = response.headers['set-cookie'] || []
    const data = parseResponseBody(response)

    return res.status(response.statusCode || 500).json({
      success: response.ok,
      status: response.statusCode,
      message: response.ok ? 'Login portal request completed' : 'Login portal request failed',
      data,
      cookies,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'External login failed', error: error.message })
  }
}

const searchMeters = async (req, res) => {
  try {
    const { q = '', page = '1' } = req.query
    const cookieHeader = req.headers.cookie || req.headers['x-cookies'] || req.query.cookies

    if (!cookieHeader) {
      return res.status(400).json({
        success: false,
        message: 'Cookies are required to access the secured meter search endpoint. Use the login endpoint first.',
      })
    }

    const url = `${EXTERNAL_METER_SEARCH_URL}?q=${encodeURIComponent(q)}&page=${encodeURIComponent(page)}`
    const response = await httpRequest({
      url,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        Cookie: cookieHeader,
      },
    })

    const data = parseResponseBody(response)
    return res.status(response.statusCode || 500).json({
      success: response.ok,
      status: response.statusCode,
      message: response.ok ? 'Meter search completed' : 'Meter search failed',
      data,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Meter search failed', error: error.message })
  }
}

const getMeterGeo = async (req, res) => {
  try {
    const { meterId } = req.params
    const cookieHeader = req.headers.cookie || req.headers['x-cookies'] || req.query.cookies

    if (!cookieHeader) {
      return res.status(400).json({
        success: false,
        message: 'Cookies are required to access this endpoint. Use the login endpoint first.',
      })
    }

    const url = `${EXTERNAL_BASE}/portal/meters/${encodeURIComponent(meterId)}/geo`
    const response = await httpRequest({
      url,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Cookie: cookieHeader,
      },
    })

    const data = parseResponseBody(response)
    return res.status(response.statusCode || 500).json({
      success: response.ok,
      status: response.statusCode,
      message: response.ok ? 'Meter geo fetched successfully' : 'Meter geo request failed',
      data,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Meter geo fetch failed', error: error.message })
  }
}

const getMeterEnergy = async (req, res) => {
  try {
    const { meterId } = req.params
    const cookieHeader = req.headers.cookie || req.headers['x-cookies'] || req.query.cookies

    if (!cookieHeader) {
      return res.status(400).json({
        success: false,
        message: 'Cookies are required to access this endpoint. Use the login endpoint first.',
      })
    }

    const url = `${EXTERNAL_BASE}/portal/meters/${encodeURIComponent(meterId)}/energy`
    const response = await httpRequest({
      url,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Cookie: cookieHeader,
      },
    })

    const data = parseResponseBody(response)
    return res.status(response.statusCode || 500).json({
      success: response.ok,
      status: response.statusCode,
      message: response.ok ? 'Meter energy fetched successfully' : 'Meter energy request failed',
      data,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Meter energy fetch failed', error: error.message })
  }
}

module.exports = { loginPortal, searchMeters, getMeterGeo, getMeterEnergy }
