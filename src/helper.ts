export function getHostName()
{
  if (window.location !== undefined)
  {
    return window.location.hostname;
  }
  return undefined;
}

export function decodeURI(value: string)
{
  return decodeURIComponent(value.replace(/\+/g, " "));
}

export function getQueryString(parameter: string)
{
  const keyValues = location.search.substring(1).split('&');
  for (const keys of keyValues)
  {
    const key = keys.split('=');
    if (key.length > 1)
    {
      if (parameter.toLowerCase() === decodeURI(key[0]).toLowerCase())
      {
        return decodeURI(key[1]);
      }
    }
  }

  return undefined;
}

export function confirmDialog(message: string)
{
  return window.confirm(message);
}

export function alertDialog(message?: string)
{
  window.alert(message);
}

export function openURL(url: string)
{
  return window.open(url);
}

export function closeApplication()
{
  window.close();
}

export function getInnerWidth()
{
  return window.innerWidth;
}

export function getInnerHeight()
{
  return window.innerHeight;
}
