export function buildRoutePath(path) {

    const getRouteParameterName = /:([a-zA-Z]+)/g
    const pathWithParams = path.replaceAll(getRouteParameterName, '(?<$1>[a-z0-9\-_]+)')

    const pathRegex = new RegExp(`^${pathWithParams}`)

    return pathRegex
}