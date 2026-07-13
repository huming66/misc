        function _parseCoordinates(v) {                 //15                    // 部分数据源(SQL/CSV)把 coordinates 序列化成了 JSON 字符串
            if (typeof v !== 'string') return v
            try { return JSON.parse(v) } catch (e) { return v }
        }
        function _isolineColor(v, mn, mx) {                                 // 蓝(低) -> 红(高) 色相插值
            let t = mx > mn ? (v - mn) / (mx - mn) : 0.5
            return 'hsl(' + Math.round(240 - 240 * t) + ', 80%, 45%)'
        }
        function _drawIsolines(rows, valAttr) {
            try {
                let pts = rows.filter(r => Array.isArray(r.coordinates) && typeof r.rowTotal == 'number')
                    .map(r => turf.point(r.coordinates, { value: r.rowTotal }))
                if (pts.length < 3) return
                let values = pts.map(p => p.properties.value)
                let mn = Math.min(...values), mx = Math.max(...values)
                let nBands = spa.isolineBreaks || 9
                let breaks = Array.from({ length: nBands + 1 }, (_, i) => mn + (mx - mn) * i / nBands)
                let breaksProperties = Array.from({ length: nBands }, (_, i) => ({ fill: _isolineColor(mn + (mx - mn) * (i + 0.5) / nBands, mn, mx) }))
                let grid = turf.interpolate(turf.featureCollection(pts), spa.isolineCellSize || 5, { gridType: 'points', property: 'value', units: 'kilometers' })
                let bands = turf.isobands(grid, breaks, { zProperty: 'value', breaksProperties })
                L.geoJSON(bands, {
                    style: f => ({ color: f.properties.fill, fillColor: f.properties.fill, weight: 1, fillOpacity: 0.6 }),
                    onEachFeature: (f, layer) => layer.bindTooltip((valAttr || 'value') + ': ' + f.properties.value)
                }).addTo(spa['mpid'])
            } catch (e) { console.log('error in isoline', e) }
        }

                    r.coordinates = Object.values(L.latLngBounds(r.data.map(v => _parseCoordinates(v.coordinates))).getCenter()) //r.data[0].coordinates; //171

                    if (spa.isoline && window.turf) _drawIsolines(pivotRowData, pivotData.valAttrs[0])  //181
                    spa.mapStyle = {}
                    if (!spa.isolineOnly) {}

        r.coordinates = _parseCoordinates(r.coordinates) //311










function _isolineColor(v, mn, mx) {                                 // 蓝(低) -> 红(高) 色相插值
    let t = mx > mn ? (v - mn) / (mx - mn) : 0.5
    return 'hsl(' + Math.round(240 - 240 * t) + ', 80%, 45%)'
}
function _drawIsolines(rows, valAttr) {
    try {
        let pts = rows.filter(r => Array.isArray(r.coordinates) && typeof r.rowTotal == 'number')
            .map(r => turf.point(r.coordinates, { value: r.rowTotal }))
        if (pts.length < 3) return
        let values = pts.map(p => p.properties.value)
        let mn = Math.min(...values), mx = Math.max(...values)
        let nBands = spa.isolineBreaks || 9
        let breaks = Array.from({ length: nBands + 1 }, (_, i) => mn + (mx - mn) * i / nBands)
        let breaksProperties = Array.from({ length: nBands }, (_, i) => ({ fill: _isolineColor(mn + (mx - mn) * (i + 0.5) / nBands, mn, mx) }))
        let grid = turf.interpolate(turf.featureCollection(pts), spa.isolineCellSize || 5, { gridType: 'points', property: 'value', units: 'kilometers' })
        let bands = turf.isobands(grid, breaks, { zProperty: 'value', breaksProperties })
        L.geoJSON(bands, {
            style: f => ({ color: f.properties.fill, fillColor: f.properties.fill, weight: 1, fillOpacity: 0.6 }),
            onEachFeature: (f, layer) => layer.bindTooltip((valAttr || 'value') + ': ' + f.properties.value)
        }).addTo(spa['mpid'])
    } catch (e) { console.log('error in isoline', e) }
}
function _drawIsolines(rows, valAttr) {
    try {
        let pts = rows.filter(r => Array.isArray(r.coordinates) && typeof r.rowTotal == 'number')
            .map(r => turf.point(r.coordinates, { value: r.rowTotal }))
        if (pts.length < 3) return
        let values = pts.map(p => p.properties.value)
        let mn = Math.min(...values), mx = Math.max(...values)
        let nBands = spa.isolineBreaks || 9
        let breaks = Array.from({ length: nBands + 1 }, (_, i) => mn + (mx - mn) * i / nBands)
        let grid = turf.interpolate(turf.featureCollection(pts), spa.isolineCellSize || 5, { gridType: 'points', property: 'value', units: 'kilometers' })
        if (spa.isoshade) {                                                          // filled color bands
            let breaksProperties = Array.from({ length: nBands }, (_, i) => ({ fill: _isolineColor(mn + (mx - mn) * (i + 0.5) / nBands, mn, mx) }))
            let bands = turf.isobands(grid, breaks, { zProperty: 'value', breaksProperties })
            L.geoJSON(bands, {
                style: f => ({ color: f.properties.fill, fillColor: f.properties.fill, weight: spa.isoline ? 0 : 1, fillOpacity: 0.6 }),
                onEachFeature: (f, layer) => layer.bindTooltip((valAttr || 'value') + ': ' + f.properties.value)
            }).addTo(spa['mpid'])
        }
        if (spa.isoline) {                                                           // contour lines at the same breaks
            let lines = turf.isolines(grid, breaks, { zProperty: 'value' })
            L.geoJSON(lines, {
                style: f => ({ color: _isolineColor(f.properties.value, mn, mx), weight: 2 }),
                onEachFeature: (f, layer) => layer.bindTooltip((valAttr || 'value') + ': ' + f.properties.value.toFixed(2))
            }).addTo(spa['mpid'])
        }
    } catch (e) { console.log('error in isoline', e) }
}

//=================
function togglePivotMap() {
    spa.pivotMap = !spa.pivotMap
    $('.pvtRenderer').trigger('change')                                     // redraw map with the new flag, without re-running prcsData/user columns
}

function toggleIsoline() {
    spa.isoline = !spa.isoline
    $('.pvtRenderer').trigger('change')
}

function toggleIsoshade() {
    spa.isoshade = !spa.isoshade
    $('.pvtRenderer').trigger('change')
}

function toggleIsoOnly() {
    spa.iso_only = !spa.iso_only
    $('.pvtRenderer').trigger('change')
}


<select onchange="({frame:togglePivotFrame, pivot:toggleMapOn,pivotMap:togglePivotMap,isoline:toggleIsoline,isoshade:toggleIsoshade,iso_only:toggleIsoOnly,'+map':toggleMapPosition,'-wrap':wrapLiDivPairs})[this.value]?.();this.value=''">
    <option value="">Layout ▾</option>
    <option disabled>──on/off──</option>
    <option value="pivot">Pivot</option>
    <option value="frame">Frame</option>
    <option value="pivotMap">PivotMap</option>
    <option disabled>──isoline──</option>
    <option value="isoline">Isoline</option>
    <option value="isoshade">Isoshade</option>
    <option value="iso_only">Iso only</option>
    <option disabled>───up/dn──</option>


if ((spa.isoline || spa.isoshade) && window.turf) _drawIsolines(pivotRowData, pivotData.valAttrs[0])
spa.mapStyle = {}
if (!spa.iso_only) pivotRowData.forEach(r => {                                              //  loop through pivotRowData
