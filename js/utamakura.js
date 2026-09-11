document.addEventListener('DOMContentLoaded', function () {
  // URLから座標とズーム率を取得
  var lat = parseFloat(getQueryStringValue("lat")) || 35.00371208810041; // デフォルト座標
  var lng = parseFloat(getQueryStringValue("lng")) || 135.7415699197699; // デフォルト座標
  var zoom = parseFloat(getQueryStringValue("zoom")) || 6;
  // console.log("Lat:", lat, "Lng:", lng, "Zoom:", zoom);

  // URLに含まれるlatitude、longitudeが想定外の場合
  if (isNaN(lat) || isNaN(lng)) {
    // デフォルトのlatitude、longitudeを設定する
    lat = 35.6895;
    lng = 139.6917;
  }

  // 地図を初期化
  var mymap = L.map('map').setView([lat, lng], zoom);

  // OpenStreetMapのタイルレイヤーを追加
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mymap);

  // マーカーとポリゴンのレイヤーグループ
  let markers = L.layerGroup();
  let polygons = L.layerGroup();

  let searchLayer; // searchLayerをここで定義

  // GeoJSON データを取得
  fetch("../js/utamakuralocation.js?20260812-08")
    .then(response => response.json())
    .then(data => {
      L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          let iconUrl;
          if (feature.properties.type === 'type1') {
            iconUrl = '../img/map_icon.svg';
          } else if (feature.properties.type === 'type2') {
            iconUrl = '../img/map_icon2.svg';
          } else {
            iconUrl = '../img/map_icon.svg';
          }

          let marker = L.marker(latlng, {
            icon: L.icon({
              iconUrl: iconUrl,
              iconSize: [40, 25],
              iconAnchor: [16, 16],
              popupAnchor: [0, -16]
            })
          });

          let popupContent = feature.properties.name;
          marker.bindPopup(popupContent);
          markers.addLayer(marker);
          return marker;
        },
        style: function (feature) {
          return {
            color: feature.properties.color || '#3388ff',
            fillColor: feature.properties.fillColor || '#3388ff',
            fillOpacity: feature.properties.fillOpacity || 0.5
          };
        },
        onEachFeature: function (feature, layer) {
          let popupContent = feature.properties.name;
          layer.bindPopup(popupContent);
          polygons.addLayer(layer);
        }
      });

      mymap.addLayer(markers);
      mymap.addLayer(polygons);

      // searchLayerを初期化
      searchLayer = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, {
            radius: 0
          });
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup(feature.properties.name);
        }
      }).addTo(mymap);

      // 検索プラグインの利用
      const searchControl = new L.Control.Search({
        layer: searchLayer,
        zoom: 14,
        propertyName: 'kajin',
        initial: false,
      });

      searchControl._searchText = function (e) {
        return e?.target?.value.trim() || '';
      };

      searchControl._input && searchControl._input.addEventListener('keyup', function () {
        searchControl._handleKeypress();
      });

      mymap.addControl(searchControl);
    })
    .catch(error => {
      console.error("Error loading GeoJSON:", error);
    });

  // スケールコントロールを追加
  L.control.scale().addTo(mymap);

  // リンクアイコンのコントロールを作成
  // let linkControl = L.control({ position: 'topright' });
  // linkControl.onAdd = function (map) {
  //   let div = L.DomUtil.create('div', 'custom-link-control');
  //   div.innerHTML = '<h1><a href="index.html"><img src="../img/icon_toppage_2.png" alt="百人一首の歌枕" style="width:150px"></a></h1>';
  //   return div;
  // };
  // linkControl.addTo(mymap);

  // URLから座標とズーム率を取得して、地図を初期化
  function getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
  }
});
