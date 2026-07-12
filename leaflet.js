                                r.stylePoint = r.stylePoint || r.stylepoint || r.style
                                if (r.stylePoint) {
                                    // eval("_style = {" + r.stylePoint + "}")
                                    _style = r.stylePoint.replace(/([\w\d\.]+)/g, '"$1"').replace(/"([\d\.]+)"/g, '$1');
                                    _style = JSON.parse(_style.replaceAll('#"', '"#'));
                                } else {
                                    _style = {}
                                    _style.weight = r.data[0].styleWeight||r.data[0].weight||'pivot'
                                    _style.color = r.data[0].styleColor||r.data[0].color||'red'
                                    _style.opacity = r.data[0].styleOpacity||r.data[0].opacity||0.5
                                }
                                if (typeof(_style.weight) == 'string' ) {
                                    if (_style.weight =='pivot') _style.weight = 'rowTotal'
                                    if (!spa.mapStyle.weightRG) spa.mapStyle.weightRG = _getMnMx(_style.weight, pivotRowData)
                                    _style.weight = (window.getR||_getR)(r[_style.weight], spa.mapStyle.weightRG[0], spa.mapStyle.weightRG[1])
                                }                                     
                                try {
                                    var ll = L.latLng(r.coordinates[1], r.coordinates[0])
                                }  catch (e) { 
                                    console.log('error in latlng') 
                                }
                                var newUDF = L.circle(ll, { ...spa.leaflet.layout['Point'], ..._style }).addTo(spa['mpid']);