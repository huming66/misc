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