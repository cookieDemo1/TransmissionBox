
import x2js from 'x2js' //xml数据处理插件
const $x2js = new x2js()

export function XML2String(xmlDoc) {
  if (window.ActiveXObject !== undefined) {// for IE
    return xmlDoc.xml;
  } else { // for other browsers
    return (new XMLSerializer()).serializeToString(xmlDoc);
  }
}

export function XMLDOC2JSON(xmlDoc) {
  const xmlString = XML2String(xmlDoc)
  return $x2js.xml2js(xmlString);
}

export function XMLSTR2JSON(xmlStr) {
  return $x2js.xml2js(xmlStr);
}
