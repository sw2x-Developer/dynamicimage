import React, { useEffect, useState } from 'react'
import isDev from './helper'
import Skeleton from 'react-loading-skeleton'

const Img = (props: any) => {
  const [Status, setStatus] = useState('loading')
  const [stylle, setstylle] = useState({})

  function isURL(str: any) {
    var urlRegex =
      '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$'
    var url = new RegExp(urlRegex, 'i')
    return str.length < 2083 && url.test(str)
  }

  useEffect(() => {
    let { src } = props
    if (src || (src && props.style)) {
      setStatus('loading')
      console.log(isURL(src))
      if (isDev()) {
        if (isURL(src)) {
          loadall(src)
          setInterval(() => {
            setStatus('loaded')
          }, 2000)
        } else {
          try {
            let urlElements = window.location.href.split('/')[2]
            import(`../src/${src}`).then((image) => {
              loadall(`//${urlElements}${image.default}`)
              setInterval(() => {
                setStatus('loaded')
              }, 2000)
            })
          } catch (err) {
            console.log(err)
            setStatus('error')
          }
        }
      } else {
        console.log('Not for production yet')
      }
    }
  }, [props])

  let cssStyle = {}

  let { src, style, height, width, ...other } = props
  const loadall = (loc: any) => {
    let url = loc
    if (Status === 'error') {
      url = 'https://www.freeiconspng.com/uploads/x-png-33.png'
    }
    console.log(url)

    const bgImage = `url(${url})`
    cssStyle['backgroundImage'] = bgImage
    cssStyle['backgroundPosition'] = 'center center'
    cssStyle['backgroundRepeat'] = 'no-repeat'
    cssStyle['backgroundSize'] = 'cover'
    cssStyle['display'] = 'block'
    cssStyle['height'] = height || '250px'
    cssStyle['width'] = width || '250px'
    console.log(cssStyle)
    setstylle(Object.assign(cssStyle, style))
  }

  return (
    <div>
      {Status === 'loading' ? (
        <Skeleton width={width || '250px'} height={height || '250px'} />
      ) : Status === 'error' ? (
        <h1>Test</h1>
      ) : (
        <div style={stylle} {...other}></div>
      )}
    </div>
  )
}

export default Img
