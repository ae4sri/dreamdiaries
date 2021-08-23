const tokenExtractor = (request: any, _response: any, next: any) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      request.token = authorization.substring(7)
    } else {
      request.token = null
    }
  
    next()
    return request.token
  }
  
  
  module.exports = {
    tokenExtractor
  }